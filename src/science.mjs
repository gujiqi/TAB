import { groups } from "./framework.mjs";

const literature = {
  bryoatt: "https://nora.nerc.ac.uk/id/eprint/1131/",
  bryfor: "https://epub.uni-regensburg.de/47026/",
  bet: "https://onlinelibrary.wiley.com/doi/10.1111/jvs.13179",
  eastern: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12738707/",
  bryofite:
    "https://impact.ornl.gov/en/datasets/bryofite-preliminary-database-release/",
  gaps: "https://datadryad.org/dataset/doi:10.5061/dryad.wwpzgmsrn",
  water: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10244898/",
  spores:
    "https://besjournals.onlinelibrary.wiley.com/doi/10.1111/1365-2435.12606",
  botany: "https://www.anbg.gov.au/bryophyte/what-is-bryophyte.html",
  cycle: "https://anbg.gov.au/bryophyte/life-cycle-in-nutshell.html",
};

function citation(key, label) {
  return `<a class="sc-cite" href="${literature[key]}">${label}</a>`;
}

function section(title, body, id = "") {
  return `<section class="sc-block" ${id ? `id="${id}"` : ""}><h2>${title}</h2>${body}</section>`;
}

function paragraph(text) {
  return `<p>${text}</p>`;
}

function listRows(items) {
  return `<dl class="sc-rows">${items.map(([term, desc]) => `<div><dt>${term}</dt><dd>${desc}</dd></div>`).join("")}</dl>`;
}

function disclosure(title, body, open = false, group = "") {
  return `<details class="sc-details"${group ? ` name="${group}"` : ""}${open ? " open" : ""}><summary>${title}</summary><div class="sc-answer">${body}</div></details>`;
}

function image(asset, file, alt) {
  return `<img src="${asset("media/" + file + ".webp")}" alt="${alt}" decoding="async" loading="lazy">`;
}

function internal(link, slug, label) {
  return `<a class="sc-link" href="${link(slug)}">${label}</a>`;
}

function about({ t, asset, link }) {
  const origin = `<div class="sc-feature"><figure>${image(asset, "cells", t("Microscopic view of bryophyte leaf cells", "显微镜下的苔藓植物叶细胞"))}<figcaption>${t("Leaf cells of Plagiomnium undulatum", "Plagiomnium undulatum 的叶细胞")}</figcaption></figure><div><h2>${t("What a flora can tell us", "植物志里藏着怎样的性状？")}</h2><p>${t("A flora might describe the shape of a leaf tip, the surface of a spore or the way a plant branches. Such details are indispensable for identifying plants. Read together, they also let us ask why different bryophytes thrive in different places.", "植物志记录叶尖的形态、孢子的表面纹饰，也记录植株如何分枝。这些细节帮助人们鉴别物种。把来自不同植物志的描述放在一起，还可以追问：为什么不同的苔藓植物能在不同环境中生长？")}</p><p>${t("TAB began with morphological, reproductive and life-history descriptions in floras and taxonomic monographs. Keeping each description connected to its source lets researchers revisit a character when authors disagree or a name changes.", "TAB 从植物志与分类学专著出发，整理形态、繁殖及生活史描述。将每条描述与原始出处相连，才能在文献记载不一致或学名发生变化时，回到原文核查。")}</p></div></div>`;
  const related = paragraph(
    t(
      "Surveys along elevational gradients in eastern China add a regional perspective, while BryoFITE compiles ecophysiological measurements for ecosystem models. Their different purposes help explain why a regional occurrence, a floristic description and an experimental measurement need different kinds of metadata.",
      "中国东部沿海拔梯度开展的调查提供了区域尺度的资料，BryoFITE 则面向生态系统模型整理生态生理测量值。它们的研究目的各异，也说明区域出现记录、植物志描述和实验测量需要分别保存相应的背景信息。",
    ) +
      " " +
      citation("eastern", "Wang et al. (2025)") +
      " · " +
      citation("bryofite", "BryoFITE"),
  );
  const context = section(
    t("The limits of regional comparisons", "从区域研究走向跨区域比较"),
    paragraph(
      t(
        "Bryophytes occupy humid forests, seasonally dry habitats and polar ground. Measurements are much more unevenly distributed. A literature synthesis by Coe and colleagues documented strong geographic and taxonomic biases in measured moss traits.",
        "苔藓植物分布于湿润森林、季节性干旱生境，乃至极地地表。现有测量资料的覆盖却很不均衡。Coe 等对藓类功能性状文献的梳理指出，研究在地理区域和分类群上均存在明显偏倚。",
      ) +
        " " +
        citation(
          "gaps",
          t("Coe et al. · source data", "Coe 等 · 文献综述数据"),
        ),
    ) +
      paragraph(
        t(
          "Regional compilations offer complementary starting points. BRYOATT describes British and Irish bryophytes, BryForTrait emphasises Central European forest species, and BET brings together biological and environmental attributes across Europe. TAB aims to extend comparisons across regions while retaining the original biological descriptions.",
          "不同尺度的汇编已有各自的积累。BRYOATT 整理英国与爱尔兰的苔藓植物属性，BryForTrait 关注中欧森林物种，BET 汇集欧洲苔藓植物的生物学属性与环境关联。TAB 希望在保留原始生物学描述的基础上，拓展可比较的区域和类群。",
        ) +
          " " +
          ["bryoatt", "bryfor", "bet"]
            .map((x, i) => citation(x, ["BRYOATT", "BryForTrait", "BET"][i]))
            .join(" · "),
      ) +
      related,
  );
  const questions = section(
    t("Questions guiding the synthesis", "推动汇编的科学问题"),
    listRows([
      [
        t("Form and environment", "形态与环境"),
        t(
          "Which combinations of leaf, shoot and colony traits recur along moisture gradients?",
          "在水分梯度上，哪些叶片、枝条与藓丛性状组合反复出现？",
        ),
      ],
      [
        t("Reproduction and establishment", "繁殖与定殖"),
        t(
          "How do dispersal structures and reproductive strategies relate to the places a species can colonise?",
          "传播结构与繁殖策略如何关联物种能够定殖的生境？",
        ),
      ],
      [
        t("Shared evolutionary history", "共同演化历史"),
        t(
          "Does a trait–environment relationship hold within lineages as well as across them? Future tests will require phylogenies, distributions and comparable trait records.",
          "跨谱系发现的性状与环境关系，在谱系内部是否也成立？检验这一问题还需要系统发育、物种分布及可比的性状记录。",
        ),
      ],
    ]) +
      internal(
        link,
        "database",
        t("Explore the scientific framework", "查看数据库的科学框架"),
      ),
  );
  return origin + context + questions;
}

