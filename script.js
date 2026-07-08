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

const realisationItems = [...document.querySelectorAll("[data-step]")];
const realisationStack = document.querySelector(".realisation-stack");
const finalPromise = document.querySelector(".final-promise");
const homeHeroButton = document.querySelector(".hero-button");

function showRealisation(step) {
  realisationItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.step === String(step));
  });

  if (realisationStack && step !== 3) {
    realisationStack.classList.remove("show-1", "show-2", "show-3", "show-4");
  }
}

function showStackCount(count) {
  if (!realisationStack) return;
  showRealisation(3);
  realisationStack.classList.remove("show-1", "show-2", "show-3", "show-4");
  realisationStack.classList.add(`show-${count}`);
}

if (realisationItems.length) {
  if (reduceMotion.matches) {
    showRealisation(4);
    finalPromise?.classList.add("active");
    homeHeroButton?.classList.add("active");
  } else {
    const sequence = [
      { step: 0, at: 0 },
      { step: 1, at: 5250 },
      { step: 2, at: 10500 },
      { stack: 1, at: 15750 },
      { stack: 2, at: 19250 },
      { stack: 3, at: 22750 },
      { stack: 4, at: 26250 },
      { step: 4, at: 31500 },
    ];

    sequence.forEach(({ step, stack, at }) => {
      window.setTimeout(() => {
        if (stack) {
          showStackCount(stack);
        } else {
          showRealisation(step);
        }
      }, at);
    });

    window.setTimeout(() => {
      finalPromise?.classList.add("active");
    }, 36800);

    window.setTimeout(() => {
      homeHeroButton?.classList.add("active");
    }, 38100);
  }
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
