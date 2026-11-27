const menu = document.querySelector("#main-nav");
const toggle = document.querySelector(".mobile-toggle");
const groups = [...menu.querySelectorAll("details")];
function closeMenus(except) {
  groups.forEach((group) => {
    if (group !== except) group.open = false;
  });
}
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("visible", open);
  if (!open) closeMenus();
});
groups.forEach((group) =>
  group.addEventListener("toggle", () => {
    if (group.open) closeMenus(group);
  }),
);
document.addEventListener("click", (event) => {
  if (!menu.contains(event.target)) closeMenus();
  if (!event.target.closest(".masthead")) {
    menu.classList.remove("visible");
    toggle.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const open = groups.find((group) => group.open);
  if (open) {
    open.open = false;
    open.querySelector("summary").focus();
  } else if (menu.classList.contains("visible")) {
    toggle.click();
    toggle.focus();
  }
});
const hero = document.querySelector("[data-slides]");
if (hero) {
  const slides = JSON.parse(decodeURIComponent(hero.dataset.slides));
  const img = hero.querySelector(".hero-photo");
  let index = 0;
  hero.querySelectorAll("[data-step]").forEach((button) =>
    button.addEventListener("click", async () => {
      index =
        (index + Number(button.dataset.step) + slides.length) % slides.length;
      const next = slides[index];
      const preload = new Image();
      preload.src = next.url;
      try {
        await preload.decode();
      } catch {
        return;
      }
      if (slides[index] !== next) return;
      img.src = next.url;
      hero.querySelector(".image-name span").textContent = next.title;
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        img.animate([{ opacity: 0.6 }, { opacity: 1 }], { duration: 380 });
    }),
  );
}
// Once a metric enters view, briefly reveal its verified number.
if (
  "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.animate(
          [
            { transform: "translateY(7px)", opacity: 0.5 },
            { transform: "translateY(0)", opacity: 1 },
          ],
          { duration: 420, easing: "ease-out" },
        );
      }),
    { threshold: 0.4 },
  );
  document
    .querySelectorAll("[data-number]")
    .forEach((el) => observer.observe(el));
}