// Original schematic of a typical moss shoot. Repeated, overlapping leaf outlines are stylised.
function mossDrawing(t) {
  const leaves = Array.from({ length: 9 }, (_, i) => {
    const x = 123 + i * 1.7,
      y = 225 - i * 6;
    return `<g transform="translate(${x} ${y}) scale(${1 - i * 0.038})"><path d="M0 1 Q-25 -3 -35 -32 Q-9 -21 0 1 M0 1 Q-18 -14 -32 -30"/><path d="M0 -2 Q5 -23 32 -32 Q23 -11 0 -2 M1 -3 L29 -29"/></g>`;
  }).join("");
  return `<svg viewBox="0 0 310 285" aria-hidden="true" class="sc-moss" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke="#8da67f" stroke-width="1.7" fill="#234635"><path d="M122 239 Q120 212 137 158"/> ${leaves}
    <path d="M138 169 Q124 155 126 139 Q138 150 138 169 M137 168 Q135 143 153 130 Q150 152 137 168"/></g>
    <g stroke="#b8a06b" stroke-width="2"><path d="M136 162 Q140 121 159 80 Q165 67 169 61"/><path d="M169 61 Q167 48 180 39 Q190 33 204 36 Q202 48 192 56 Q182 65 169 61Z" fill="#706c39"/><path d="M171 58 Q183 56 199 40 M201 36 Q204 30 211 30 Q211 34 204 38"/></g>
    <g stroke="#b09a77" stroke-width="1.25"><path d="M122 234 Q119 249 104 254 M121 237 Q129 249 119 261 M121 238 Q103 244 101 251 M124 241 Q134 247 132 254"/></g>
    <g class="sc-spores" fill="#e6cd8f"><circle cx="217" cy="27" r="2"/><circle cx="230" cy="34" r="2"/><circle cx="227" cy="20" r="1.6"/></g>
    <g stroke="#ddeda3" stroke-width="1.6" stroke-dasharray="3 4"><circle class="sc-poi sc-poi-spore" cx="224" cy="27" r="17"/><ellipse class="sc-poi sc-poi-shoot" cx="125" cy="193" rx="45" ry="55"/><ellipse class="sc-poi sc-poi-seta" cx="162" cy="101" rx="36" ry="70" transform="rotate(22 162 101)"/><ellipse class="sc-poi sc-poi-release" cx="199" cy="40" rx="33" ry="23"/></g>
    <g stroke="#93a496" stroke-width=".8"><path d="M190 48 H228 L240 60 H283"/><path d="M151 106 H83 L67 96 H27"/><path d="M131 193 H201 L213 180 H280"/><path d="M113 245 H56 L44 236 H24"/></g>
    <g fill="#e0e7dc" font-family="system-ui,sans-serif" font-size="12"><text x="228" y="77">${t("Capsule", "孢蒴")}</text><text x="27" y="87">${t("Seta", "蒴柄")}</text><text x="209" y="171">${t("Leafy shoot", "茎叶体")}</text><text x="23" y="229">${t("Rhizoids", "假根")}</text></g></svg>`;
}

