/* Browser-local dictionary reader. Source fields are never sent to a server. */
const root = document.getElementById("explorer");
const chinese = document.documentElement.lang.toLowerCase().startsWith("zh");
const t = (en, zh) => (chinese ? zh : en);
const number = new Intl.NumberFormat(chinese ? "zh-CN" : "en-US");
const unknown = "—";
const pending = t("Awaiting annotation", "待标注");
const pageSize = 12;

// Chinese interface labels for controlled vocabulary. The source wording is
// preserved in the record details alongside the translated label.
const terms = {
  Morphology: "形态",
  Reproduction: "繁殖",
  "Life history": "生活史",
  "Ecological response": "生态响应",
  "Morphology and Anatomy": "形态与解剖",
  "Reproduction and Life History": "繁殖与生活史",
  "Environmental Associations": "环境关联属性",
  Biochemistry: "生物化学",
  Physiology: "生理",
  "Cytogenetics and Genomic Traits": "细胞遗传与基因组性状",
  "Binary indicator": "二元指示变量",
  "Derived binary indicator": "衍生二元指示变量",
  "Continuous measurement": "连续测量值",
  Count: "计数",
  "Ordinal category": "有序类别",
  "Categorical numeric code": "类别数值编码",
  "Categorical text": "类别文本",
  "Mixed binary and text": "二元与文本混合",
  "Not assessable (all values missing)": "无法判定（值全部缺失）",
  Yes: "已纳入",
  No: "未纳入",
  Costa: "中肋",
  Leaf: "叶片",
  "Leaf cell": "叶细胞",
  "Leaf architecture": "叶片构造",
  "Leaf morphology": "叶片形态",
  "Leaf shape": "叶形",
  "Leaf colour": "叶色",
  "Capsule colour": "孢蒴颜色",
  "Leaf margin and surface": "叶缘与叶面",
  "Other bryophyte characters": "其他苔藓植物特征",
  "Leaf and underleaf": "叶与腹叶",
  "Leaf and branch arrangement": "叶与枝的排列",
  "Reproductive organ morphology": "繁殖器官形态",
  "Stem and branch": "茎与枝",
  Rhizoid: "假根",
  Rhizoids: "假根",
  "Capsule morphology": "孢蒴形态",
  "Sporophyte and spore": "孢子体与孢子",
  "Spore surface": "孢子表面",
  "Seta, operculum and annulus": "蒴柄、蒴盖与蒴环",
  "Peristome and lamella": "蒴齿与片层结构",
  "Scales, elaters and thallus aeration": "鳞片、弹丝与叶状体通气结构",
  "Ventral lobule": "腹瓣",
  "Liverwort accessory structures and ventral scales": "苔类附属结构与腹鳞片",
  "Leaf lobes, cilia and cuticle": "叶裂片、纤毛与角质层",
  "Oil body": "油体",
  "Oil cell, pseudocosta and water sac": "油细胞、假中肋与水囊",
  Perianth: "蒴萼",
  "Marsupium and receptacle": "囊鞘与生殖托",
  "Branching and size": "分枝与大小",
  "Plant and leaf dimensions": "植株与叶片的尺寸",
  "Life strategy and life form": "生活史策略与生活型",
  "Growth form": "生长型",
  "Ecological dominance": "生态优势度",
  "Sexual system and spore ornamentation": "性系统与孢子纹饰",
  "Spore dimensions": "孢子尺寸",
  "Sporophyte frequency, season and seta": "孢子体发生频率、季节与蒴柄",
  "Capsule orientation and vegetative reproduction": "孢蒴朝向与营养繁殖",
  "Vegetative propagation": "营养繁殖",
  "Substrate association": "基质关联",
  "Aquatic association": "水生环境关联",
  "Habitat association": "生境关联",
  "Habitat breadth": "生境宽度",
  "Forest association": "森林关联",
  "Human disturbance association": "人为干扰关联",
  "Additional leaf and liverwort structures": "其他叶片与苔类结构",
  "Liverwort reproductive structures": "苔类繁殖结构",
  Gametophyte: "配子体",
  Sporophyte: "孢子体",
  Spore: "孢子",
  "Cellular and tissue structure": "细胞与组织结构",
  "Cell structure": "细胞结构",
  "Vegetative structure": "营养结构",
  Capsule: "孢蒴",
  "Reproductive structures": "繁殖结构",
  "Sexual system": "性系统",
  "Sexual reproduction": "有性繁殖",
  Seta: "蒴柄",
  "Life-history strategy": "生活史策略",
  "Disturbance association": "干扰关联",
};
function translate(value, original = false) {
  if (value === unknown || !value) return pending;
  if (!chinese || !Object.hasOwn(terms, value)) return value;
  return original ? terms[value] + " · " + value : terms[value];
}
function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function button(label, className) {
  const b = el("button", label, className);
  b.type = "button";
  return b;
}
const facets = [
  ["category", t("Source category", "原始分类")],
  ["domain", t("Source domain", "原始结构或领域")],
  ["dataType", t("Data type", "数据类型")],
  ["selected", t("Matrix inclusion", "筛选矩阵状态")],
  ["group", t("Framework category", "框架一级分类")],
  ["subgroup", t("Framework subgroup", "框架二级分类")],
  ["entity", t("Biological entity", "生物学对象")],
  ["stage", t("Life-cycle stage", "生活史阶段")],
  ["theme", t("Research theme", "研究主题")],
];

