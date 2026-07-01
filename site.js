const nav = document.querySelector("[data-nav]");
const drawer = document.querySelector("[data-menu]");
const openButton = document.querySelector("[data-menu-open]");
const closeTargets = document.querySelectorAll("[data-menu-close]");

const updateNav = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 12);
};

const openMenu = () => {
  document.body.classList.add("menu-open");
  drawer?.setAttribute("aria-hidden", "false");
};

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  drawer?.setAttribute("aria-hidden", "true");
};

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));
openButton?.addEventListener("click", openMenu);
closeTargets.forEach((target) => target.addEventListener("click", closeMenu));
window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

document.querySelectorAll("[data-feature-search]").forEach((demo) => {
  const input = demo.querySelector("[data-feature-search-input]");
  const count = demo.querySelector("[data-feature-search-count]");
  const results = demo.querySelector("[data-feature-results]");
  const buttons = demo.querySelectorAll("[data-query]");

  buttons.forEach((button, index) => {
    if (index === 0) button.classList.add("is-active");

    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      if (input) input.value = button.dataset.query || "";
      if (count) count.textContent = button.dataset.count || "";
      if (results) {
        results.style.animation = "none";
        results.offsetHeight;
        results.style.animation = "";
        results.querySelectorAll("i").forEach((item, resultIndex) => {
          item.style.animationDelay = `${resultIndex * 45}ms`;
        });
      }
    });
  });
});