function discover({ t, asset, link }) {
  const lineages = [
    [
      "moss",
      t("Mosses", "藓类"),
      t("Capsules on a Polytrichum moss", "金发藓属植物的孢蒴"),
      t(
        "Most form leafy shoots. Look for a capsule, often held above the leaves on a stalk called a seta.",
        "多形成具茎叶的枝条。产生孢子体时，常可见蒴柄将孢蒴托举至茎叶之上。",
      ),
    ],
    [
      "liverwort",
      t("Liverworts", "苔类"),
      t("Gemma cup on Marchantia polymorpha", "地钱叶状体上的芽胞杯"),
      t(
        "Some have rows of small leaves. Others grow as flattened, branching bodies called thalli. Both forms belong to the same lineage.",
        "有些苔类具有成行排列的小叶，有些形成扁平、分枝的叶状体。这两种差异明显的形态同属苔类。",
      ),
    ],
    [
      "hornwort",
      t("Hornworts", "角苔类"),
      t("Elongated sporophytes of Anthoceros", "角苔属植物的细长孢子体"),
      t(
        "The green plant is a thallus. In many species the narrow sporophytes rise like horns, elongating from near the base.",
        "绿色植物体为叶状体。许多种类的孢子体狭长如角，可从近基部持续伸长。",
      ),
    ],
  ];
  const groupsIntro = section(
    t("Three lineages, seen up close", "近看苔藓植物的三个类群"),
    paragraph(
      t(
        "Bryophytes are small land plants that reproduce by spores. A leafy shoot or a flat green thallus is usually the part you notice first. It is the gametophyte, the generation that produces eggs or sperm.",
        "苔藓植物是通过孢子繁殖的陆生植物。最先映入眼帘的茎叶体或扁平叶状体通常是配子体，也就是产生卵细胞或精子的世代。",
      ),
    ) +
      `<div class="sc-gallery">${lineages.map(([file, title, alt, desc]) => `<figure>${image(asset, file, alt)}<figcaption><h3>${title}</h3><p>${desc}</p></figcaption></figure>`).join("")}</div>` +
      citation(
        "botany",
        t(
          "Field guide · Australian National Botanic Gardens",
          "科普资料 · 澳大利亚国家植物园",
        ),
      ),
  );
  const stages = [
    [
      t("Spore and germination", "孢子与萌发"),
      t(
        "A haploid spore begins to grow when conditions allow. In many mosses the first visible growth is a network of fine filaments, the protonema. Buds on it develop into leafy shoots.",
        "条件适宜时，单倍体孢子开始萌发。许多藓类最先形成细丝状的原丝体，原丝体上的芽随后发育成茎叶体。",
      ),
    ],
    [
      t("The gametophyte", "配子体"),
      t(
        "The leafy generation grows independently. Rhizoids anchor the shoot, and specialised organs produce eggs or swimming sperm. Water enables sperm to reach an egg.",
        "茎叶体能够独立生活，假根起固着作用。专门的配子囊产生卵或能游动的精子。精子借助水到达卵细胞。",
      ),
    ],
    [
      t("Fertilisation and sporophyte growth", "受精与孢子体发育"),
      t(
        "The fertilised egg develops into a diploid sporophyte attached to the gametophyte. In a typical moss, a foot connects the sporophyte to its parent and a seta supports the capsule.",
        "受精卵发育成二倍体孢子体，着生于配子体并从中获得营养。典型藓类的孢子体以基足与母体相连，蒴柄支撑孢蒴。",
      ),
    ],
    [
      t("Meiosis and spore release", "减数分裂与孢子释放"),
      t(
        "Inside the capsule, spore mother cells undergo meiosis. The resulting haploid spores can disperse and begin the cycle again. Vegetative fragments or gemmae offer another route to a new gametophyte.",
        "孢蒴内的孢子母细胞经过减数分裂，产生单倍体孢子。孢子散布后可重新萌发。营养体片段或芽胞也能繁殖出新的配子体。",
      ),
    ],
  ];
  const cycle = `<section class="sc-life"><figure>${mossDrawing(t)}<figcaption>${t("Generalised moss anatomy · schematic, not to scale", "藓类基本结构示意 · 非等比例")}</figcaption></figure><div><h2>${t("Two generations, one life cycle", "两个世代，一个生活史")}</h2><p>${t("Follow a typical moss from one spore to the next. Select a stage to read more.", "从一枚孢子开始，依次了解典型藓类的生活史。选择各阶段可阅读说明。")}</p>${stages.map(([title, desc], i) => disclosure(title, paragraph(desc), i === 0, "moss-life")).join("")}${citation("cycle", t("Life-cycle guide · Australian National Botanic Gardens", "生活史资料 · 澳大利亚国家植物园"))}</div></section>`;
  const why = section(
    t("When a small structure matters", "微小的结构怎样影响生活？"),
    paragraph(
      t(
        "A trait is a characteristic we can describe or measure, such as leaf shape or spore diameter. In the moss genus <i>Syntrichia</i>, leaf cells, shoots and the spacing between shoots all help shape how water moves through a colony.",
        "性状是可以描述或测量的生物学特征，例如叶形或孢子直径。在赤藓属（<i>Syntrichia</i>）中，叶细胞、枝条以及枝条间距都与藓丛内的水分传导有关。",
      ) +
        " " +
        citation("water", "Jauregui-Lazo et al. (2023)"),
    ) +
      paragraph(
        t(
          "Other structures affect reproduction. In <i>Brachythecium rutabulum</i>, teeth around the capsule opening respond to air humidity and help regulate spore release. Comparing such characters across lineages can reveal which responses are widespread and which are distinctive.",
          "其他结构则可能影响繁殖。以 <i>Brachythecium rutabulum</i> 为例，孢蒴开口处的蒴齿可随空气湿度变化而开合，调节孢子释放。跨谱系比较这些性状，有助于分辨哪些响应具有共性，哪些与特定类群有关。",
        ) +
          " " +
          citation("spores", "Johansson et al. (2016)"),
      ) +
      paragraph(
        t(
          "At larger scales, bryophyte mats can intercept water and influence nutrient cycling. Peat-forming mosses contribute to long-term carbon accumulation. Linking organismal measurements to ecosystem processes requires observations at both scales.",
          "在更大尺度上，苔藓植物形成的垫层可以截留水分并影响养分循环。参与泥炭形成的藓类有助于碳的长期积累。理解这些过程，需要分别观测植物自身的属性及生态系统的变化。",
        ),
      ) +
      internal(link, "traits", t("Open the Trait Explorer", "进入性状探索器")),
  );
  return groupsIntro + cycle + why;
}

