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

document.querySelectorAll("[data-mobile-app]").forEach((app) => {
  const screens = app.querySelectorAll("[data-screen]");
  const modals = app.querySelectorAll("[data-modal]");
  const toast = app.querySelector("[data-toast-live]");
  let toastTimer;

  const showToast = (message) => {
    if (!toast || !message) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 1800);
  };

  const showScreen = (name) => {
    screens.forEach((screen) => {
      screen.classList.toggle("is-active", screen.dataset.screen === name);
      if (screen.dataset.screen === name) screen.scrollTop = 0;
    });
  };

  const closeModals = () => {
    modals.forEach((modal) => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    });
  };

  app.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-go], [data-open], [data-close-modal], [data-toast]");
    if (!trigger || !app.contains(trigger)) return;

    if (trigger.dataset.go) {
      closeModals();
      showScreen(trigger.dataset.go);
    }

    if (trigger.dataset.open) {
      closeModals();
      const modal = app.querySelector(`[data-modal="${trigger.dataset.open}"]`);
      modal?.classList.add("is-open");
      modal?.setAttribute("aria-hidden", "false");
    }

    if (trigger.hasAttribute("data-close-modal")) {
      closeModals();
    }

    showToast(trigger.dataset.toast);
  });

  app.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModals();
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest("[data-go][role='button']");
    if (!card) return;
    event.preventDefault();
    showScreen(card.dataset.go);
  });
});
