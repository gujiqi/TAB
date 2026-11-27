export const pages = {
  home: [
    ["Home", "首页"],
    ["A Planetary Synthesis of Bryophyte Traits", "构建苔藓植物性状的行星全景"],
  ],
  about: [
    ["About TAB", "关于 TAB"],
    [
      "How can a description in a flora help explain a pattern across continents? TAB brings these scales together.",
      "一部植物志中的形态描述，如何帮助我们理解跨大陆的生态格局？TAB 希望连接这两个尺度。",
    ],
  ],
  discover: [
    ["Discover Bryophytes", "认识苔藓植物"],
    [
      "Meet the mosses, liverworts and hornworts. Their structures reveal a life cycle quite different from that of flowering plants.",
      "从藓类、苔类到角苔类，观察它们的结构，认识与开花植物迥异的生活史。",
    ],
  ],
  database: [
    ["Database Framework", "数据库框架"],
    [
      "Four linked modules place biological traits in their environmental, ecological and evolutionary context.",
      "四个相互关联的模块，将生物学性状置于环境、生态与演化背景之中。",
    ],
  ],
  traits: [
    ["Trait Explorer", "性状探索器"],
    [
      "Search original field codes and definitions, examine their biological context and check which fields entered the filtered matrix.",
      "检索原始编码与定义，查看性状的生物学背景，并核对字段是否纳入筛选后的矩阵。",
    ],
  ],
  species: [
    ["Species Explorer", "物种探索器"],
    [
      "A place for future taxon profiles, where each trait record can be traced to the name and source under which it was reported.",
      "为未来的分类单元档案预留空间，让每条性状记录都能追溯至原始学名与出处。",
    ],
  ],
  atlas: [
    ["Planetary Atlas", "行星性状图谱"],
    [
      "What changes as we move from a single leaf cell to a biome? Explore the scales of a future trait atlas.",
      "从一枚叶细胞到一个生物群区，研究问题如何变化？探索未来性状图谱的空间尺度。",
    ],
  ],
  methods: [
    ["Methods & Standards", "方法与标准"],
    [
      "From a published description to a comparable record, every measurement needs a biological subject, a method and a source.",
      "从文献描述到可比较的记录，每个测量值都需要明确其生物学对象、方法与出处。",
    ],
  ],
  publications: [
    ["Data & Publications", "数据与成果"],
    [
      "Release status, documentation and the information needed to cite future TAB data products.",
      "查看版本发布状态、数据说明，以及未来正式引用 TAB 数据产品所需的信息。",
    ],
  ],
  network: [
    ["Network & Contribute", "科研协作"],
    [
      "A shared vocabulary begins with local expertise. Help shape the future of bryophyte trait research.",
      "共同的性状词汇始于各地的专业知识。了解未来可以参与的苔藓植物性状研究。",
    ],
  ],
  credits: [
    ["Image Credits", "图像与许可"],
    [
      "The photographers, image collections and type designers behind this site.",
      "本网站所用摄影、图像与字体的来源和许可。",
    ],
  ],
};
export const locale = (lang) => (en, zh) => (lang === "en" ? en : zh);
export const pageName = (slug, lang) => pages[slug][0][lang === "en" ? 0 : 1];
