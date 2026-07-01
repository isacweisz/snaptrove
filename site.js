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
