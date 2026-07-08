const more = document.querySelector(".more");
const moreButton = document.querySelector(".more-button");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function closeMoreMenu() {
  more?.classList.remove("open");
  moreButton?.setAttribute("aria-expanded", "false");
}

function closeMobileNav() {
  navLinks?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}

moreButton?.addEventListener("click", () => {
  const open = more.classList.toggle("open");
  moreButton.setAttribute("aria-expanded", String(open));
});

menuButton?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (event) => {
  if (more && !more.contains(event.target)) {
    closeMoreMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMoreMenu();
    closeMobileNav();
  }
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMobileNav();
  }
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!(link instanceof HTMLAnchorElement)) return;
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.target || link.hash || link.protocol === "mailto:" || link.protocol === "tel:") return;
  if (link.origin !== window.location.origin) return;

  event.preventDefault();
  document.body.classList.add("is-leaving");
  window.setTimeout(() => {
    window.location.href = link.href;
  }, 260);
});

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    }
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const welcomePhotos = [...document.querySelectorAll(".welcome-photo-stack .welcome-photo")];
if (welcomePhotos.length > 1 && !reduceMotion.matches) {
  let activePhoto = 0;
  window.setInterval(() => {
    welcomePhotos[activePhoto].classList.remove("active");
    activePhoto = (activePhoto + 1) % welcomePhotos.length;
    welcomePhotos[activePhoto].classList.add("active");
  }, 7000);
}

const parallaxItems = [...document.querySelectorAll("[data-parallax]")];

function updateParallax() {
  if (reduceMotion.matches) return;

  const viewport = window.innerHeight || 1;
  for (const item of parallaxItems) {
    const img = item.querySelector("img");
    if (!img) continue;

    const rect = item.getBoundingClientRect();
    const amount = Number(item.dataset.parallax || 0);
    const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
    img.style.setProperty("--parallax", `${progress * amount * -80}px`);
  }
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  window.requestAnimationFrame(() => {
    updateParallax();
    ticking = false;
  });
  ticking = true;
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateParallax);
updateParallax();