function database({ t, link, zh }) {
  const categories = [
    [
      "morphology",
      t("Morphology and Anatomy", "形态与解剖"),
      t(
        "Current glossary includes structural characters",
        "现有词典包含结构性状",
      ),
    ],
    [
      "physiology",
      t("Physiology", "生理"),
      t("Source preparation in progress", "来源资料整理中"),
    ],
    [
      "biochemistry",
      t("Biochemistry", "生物化学"),
      t("Expansion planned", "计划扩展"),
    ],
    [
      "reproduction",
      t("Reproduction and Life History", "繁殖与生活史"),
      t(
        "Current compilation includes reproductive descriptions",
        "现有汇编包含繁殖描述",
      ),
    ],
    [
      "genetics",
      t("Cytogenetics and Genomic Traits", "细胞遗传与基因组性状"),
      t("Expansion planned", "计划扩展"),
    ],
  ];
  const modules = [
    [
      "core",
      "Ⅰ",
      t("Biological Traits", "生物学性状"),
      t(
        "Properties of a biological entity observed at a specified stage and scale. A leaf measurement needs a named part of the leaf as well as a unit.",
        "记录明确生活史阶段和尺度下生物学对象的属性。例如，测量叶片细胞时，需注明叶片部位和计量单位。",
      ),
    ],
    [
      "environment",
      "Ⅱ",
      t("Environmental Associations", "环境关联属性"),
      t(
        "Associations describe where a taxon occurs. A preference inferred from records of dry habitats and a measured tolerance of desiccation answer different questions.",
        "记录分类单元与环境的联系。由干旱生境记录推断的偏好，与实验测得的脱水耐受能力，回答的是两个不同的问题。",
      ),
    ],
    [
      "processes",
      "Ⅲ",
      t(
        "Biotic Interactions and Ecosystem Processes",
        "生物相互作用与生态系统过程",
      ),
      t(
        "These records retain the partners, sampled system and measurement scale. A peatland carbon flux belongs to the ecosystem in which it was measured.",
        "记录相互作用的伙伴、采样系统及测量尺度。例如，泥炭地碳通量归属于相应的生态系统观测。",
      ),
    ],
    [
      "biodiversity",
      "Ⅳ",
      t("Linked Biodiversity Data", "关联生物多样性数据"),
      t(
        "Taxonomic names connect biological descriptions to phylogenies, occurrence evidence and environmental or conservation context. Each link needs its own source and version.",
        "通过分类单元，生物学描述可与系统发育、出现记录、环境或保护信息建立联系。每条关联都需要注明来源与版本。",
      ),
    ],
  ];
  function groupedRows(key) {
    return listRows(
      groups[key].map((row) => [row[zh ? 1 : 0], row[zh ? 3 : 2]]),
    );
  }
  const figure = `<figure class="sc-tree"><div class="sc-tree-root"><span>${t("Shared taxon identity", "共同分类单元标识")}</span><strong>Taxon ID</strong></div><div class="sc-tree-branches">${modules.map(([id, num, title]) => `<a href="#module-${id}"><span>${num}</span>${title}</a>`).join("")}</div><figcaption>${t("Four modules linked through taxonomy. Select a branch to explore its scope.", "四个模块通过分类单元相连。选择分支可查看其收录范围设计。")}</figcaption></figure>`;
  const sections = modules
    .map(([id, num, title, desc]) => {
      const contents =
        id === "core"
          ? categories
              .map(([key, name, status]) =>
                disclosure(
                  name,
                  `<p class="sc-status">${status}</p>` + groupedRows(key),
                ),
              )
              .join("")
          : disclosure(
              t("View the data groups", "查看二级数据组"),
              groupedRows(id),
            );
      return section(
        `<small class="sc-roman">${num}</small> ${title}`,
        paragraph(desc) +
          (id === "core"
            ? paragraph(
                t(
                  "The groups below define the intended scope. Each category notes the state of compilation. Individual subgroup coverage still needs review.",
                  "以下二级分类描述规划范围。各一级类别标明整理进度，每个二级组的具体覆盖仍待核定。",
                ),
              )
            : `<p class="sc-status">${t("Planned extension", "计划扩展")}</p>`) +
          contents,
        `module-${id}`,
      );
    })
    .join("");
  return (
    figure +
    sections +
    section(
      t("How to read a classification", "如何理解分类与检索标签"),
      paragraph(
        t(
          "A spore diameter belongs to morphology, its biological entity is a spore, and a researcher may look it up under dispersal. The attribute, measured entity and research keyword can therefore be queried independently. The dictionary preserves its original codes and definitions alongside separately maintained framework mappings.",
          "以孢子直径为例，其属性分类为形态与解剖，测量对象是孢子，研究者也可能从传播主题检索它。因此，属性、生物学对象和研究标签需要独立组织。词典保留原始编码与定义，新框架通过单独维护的映射关联。",
        ),
      ) +
        internal(
          link,
          "traits",
          t("Explore the original coding fields", "检索原始编码字段"),
        ),
    )
  );
}