function parseDictionary(data) {
  if (
    !data ||
    data.format !== "tab-glossary-v1" ||
    !Array.isArray(data.records) ||
    !data.records.length
  ) {
    throw new Error("Unrecognized dictionary.");
  }
  const ids = new Set();
  const keys = [
    "id",
    "name",
    "definition",
    "category",
    "domain",
    "dataType",
    "selected",
  ];
  return data.records.map((source) => {
    if (
      !source ||
      !keys.every((key) => typeof source[key] === "string") ||
      !source.id ||
      !["Yes", "No"].includes(source.selected) ||
      ids.has(source.id)
    ) {
      throw new Error("Invalid or duplicate dictionary record.");
    }
    ids.add(source.id);
    const record = Object.fromEntries(keys.map((key) => [key, source[key]]));
    const hints =
      data.mapping && Object.hasOwn(data.mapping, source.id)
        ? data.mapping[source.id]
        : {};
    for (const [key] of facets.slice(4)) {
      record[key] =
        typeof hints?.[key] === "string" && hints[key] ? hints[key] : unknown;
    }
    // Chinese labels also participate in search. Names/definitions are verbatim.
    record.search = [
      record.id,
      record.name,
      record.definition,
      ...facets.flatMap(([key]) => [record[key], translate(record[key])]),
    ]
      .join(" ")
      .toLocaleLowerCase();
    return record;
  });
}

function recordView(record) {
  const detail = el("details", undefined, "tx-record");
  const summary = el("summary");
  const code = el("span", record.id, "tx-id");
  const name = el("strong", record.name);
  name.lang = "en";
  const status = el(
    "span",
    record.selected === "Yes"
      ? t("In matrix", "已纳入矩阵")
      : t("Outside matrix", "未纳入矩阵"),
    "tx-status",
  );
  summary.append(code, name, status, el("span", "+", "tx-plus"));
  summary.lastChild.setAttribute("aria-hidden", "true");
  const body = el("div", undefined, "tx-detail");
  const definition = el("p", record.definition || pending, "tx-definition");
  if (record.definition) definition.lang = "en";
  body.append(
    el("h3", t("Source definition", "来源定义（英文原文）")),
    definition,
  );
  function addFields(fields) {
    const dl = el("dl");
    fields.forEach(([key, label]) => {
      const item = el("div");
      item.append(el("dt", label), el("dd", translate(record[key], true)));
      dl.append(item);
    });
    body.append(dl);
  }
  addFields(facets.slice(0, 4));
  body.append(
    el("h3", t("Provisional framework mapping", "框架映射（暂定）")),
    el(
      "p",
      t(
        "Navigation terms inferred from the source label or domain. Each assignment is open to curatorial review.",
        "检索标签依据原始名称或所属领域建立，映射关系有待逐项审订。",
      ),
      "tx-note",
    ),
  );
  addFields(facets.slice(4));
  body.append(
    el(
      "p",
      t("Source · Explanation of traits", "来源工作表 · Explanation of traits"),
      "tx-note",
    ),
  );
  detail.append(summary, body);
  return detail;
}

