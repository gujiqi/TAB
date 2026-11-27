"""Build the local TAB field dictionary. Requires Python 3.9+ and no packages."""

import argparse
import json
import os
import posixpath
import re
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile

X = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
COLUMNS = {
    "Trait code": "id",
    "Trait category": "category",
    "Trait domain": "domain",
    "Data type": "dataType",
    "English trait name": "name",
    "English definition": "definition",
    "Selected in filtered matrix": "selected",
}
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "private" / "glossary.json"


def sheet_paths(book):
    workbook = ET.fromstring(book.read("xl/workbook.xml"))
    relations = ET.fromstring(book.read("xl/_rels/workbook.xml.rels"))
    paths = {}
    for relation in relations:
        target = relation.get("Target")
        if relation.get("TargetMode") != "External":
            paths[relation.get("Id")] = posixpath.normpath(posixpath.join("xl", target)).lstrip("/")
    return {sheet.get("name"): paths[sheet.get(R + "id")] for sheet in workbook.find(X + "sheets")}


def cell_text(element):
    return "".join(node.text or "" for node in element.iter(X + "t"))


def rows(book, path, strings):
    with book.open(path) as stream:
        for _, row in ET.iterparse(stream, events=("end",)):
            if row.tag != X + "row":
                continue
            values = {}
            for cell in row.findall(X + "c"):
                column = re.match(r"[A-Z]+", cell.attrib["r"])[0]
                kind = cell.get("t")
                value = cell.findtext(X + "v", "")
                if kind == "s":
                    value = strings[int(value)]
                elif kind == "inlineStr":
                    value = cell_text(cell)
                values[column] = value
            if any(values.values()):
                yield values
            row.clear()


# These conservative navigation hints are separate from the source dictionary.
# Mixed domains and ambiguous labels stay unmapped. A future release may
# substitute reviewed per-ID annotations without editing the seven source fields.
def navigation_hints(row):
    domain = row["domain"]
    name = row["name"].lower()
    morphology = "Morphology and Anatomy"
    life_history = "Reproduction and Life History"
    if domain == "Costa":
        values = morphology, "Leaf", "Costa", "Gametophyte", "Leaf architecture"
    elif domain in {"Leaf margin and surface", "Leaf colour"}:
        values = morphology, "Leaf", "Leaf", "Gametophyte", "Leaf architecture"
    elif domain == "Leaf cell":
        values = morphology, "Cellular and tissue structure", "Leaf cell", "Gametophyte", "Cell structure"
    elif domain == "Rhizoid" and "rhizoid" in name:
        values = morphology, "Rhizoids", "Rhizoid", "Gametophyte", "Vegetative structure"
    elif domain == "Capsule colour" or (domain == "Capsule morphology" and "capsule" in name):
        values = morphology, "Sporophyte", "Capsule", "Sporophyte", "Reproductive structures"
    elif "spore" in name and (
        domain in {"Spore dimensions", "Spore surface"} or "spore ornamentation" in name
    ):
        values = morphology, "Spore", "Spore", "Spore", "Reproductive structures"
    elif domain == "Sexual system and spore ornamentation" and (
        "sexual system" in name or "sexual-system" in name
    ):
        values = life_history, "Sexual system", "Gametophyte", "Gametophyte", "Sexual reproduction"
    elif "seta length" in name:
        values = morphology, "Sporophyte", "Seta", "Sporophyte", "Reproductive structures"
    elif name.startswith("life strategy:"):
        values = life_history, "Life-history strategy", None, None, "Life history"
    elif name.startswith("mean leaf length") or name.startswith("mean leaf width"):
        values = morphology, "Leaf", "Leaf", "Gametophyte", "Leaf architecture"
    elif domain == "Human disturbance association":
        values = "Environmental Associations", "Disturbance association", None, None, "Habitat association"
    elif domain in {"Aquatic association", "Habitat association", "Forest association"}:
        values = "Environmental Associations", "Habitat association", None, None, "Habitat association"
    else:
        return {}
    return {k: v for k, v in zip(("group", "subgroup", "entity", "stage", "theme"), values) if v}


def extract(path):
    with ZipFile(path) as book:
        sheets = sheet_paths(book)
        strings = []
        if "xl/sharedStrings.xml" in book.namelist():
            strings = [cell_text(s) for s in ET.fromstring(book.read("xl/sharedStrings.xml"))]
        dictionary_rows = rows(book, sheets["Explanation of traits"], strings)
        titles = next(dictionary_rows)
        if not COLUMNS.keys() <= set(titles.values()):
            raise ValueError("Unrecognized glossary header. Check the seven expected source columns.")
        fields = {col: COLUMNS[label] for col, label in titles.items() if label in COLUMNS}
        records = []
        for cells in dictionary_rows:
            row = {key: cells.get(col, "") for col, key in fields.items()}
            if not row["id"] or row["selected"] not in {"Yes", "No"}:
                raise ValueError("Missing code or unexpected matrix-selection flag.")
            records.append(row)
        ids = [row["id"] for row in records]
        if len(ids) != len(set(ids)):
            raise ValueError("Duplicate trait codes in the glossary.")
        # Read only the header of the matrix. No species names, values or
        # observation records enter the application or its local export.
        header = next(rows(book, sheets["Trait Matrix"], strings))
        columns = [value for value in header.values() if value and value.lower() != "species"]
        expected = {r["id"] for r in records if r["selected"] == "Yes"}
        if len(columns) != len(expected) or set(columns) != expected:
            raise ValueError("Retained glossary fields do not match the unique matrix columns.")
        notes = list(rows(book, sheets["Read me"], strings))
        if not notes:
            raise ValueError("Missing workbook scope notes.")
    return {
        "format": "tab-glossary-v1",
        "sourceSheet": "Explanation of traits",
        "records": records,
        "mapping": {r["id"]: hint for r in records if (hint := navigation_hints(r))},
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workbook", type=Path)
    args = parser.parse_args()
    result = extract(args.workbook)
    OUTPUT.parent.mkdir(exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=OUTPUT.parent, delete=False) as out:
        temp_path = Path(out.name)
        try:
            json.dump(result, out, ensure_ascii=False, separators=(",", ":"))
        except BaseException:
            out.close()
            temp_path.unlink(missing_ok=True)
            raise
    try:
        os.replace(temp_path, OUTPUT)
    finally:
        temp_path.unlink(missing_ok=True)
    kept = sum(row["selected"] == "Yes" for row in result["records"])
    print(f"Local dictionary: {len(result['records']):,} coded fields, {kept:,} retained.")


if __name__ == "__main__":
    main()