function species({ t, link, asset }) {
  return (
    `<div class="sc-feature sc-profile"><figure>${image(asset, "moss", t("Capsules above the green gametophytes of a haircap moss", "金发藓属植物绿色配子体上方的孢蒴"))}<figcaption><i>Polytrichum</i> · ${t("field photograph", "野外摄影")}</figcaption></figure><div><p class="sc-status">${t("Species profiles · Not yet released", "物种档案 · 尚未发布")}</p><h2>${t("From a name to a record", "从一个学名追溯一条记录")}</h2><p>${t("A single plant may appear under different names in different floras. A future TAB profile will connect the name in each source to a reviewed taxon, so that a botanical description remains traceable even when its accepted name changes.", "同一种植物在不同植物志中可能使用不同名称。未来的 TAB 档案将把每份来源中的原始学名关联到经核定的分类单元，使名称更新之后仍能追溯原描述。")}</p><p>${t("The compilation spans 10,152 species names, including names awaiting reconciliation. Public species search and comparisons will open when the corresponding records have been reviewed and cleared for release.", "项目汇编涉及 10,152 个物种名称，含待归并名称。相应记录完成核定并获得公开授权后，将开放物种检索与比较。")}</p></div></div>` +
    section(
      t("Planned contents of a profile", "物种档案的规划内容"),
      listRows([
        [
          t("Names and classification", "名称与分类"),
          t(
            "Search accepted names and source names, browse the taxonomic hierarchy and inspect how synonyms were reconciled.",
            "检索接受名与原始学名，浏览分类层级，核查异名归并依据。",
          ),
        ],
        [
          t("Traits and coverage", "性状及覆盖"),
          t(
            "Compare source-specific values and identify which structures, life stages and traits have documented observations. Coverage will use an explicit denominator.",
            "比较不同来源的性状值，识别具备观测依据的结构、生活史阶段及性状。覆盖率须注明分母。",
          ),
        ],
        [
          t("Provenance", "来源追溯"),
          t(
            "Follow each value to its observation, method, source and reuse conditions. Differences among descriptions remain visible.",
            "从性状值追溯到观测、方法、文献出处及再利用条件，并保留不同记载之间的差异。",
          ),
        ],
      ]) +
        internal(
          link,
          "methods",
          t(
            "Read about taxonomic and record standards",
            "了解分类学与记录标准",
          ),
        ),
    )
  );
}