async function explorer() {
  root.classList.add("tx");
  const local = root.dataset.preview === "true";
  let records = [],
    page = 1,
    loadSequence = 0;
  const controls = new Map();
  const overview = el("section", undefined, "tx-overview");
  const retained = 607;
  const original = 1067;
  const percentage = new Intl.NumberFormat(chinese ? "zh-CN" : "en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(retained / original);
  const overviewText = el("div");
  overviewText.append(
    el("h2", t("The working glossary", "工作词典概况")),
    el(
      "p",
      t(
        "The workbook describes 1,067 original coded fields. Its filtered matrix retains 607 of those fields. Several fields can describe different states of one biological trait.",
        "工作簿记录了 1,067 个原始编码字段，筛选后的矩阵保留其中 607 个。同一生物学性状的不同状态可分别对应多个编码字段。",
      ),
    ),
  );
  const metric = el("div", undefined, "tx-overview-metric");
  const barLabel = el("div", undefined, "tx-overview-label");
  barLabel.append(
    el("strong", percentage),
    el("span", t("of fields retained", "字段保留率")),
  );
  const barTrack = el("div", undefined, "tx-track");
  barTrack.setAttribute("aria-hidden", "true");
  const barFill = el("span");
  barFill.style.width = (retained / original) * 100 + "%";
  barTrack.append(barFill);
  metric.append(
    barLabel,
    barTrack,
    el(
      "small",
      t(
        "607 retained / 1,067 original fields",
        "607 个保留字段 / 1,067 个原始字段",
      ),
    ),
  );
  overview.append(overviewText, metric);
  const top = el("div", undefined, "tx-library");
  const text = el("div");
  const title = el("h2", t("Open a field dictionary", "打开性状编码词典"));
  const explanation = el(
    "p",
    t(
      "Individual field definitions await public release. To search a dictionary you already hold, open its TAB glossary JSON file. Your file stays in this browser tab.",
      "逐项编码及定义待获准公开。若你已持有 TAB 词典的 JSON 文件，可在此打开并检索。文件仅在当前浏览器标签页内读取。",
    ),
  );
  text.append(title, explanation);
  const input = el("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.hidden = true;
  const choose = button(
    t("Open local dictionary", "打开本地词典"),
    "tx-button",
  );
  choose.addEventListener("click", () => input.click());
  top.append(text, choose, input);
  const message = el("p", "", "tx-feedback");
  message.setAttribute("role", "status");
  const panel = el("section", undefined, "tx-search-panel");
  panel.hidden = true;
  panel.setAttribute("aria-label", t("Search and filters", "搜索与筛选"));
  const searchLabel = el(
    "label",
    t("Search the dictionary", "搜索词典"),
    "tx-search-label",
  );
  const search = el("input");
  search.type = "search";
  search.placeholder = t(
    "Name, field code or definition",
    "输入性状名称、编码或定义",
  );
  searchLabel.append(search);
  const advanced = el("details", undefined, "tx-filters");
  const trigger = el("summary", t("Filter fields", "筛选字段"));
  const grid = el("div", undefined, "tx-grid");
  for (const [key, label] of facets) {
    const wrapper = el("label", label);
    const select = el("select");
    select.setAttribute("aria-label", label);
    select.addEventListener("change", () => {
      page = 1;
      refresh();
    });
    wrapper.append(select);
    controls.set(key, select);
    grid.append(wrapper);
  }
  advanced.append(trigger, grid);
  const reset = button(
    t("Reset search & filters", "重置搜索与筛选"),
    "tx-reset",
  );
  reset.addEventListener("click", () => {
    for (const control of controls.values()) control.value = "";
    search.value = "";
    page = 1;
    refresh();
    search.focus();
  });
  const coverage = el("section", undefined, "tx-coverage");
  const chartTitle = el(
    "h3",
    t("Matrix retention by source category", "各原始分类的矩阵保留比例"),
  );
  const chartNote = el(
    "p",
    t(
      "Retained fields / source fields. Select a category to filter the dictionary.",
      "已纳入字段数 / 原始字段数。选择分类可筛选词典。",
    ),
    "tx-note",
  );
  const chart = el("div", undefined, "tx-chart");
  coverage.append(chartTitle, chartNote, chart);
  const resultHead = el("div", undefined, "tx-result-head");
  const count = el("output");
  count.setAttribute("aria-live", "polite");
  resultHead.append(count, reset);
  const results = el("div", undefined, "tx-results");
  const nav = el("nav", undefined, "tx-pager");
  nav.setAttribute("aria-label", t("Dictionary pages", "词典分页"));
  const previous = button(t("Previous", "上一页"), "tx-page");
  const next = button(t("Next", "下一页"), "tx-page");
  const pageLabel = el("span");
  previous.onclick = () => {
    page--;
    refresh();
    resultHead.scrollIntoView({ block: "nearest" });
  };
  next.onclick = () => {
    page++;
    refresh();
    resultHead.scrollIntoView({ block: "nearest" });
  };
  nav.append(previous, pageLabel, next);
  panel.append(coverage, searchLabel, advanced, resultHead, results, nav);
  root.append(overview, top, message, panel);

  function refresh() {
    const words = search.value
      .trim()
      .toLocaleLowerCase()
      .split(/\s+/u)
      .filter(Boolean);
    const selected = [...controls].filter(([, select]) => select.value);
    const filtered = records.filter(
      (record) =>
        words.every((word) => record.search.includes(word)) &&
        selected.every(([key, select]) => record[key] === select.value),
    );
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const matches = number.format(filtered.length);
    for (const b of chart.children) {
      b.setAttribute(
        "aria-pressed",
        String(controls.get("category").value === b.value),
      );
    }
    count.value = t(
      matches + " matching fields",
      "匹配 " + matches + " 个编码字段",
    );
    trigger.textContent =
      t("Filter fields", "筛选字段") +
      (selected.length ? " (" + selected.length + ")" : "");
    previous.disabled = page === 1;
    next.disabled = page === pages;
    nav.hidden = pages < 2;
    pageLabel.textContent = t(
      "Page " + page + " of " + pages,
      "第 " + page + " 页，共 " + pages + " 页",
    );
    results.replaceChildren(
      ...filtered.slice((page - 1) * pageSize, page * pageSize).map(recordView),
    );
    if (!filtered.length) {
      results.append(
        el(
          "p",
          t(
            "No fields match. Try a shorter term or remove a filter.",
            "没有匹配的编码字段。可缩短检索词或调整筛选条件。",
          ),
          "tx-empty",
        ),
      );
    }
  }

  function open(data, sequence, published = false) {
    if (sequence !== loadSequence) return;
    const imported = parseDictionary(data);
    records = imported;
    for (const [key, control] of controls) {
      const values = [...new Set(records.map((row) => row[key]))].sort((a, b) =>
        translate(a).localeCompare(translate(b), chinese ? "zh-CN" : "en"),
      );
      control.replaceChildren(new Option(t("All", "全部"), ""));
      for (const value of values)
        control.add(new Option(translate(value), value));
    }
    const byCategory = new Map();
    for (const record of records) {
      const counts = byCategory.get(record.category) || {
        total: 0,
        retained: 0,
      };
      counts.total++;
      if (record.selected === "Yes") counts.retained++;
      byCategory.set(record.category, counts);
    }
    chart.replaceChildren();
    for (const [category, counts] of byCategory) {
      const b = button("", "tx-category");
      b.value = category;
      b.append(
        el("span", translate(category)),
        el(
          "small",
          number.format(counts.retained) + " / " + number.format(counts.total),
        ),
      );
      const track = el("span", undefined, "tx-track");
      track.setAttribute("aria-hidden", "true");
      const bar = el("span");
      bar.style.width = (counts.retained / counts.total) * 100 + "%";
      track.append(bar);
      b.append(track);
      b.onclick = () => {
        const sourceFilter = controls.get("category");
        sourceFilter.value = sourceFilter.value === category ? "" : category;
        page = 1;
        refresh();
      };
      chart.append(b);
    }
    search.value = "";
    page = 1;
    const kept = records.filter((row) => row.selected === "Yes").length;
    title.textContent = published
      ? t("Released field dictionary", "已公开性状词典")
      : t("Local field dictionary", "本地性状词典");
    explanation.textContent = t(
      number.format(records.length) +
        " source fields · " +
        number.format(kept) +
        " retained in the filtered matrix",
      number.format(records.length) +
        " 个原始编码字段 · 筛选矩阵纳入 " +
        number.format(kept) +
        " 个字段",
    );
    choose.textContent = t("Change dictionary", "更换词典");
    message.textContent = "";
    overview.hidden = true;
    panel.hidden = false;
    refresh();
  }
  search.addEventListener("input", () => {
    page = 1;
    refresh();
  });
  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;
    const sequence = ++loadSequence;
    try {
      open(JSON.parse(await file.text()), sequence);
    } catch {
      if (sequence === loadSequence)
        message.textContent = t(
          "Could not read this dictionary. Choose a JSON file generated by the TAB glossary importer.",
          "无法读取此词典。请选择 TAB 词典提取工具生成的 JSON 文件。",
        );
    }
    input.value = "";
  });
  if (local || root.dataset.dictionaryUrl) {
    const sequence = ++loadSequence;
    try {
      const url = local
        ? new URL("../private/glossary.json", import.meta.url)
        : new URL(root.dataset.dictionaryUrl, document.baseURI);
      if (
        url.origin !== location.origin ||
        !["http:", "https:"].includes(url.protocol)
      ) {
        throw new Error("Dictionary must be a same-origin file.");
      }
      const response = await fetch(url, {
        cache: "no-store",
        redirect: "error",
        credentials: "omit",
      });
      if (!response.ok) throw new Error("Unavailable");
      open(await response.json(), sequence, !local);
    } catch {
      if (sequence === loadSequence) {
        message.textContent = local
          ? t(
              "Local dictionary unavailable. Choose an exported JSON file to begin.",
              "尚未载入本地词典。可选择已导出的 JSON 文件开始检索。",
            )
          : t(
              "The released dictionary could not be loaded. Reload to retry or open a local copy.",
              "已公开词典暂时无法载入。可刷新页面重试，或打开本地副本。",
            );
      }
    }
  }
}
if (root) explorer();
