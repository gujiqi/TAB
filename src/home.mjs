import { icon } from "./icons.mjs";
import { locale } from "./meta.mjs";

export function home(lang, { asset, link }) {
  const t = locale(lang);
  const slides = [
    ["hero.webp", t("Moss sporophytes", "藓类孢子体")],
    ["liverwort.webp", t("Liverworts", "苔类")],
    ["hornwort.webp", t("Hornworts", "角苔类")],
  ];
  const metrics = [
    [
      "sprout",
      "10,152",
      t("Species names", "物种名称"),
      t(
        "In the project compilation, including names awaiting reconciliation.",
        "项目汇编所涉及，含有待归并的名称。",
      ),
    ],
    [
      "layers",
      "607",
      t("Retained fields", "保留编码字段"),
      t(
        "Of 1,067 original coded fields in the working glossary.",
        "工作词典共有 1,067 个原始编码字段。",
      ),
    ],
    [
      "grid",
      "4",
      t("Database modules", "数据库模块"),
      t(
        "A framework linking traits, environments and biodiversity.",
        "连接性状、环境与生物多样性的科学框架。",
      ),
    ],
  ];
  const gateways = [
    [
      "traits",
      "cells.webp",
      t("Trait Explorer", "性状探索器"),
      t(
        "Find a definition, follow a code and explore the working glossary.",
        "查找定义、追踪编码，探索当前的性状词典。",
      ),
    ],
    [
      "discover",
      "moss.webp",
      t("Discover Bryophytes", "认识苔藓植物"),
      t(
        "A closer look at the structures and generations of three plant lineages.",
        "走近三大苔藓植物类群，观察它们的结构与世代交替。",
      ),
    ],
    [
      "atlas",
      "habitat.webp",
      t("Planetary Atlas", "行星性状图谱"),
      t(
        "Explore the questions behind a future geographic synthesis.",
        "了解未来地理综合研究所关注的科学问题。",
      ),
    ],
  ];
  return `<section class="hero" aria-labelledby="hero-title" data-slides="${encodeURIComponent(JSON.stringify(slides.map(([file, title]) => ({ url: asset("media/" + file), title }))))}">
 <img class="hero-photo" src="${asset("media/hero.webp")}" alt="" fetchpriority="high"><div class="hero-shade"></div>
 <div class="wrap hero-frame"><div class="hero-copy"><div class="eyebrow hero-tag"><span></span>${t("Global bryophyte trait database", "全球苔藓植物性状库")}</div>
 <h1 id="hero-title" lang="en">Traits Across<br><em>Bryophytes</em></h1>
 <p class="hero-sub">${t("A Planetary Synthesis of Bryophyte Traits", "构建苔藓植物性状的行星全景")}</p>
 <div class="actions"><a class="button bright" href="${link("traits")}">${icon("lens", 17)}${t("Explore traits", "探索性状")}</a><a class="button outline" href="${link("about")}">${t("About TAB", "关于 TAB")}</a></div></div>
 <div class="hero-base"><a class="scroll" href="#overview">${icon("down", 16)}${t("Explore the project", "了解项目")}</a>
 <div class="gallery"><span class="image-name" aria-live="polite">${icon("camera", 16)}<span>${slides[0][1]}</span></span>
 <button type="button" data-step="-1" aria-label="${t("Previous photograph", "上一幅摄影")}">${icon("prev", 14)}</button><button type="button" data-step="1" aria-label="${t("Next photograph", "下一幅摄影")}">${icon("next", 14)}</button></div></div></div></section>
 <section class="overview" id="overview" aria-label="${t("Project at a glance", "项目概览")}"><div class="wrap stat-grid">${metrics.map(([i, v, l, n]) => `<div class="stat"><span class="stat-icon">${icon(i, 23)}</span><div><strong data-number="${v.replace(",", "")}">${v}</strong><h2>${l}</h2><p>${n}</p></div></div>`).join("")}</div><details class="wrap metric-notes"><summary>${t("How these figures are counted", "查看统计口径")}</summary><dl>${metrics.map(([, v, l, n]) => `<dt>${v} · ${l}</dt><dd>${n}</dd>`).join("")}</dl></details></section>
 <section class="wrap entry-section"><div class="section-heading"><div><span class="eyebrow">${t("Explore TAB", "探索 TAB")}</span><h2>${t("A closer look", "走近苔藓世界")}<i>.</i></h2></div><p>${t("From a single leaf cell to the landscapes bryophytes inhabit, discover the biology behind the database.", "从一枚叶细胞到苔藓植物栖居的生境，探索数据库背后的生命世界。")}</p></div>
 <div class="entry-grid">${gateways.map(([p, f, title, d]) => `<a class="entry" href="${link(p)}"><div class="entry-img"><img loading="lazy" src="${asset("media/" + f)}" alt=""></div><h3>${title}</h3><p>${d}</p></a>`).join("")}</div></section>
 <section class="field-note"><div class="wrap field-layout"><div class="field-image"><img src="${asset("media/habitat.webp")}" alt="${t("Bryophytes in their habitat", "生境中的苔藓植物")}" loading="lazy"></div><div><span class="eyebrow">${t("The science", "科学愿景")}</span><h2>${t("Small plants.<br><em>Planetary perspectives.</em>", "微小植物，<br><em>行星视野。</em>")}</h2><p>${t("A leaf cell can influence how a moss holds water. A capsule can shape how its spores disperse. TAB brings descriptions of these structures together so researchers can compare them across species and environments.", "叶细胞会影响藓类的持水能力，孢蒴结构则关系到孢子的传播。TAB 汇集这些结构的描述，使研究者能够跨物种、跨环境比较。")}</p><a class="text-link" href="${link("database")}">${t("Explore the scientific framework", "探索数据库科学框架")}</a></div></div></section>
 <section class="wrap progress-section"><span class="eyebrow">${t("Research progress", "研究进展")}</span><h2>${t("Building the synthesis", "逐步建立全球综合性状库")}</h2><div class="timeline">${[
   [
     t("Established", "已建立"),
     t("A working glossary", "工作词典"),
     t(
       "Original field definitions and matrix selection flags can be inspected together.",
       "原始字段定义与矩阵筛选标记可一并核对。",
     ),
   ],
   [
     t("In development", "建设中"),
     t("Comparable records", "可比较的记录"),
     t(
       "Reconciling species names and connecting records to their sources underpin the next stage.",
       "下一阶段的基础是归并物种名称，并将记录与出处相连。",
     ),
   ],
   [
     t("Planned", "计划扩展"),
     t("A wider synthesis", "更广的研究尺度"),
     t(
       "The framework makes room for physiological measurements, evolutionary histories and environmental associations.",
       "框架为生理测量、演化历史和环境关联预留了空间。",
     ),
   ],
 ]
   .map(
     ([s, h, d]) =>
       `<article><small>${s}</small><h3>${h}</h3><p>${d}</p></article>`,
   )
   .join(
     "",
   )}</div><a class="text-link" href="${link("publications")}">${t("Data and release status", "查看数据与发布状态")}</a></section>`;
}