function atlas({ t, asset, link }) {
  const scales = [
    [
      t("Cell", "细胞"),
      "cells",
      t("Read the leaf surface", "观察叶片表面"),
      t(
        "A microscope places the walls and outlines of individual cells in view. Recording where on the leaf they were examined makes a comparison interpretable.",
        "显微镜下可见细胞轮廓与细胞壁。记录它们位于叶片的哪个部位，才能解释不同观察结果之间的差异。",
      ),
      t(
        "Leaf cells of Plagiomnium undulatum",
        "Plagiomnium undulatum 的叶细胞",
      ),
    ],
    [
      t("Shoot", "枝条"),
      "moss",
      t("Recognise the measured structure", "辨认被测量的结构"),
      t(
        "A shoot carries many possible measurements. A leaf on the gametophyte and a capsule on the sporophyte belong to different generations.",
        "一个枝条涉及许多可测量对象。配子体上的叶片与孢子体的孢蒴分属不同世代。",
      ),
      t("A haircap moss with sporophytes", "带孢子体的金发藓属植物"),
    ],
    [
      t("Habitat", "生境"),
      "habitat",
      t("Place a record in its habitat", "把记录放回生境"),
      t(
        "A description gains ecological context when it is linked to a substrate, microhabitat and observation method. A forest photograph illustrates this scale of inquiry.",
        "将描述与基质、微生境及观测方法关联，才能解释其生态背景。这张森林照片展示的是研究尺度。",
      ),
      t("Bryophytes in the Hoh Rain Forest", "霍河雨林中的苔藓植物生境"),
    ],
    [
      t("Planet", "行星"),
      "globe",
      t("Compare across regions", "跨区域比较"),
      t(
        "A geographic synthesis needs traceable occurrences, coordinates with known uncertainty and comparable sampling. The atlas currently presents the research design. Geographic layers await verified data.",
        "地理综合研究需要可追溯的出现记录、标明不确定性的坐标，以及可比的采样方法。当前图谱展示研究设计，地理图层有待数据核定。",
      ),
      t(
        "Earth from Apollo 17 · NASA, 1972",
        "阿波罗 17 号拍摄的地球 · NASA，1972 年",
      ),
    ],
  ];
  return (
    `<section class="sc-atlas"><div class="sc-atlas-head"><span class="sc-kicker">${t("Atlas concept", "图谱概念示意")}</span><h2>${t("Choose a scale", "选择观察尺度")}</h2></div><fieldset class="sc-scale"><legend class="sc-visually-hidden">${t("Observation scale", "观察尺度")}</legend>${scales.map(([name], i) => `<input id="scale-${i}" type="radio" name="scale" value="${i}" ${i === 3 ? "checked" : ""}><label for="scale-${i}">${name}</label>`).join("")}${scales.map(([, file, title, desc, alt], i) => `<div class="sc-scale-panel sc-scale-${i}"><figure class="sc-lens">${image(asset, file, alt)}<figcaption>${alt}</figcaption></figure><div><h3>${title}</h3><p>${desc}</p></div></div>`).join("")}</fieldset></section>` +
    section(
      t("Questions for future atlas layers", "未来图层要回答的问题"),
      listRows([
        [
          t("Species and functional diversity", "物种与功能多样性"),
          t(
            "How do species richness and the range of trait combinations vary among biomes with comparable sampling?",
            "在采样可比的生物群区之间，物种丰富度和性状组合范围如何变化？",
          ),
        ],
        [
          t("Trait geography and climate", "性状地理格局与气候"),
          t(
            "Where do trait combinations recur, and how do their distributions relate to temperature and moisture gradients?",
            "哪些区域反复出现相似的性状组合？它们的分布与温度、水分梯度有何关联？",
          ),
        ],
        [
          t("Evolutionary history", "演化历史"),
          t(
            "How much geographic pattern is shared by related lineages? This requires taxonomically reconciled records linked to phylogenies.",
            "近缘谱系之间共享多少地理格局？这需要将归并后的分类记录与系统发育树关联。",
          ),
        ],
      ]) +
        internal(
          link,
          "database",
          t("Explore the linked biodiversity module", "了解关联生物多样性模块"),
        ),
    )
  );
}

