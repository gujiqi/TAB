import { pages, pageName, locale } from "./meta.mjs";
import { icon } from "./icons.mjs";

export function shell(page, lang, ctx, content) {
  const t = locale(lang),
    { link, asset, canonical } = ctx;
  const title = pageName(page, lang);
  const group = (label, slugs) =>
    `<details class="nav-group"><summary${slugs.includes(page) ? ' class="is-section"' : ""}>${label}${icon("chevron", 14)}</summary><div class="nav-pop">${slugs.map(navLink).join("")}</div></details>`;
  const navLink = (p, label) =>
    `<a href="${link(p)}" ${page === p ? 'aria-current="page"' : ""}>${typeof label === "string" ? label : pageName(p, lang)}</a>`;
  const brand = `<a class="brand" href="${link("home")}" aria-label="TAB · ${t("Home", "首页")}"><img src="${asset("media/logo.webp")}" width="84" height="33" alt="TAB"><span>Traits Across<br>Bryophytes</span></a>`;
  const other = lang === "en" ? "zh" : "en",
    lnav = t("Navigation", "导航");
  const description = pages[page][1][lang === "en" ? 0 : 1];
  const footGroup = (name, slugs) =>
    `<div><h2>${name}</h2>${slugs.map((p) => navLink(p)).join("")}</div>`;
  const nav = `${navLink("home")}${navLink("about", t("About", "关于"))}${navLink("discover", t("Discover", "认识苔藓植物"))}${group(t("Database", "数据库"), ["database", "traits", "species", "atlas"])}${group(t("Research", "科学研究"), ["methods", "publications", "network"])}`;
  const inner =
    page === "home"
      ? ""
      : `<section class="inner-head"><div class="wrap"><nav aria-label="${t("Breadcrumb", "当前位置")}" class="crumb"><a href="${link("home")}">${t("Home", "首页")}</a><span>/</span>${title}</nav><h1>${title}</h1><p>${description}</p></div></section>`;
  return `<!doctype html><html lang="${t("en", "zh-CN")}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#123b2f"><title>${page === "home" ? "TAB · Traits Across Bryophytes" : title + " · TAB"}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical(page, lang)}"><link rel="alternate" hreflang="en" href="${canonical(page, "en")}"><link rel="alternate" hreflang="zh-CN" href="${canonical(page, "zh")}"><meta property="og:type" content="website"><meta property="og:site_name" content="Traits Across Bryophytes"><meta property="og:title" content="${title} · Traits Across Bryophytes"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical(page, lang)}"><meta property="og:image" content="${canonical("home", "en")}assets/media/share.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${asset("media/favicon.png")}"><link rel="stylesheet" href="${asset("site.css")}">${page === "traits" ? `<link rel="stylesheet" href="${asset("explorer.css")}">` : page !== "home" ? `<link rel="stylesheet" href="${asset("science.css")}">` : ""}</head><body>
 <a class="skip" href="#main">${t("Skip to content", "跳至正文")}</a><header class="masthead"><div class="wrap mast-row">${brand}<nav id="main-nav" aria-label="${lnav}">${nav}</nav><div class="mast-controls"><a class="language" href="${link(page, other)}" hreflang="${t("zh-CN", "en")}" lang="${t("zh-CN", "en")}" aria-label="${t("切换至简体中文", "Switch to English")}">${icon("globe", 17)}<span>${t("中文", "EN")}</span></a><button type="button" class="mobile-toggle" aria-controls="main-nav" aria-expanded="false" aria-label="${lnav}">${icon("menu")}</button></div></div></header>
 <main id="main" tabindex="-1">${inner}${page === "home" ? content : `<div class="science-content wrap">${content}</div>`}</main>
 <footer class="site-footer"><div class="wrap"><div class="footer-grid"><div class="footer-brand"><b>TAB</b><p>Traits Across Bryophytes</p><small>${t("A Planetary Synthesis of Bryophyte Traits", "构建苔藓植物性状的行星全景")}</small></div>${footGroup(t("Project", "项目"), ["about", "discover", "network"])}${footGroup(t("Explore", "探索"), ["database", "traits", "species", "atlas"])}${footGroup(t("Research", "研究"), ["methods", "publications", "credits"])}</div><div class="footer-end"><span>Traits Across Bryophytes</span><a href="#main">${t("Back to top", "回到顶部")}</a></div></div></footer>
 <script type="module" src="${asset("site.js")}"></script>${page === "traits" ? `<script type="module" src="${asset("explorer.js")}"></script>` : ""}${ctx.scienceScript && page !== "home" && page !== "traits" ? `<script type="module" src="${asset("science.js")}"></script>` : ""}</body></html>`;
}