function methods({ t, link }) {
  const identifiers = [
    [
      "Taxon ID",
      t("Which taxon?", "哪个分类单元？"),
      t(
        "A reviewed name linked to the wording in the original source.",
        "连接核定名称与来源中使用的原始名称。",
      ),
    ],
    [
      "Trait ID",
      t("Which character?", "哪项性状？"),
      t(
        "A defined property of a specified biological entity.",
        "指向特定生物学对象上定义明确的属性。",
      ),
    ],
    [
      "Observation ID",
      t("Which observation?", "哪次观测？"),
      t(
        "The sample, life stage, conditions and method behind the record.",
        "记录所对应的样本、生活史阶段、条件与方法。",
      ),
    ],
    [
      "Source ID",
      t("Which source?", "哪份来源？"),
      t(
        "The originating work or dataset and the terms for its use.",
        "指向原始文献或数据集，并关联使用条件。",
      ),
    ],
  ];
  const schema = section(
    t("The identity of a record", "一条数据记录的标识"),
    paragraph(
      t(
        "The relational design uses four distinct identifiers. Together they connect a trait value to a taxon, a definition, the circumstances of observation and the original source.",
        "关系型数据库设计保留四种独立标识。它们共同将性状值与分类单元、定义、观测背景及原始来源联系起来。",
      ),
    ) +
      `<div class="sc-identifiers">${identifiers.map(([id, q, a]) => `<div><code>${id}</code><h3>${q}</h3><p>${a}</p></div>`).join("")}</div>`,
  );
  const steps = [
    [
      t("Name reconciliation", "学名标准化"),
      t(
        "Keep the verbatim name, accepted name, synonym decision and taxonomic reference version together. Unresolved names remain available for review. Reconciliation can change the number of distinct accepted species.",
        "同时保存原始学名、接受名、异名处理依据与分类学参考版本。待定名称需保留供复核。归并可能改变最终的接受种数。",
      ),
    ],
    [
      t("Definitions, codes and legal states", "定义、编码与允许状态"),
      t(
        "Retain the original field code, English definition, data type, category, domain and selection flag. Store revised classifications in a separate mapping. A single categorical trait may be represented by several coded states.",
        "保留原始字段编码、英文定义、数据类型、类别、结构域及筛选标记。新分类通过独立映射维护。一项分类性状的多个状态可能各占一个编码字段。",
      ),
    ],
    [
      t("Units and measurement context", "单位与测量背景"),
      t(
        "Keep original and standardised values side by side, with unit conversions and methods recorded. For physiology, retain light, temperature, hydration, tissue, treatment and sampling level before comparing values.",
        "并列保存原始值和标准化值，记录单位换算与方法。比较生理性状前，需保留光照、温度、含水状态、组织、处理及采样层级。",
      ),
    ],
    [
      t("Missingness and quality control", "缺失处理与质量控制"),
      t(
        "An unreported character remains unknown. Code biological absence only when the source supports it. Validate types, allowed states, units and consistent links. Flag contradictions or uncertain mappings for review.",
        "原文未记载的性状保留为缺失。只有来源支持时才编码为生物学缺如。核查数据类型、允许状态、单位与关联标识，并标记冲突记载或不确定映射。",
      ),
    ],
    [
      t("Source-specific variation", "不同来源之间的变异"),
      t(
        "Preserve each source description and its record locator, such as a page, table or specimen reference. Aggregate only records with comparable methods and scales, documenting how ranges and disagreements were treated.",
        "分别保存各来源描述及其页码、表号或标本标识。仅在方法与尺度可比时汇总，并注明如何处理范围值及不一致的记载。",
      ),
    ],
    [
      t("Versioned releases", "版本管理"),
      t(
        "A future release should identify the dictionary and taxonomic versions, changes to mappings, inclusion criteria, licence and citation. Revisions should remain linked to earlier records so an analysis can be reconstructed.",
        "未来发布版本需注明词典与分类学版本、映射变更、纳入标准、许可和引用方式。修订记录应与历史版本保持关联，以便复现分析。",
      ),
    ],
  ];
  const standards = section(
    t("Curation standards", "整理与核查原则"),
    paragraph(
      t(
        "These principles guide future integration and release review. The working glossary can already be checked against the columns retained in its matrix.",
        "以下原则用于指导后续整合与发布审核。现有词典的筛选标记已可与矩阵实际保留的列进行核对。",
      ),
    ) + steps.map(([a, b], i) => disclosure(a, paragraph(b), i === 0)).join(""),
  );
  const tables = section(
    t("How the proposed tables connect", "规划中的数据表关系"),
    listRows([
      [
        t("Vocabulary", "性状词汇"),
        t(
          "Trait definitions, permitted states and mappings to other vocabularies are maintained independently of measured values.",
          "性状定义、合法状态以及与外部词表的映射独立于实测值维护。",
        ),
      ],
      [
        t("Observations and values", "观测与数值"),
        t(
          "Trait records refer to taxonomy, observations, sources and measurement methods. Multiple reported values can describe one taxon and trait.",
          "原始性状记录关联分类单元、观测背景、来源与方法。同一分类单元的一项性状可以保留多个来源值。",
        ),
      ],
      [
        t("Associations and processes", "关联与过程"),
        t(
          "Environmental associations, biotic interactions and ecosystem processes occupy separate tables that preserve the measured scale and partners.",
          "环境关联、生物相互作用及生态系统过程分别建表，保留对应尺度与作用对象。",
        ),
      ],
      [
        t("Derived products", "衍生数据产品"),
        t(
          "A species-by-trait matrix is a documented aggregation of records. It can be regenerated from a particular data version and a stated set of rules.",
          "物种 × 性状矩阵是按明确规则汇总记录的产物，可基于指定数据版本及规则重新生成。",
        ),
      ],
    ]) +
      internal(
        link,
        "database",
        t("Examine the trait classification", "查看性状分类体系"),
      ),
  );
  return schema + standards + tables;
}

function publications({ t, link }) {
  const register = section(
    t("Release register", "数据发布登记"),
    `<div class="sc-release"><div><span class="sc-status">${t("Not Yet Released", "尚未发布")}</span><h3>${t("TAB research dataset", "TAB 科研数据集")}</h3><p>${t("The working compilation contains a trait dictionary and a filtered matrix. Public release metadata will be added after taxonomic review, source checks and authorisation.", "工作汇编包含性状词典与筛选矩阵。分类学核查、来源核对及授权完成后，将在此登记公开版本。")}</p></div><dl>${[
      [t("Version", "版本"), t("Pending release", "待发布")],
      [t("Data licence", "数据许可"), t("Pending rights review", "待权利审核")],
      ["DOI", t("Not yet assigned", "尚未分配")],
      [
        t("Dataset citation", "数据引用方式"),
        t("Available with the release", "随版本发布"),
      ],
    ]
      .map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`)
      .join("")}</dl></div>`,
  );
  const manuscript = section(
    t("Research publications", "研究论文"),
    `<p class="sc-status">${t("Under Development", "撰写中")}</p><p>${t("The project manuscript is in preparation. The published title, author list and citation will be recorded here once confirmed.", "项目论文处于准备阶段。正式题名、作者及引用信息将在确认后登记。")}</p>`,
  );
  const reading = section(
    t("Background reading", "背景阅读"),
    paragraph(
      t(
        "These external works provide context for the TAB project.",
        "以下外部研究为 TAB 提供科学背景。",
      ),
    ) +
      listRows([
        [
          citation("bryoatt", "BRYOATT"),
          t(
            "Hill et al. (2007). Attributes of British and Irish mosses, liverworts and hornworts.",
            "Hill 等（2007）。英国与爱尔兰藓类、苔类及角苔类属性汇编。",
          ),
        ],
        [
          citation("bryfor", "BryForTrait"),
          t(
            "Bernhardt-Römermann et al. (2018). Life-history traits of forest bryophytes.",
            "Bernhardt-Römermann 等（2018）。森林苔藓植物生活史性状数据库。",
          ),
        ],
        [
          citation("bet", "BET"),
          t(
            "Van Zuijlen et al. (2023). A compilation of European bryophyte traits.",
            "Van Zuijlen 等（2023）。欧洲苔藓植物性状汇编。",
          ),
        ],
        [
          citation(
            "gaps",
            t("Moss functional trait ecology", "藓类功能性状生态学"),
          ),
          t(
            "Coe et al. (2024). Data underlying a synthesis of trends and gaps in moss trait research.",
            "Coe 等（2024）。藓类性状研究趋势与数据缺口综述的配套资料。",
          ),
        ],
      ]) +
      internal(link, "methods", t("Read the data standards", "阅读数据标准")),
  );
  return register + manuscript + reading;
}

function network({ t, link, asset }) {
  const introduction = `<div class="sc-feature"><figure>${image(asset, "habitat", t("Bryophyte-covered branches in the Hoh Rain Forest", "霍河雨林中附生苔藓植物覆盖的树枝"))}<figcaption>${t("Hoh Rain Forest · Olympic National Park", "霍河雨林 · 奥林匹克国家公园")}</figcaption></figure><div><h2>${t("Knowledge held in many places", "汇集来自不同地方的知识")}</h2><p>${t("A taxonomic specialist may know how a character was used in a local flora. A field ecologist may know which part of a shoot was sampled. Both kinds of knowledge are needed to compare bryophytes across regions.", "分类学专家熟悉地方植物志里某个性状术语的含义，野外生态学者了解测量时选取了枝条的哪个部位。跨区域比较苔藓植物，需要把这两类知识联系起来。")}</p><p>${t("TAB envisages collaboration on taxonomic reconciliation, trait harmonisation, source interpretation and analyses of trait evolution and species–environment relationships.", "TAB 计划围绕分类单元核定、性状标准化、原始资料判读、性状演化与物种—环境关系分析开展协作。")}</p></div></div>`;
  const contribute = section(
    t("Preparing a future contribution", "准备一份可贡献的数据"),
    listRows([
      [
        t("Describe the material", "说明贡献材料"),
        t(
          "Identify the dataset or botanical source, its scope, the original names used and the biological entities described. For measurements, include units, conditions and the sampling method.",
          "注明数据集或植物学来源、覆盖范围、原始学名及描述对象。对测量数据，附单位、测量条件与采样方法。",
        ),
      ],
      [
        t("Keep the route back to the source", "保留来源线索"),
        t(
          "Attach a bibliographic reference, specimen accession or other persistent source locator to each record. Retain the original wording beside any reinterpretation.",
          "为每条记录保留文献引用、标本编号或其他可定位的来源标识。重新解释时，应保留原文。",
        ),
      ],
      [
        t("Agree on reuse and credit", "明确再利用与署名"),
        t(
          "Identify the rights holder, permitted uses, citation, attribution and any embargo or access restrictions before a public release.",
          "公开之前确认权利人、允许的用途、引用方式、署名要求以及暂缓公开或访问限制。",
        ),
      ],
    ]) +
      internal(
        link,
        "methods",
        t("View the proposed record structure", "查看规划的数据记录结构"),
      ),
  );
  const partners = section(
    t("Contacts and participation", "联系与参与"),
    paragraph(
      t(
        "The collaboration network is planned. A submission channel and a directory of participating researchers and institutions will appear here when contacts, roles and permission to list them have been confirmed.",
        "科研协作网络处于规划阶段。正式联系渠道、成员角色及展示授权确认后，这里将公布数据提交方式，并列出参与研究者与机构。",
      ),
    ),
  );
  return introduction + contribute + partners;
}

const render = {
  about,
  discover,
  database,
  species,
  atlas,
  methods,
  publications,
  network,
};

export function sciencePage(page, lang, ctx) {
  if (!render[page]) throw new Error("Unknown scientific page: " + page);
  const zh = lang.startsWith("zh");
  return `<div class="sc-page sc-page-${page}">${render[page]({ ...ctx, zh, t: (en, cn) => (zh ? cn : en) })}</div>`;
}
