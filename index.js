// =========================================================
// Bartosz Zalesny, portfolio
// Loader, dark mode, custom cursor, flip cards,
// scroll reveal, nav shadow, footer year
// =========================================================

(function () {
  const root = document.documentElement;

  // ---------- 1. Dark mode ----------
  // The saved theme is already applied by the tiny script in <head>.
  const toggle = document.getElementById("theme-toggle");

  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    if (toggle) toggle.setAttribute("aria-pressed", String(theme === "dark"));
  };

  if (toggle) {
    toggle.setAttribute("aria-pressed", String(root.getAttribute("data-theme") === "dark"));
    toggle.addEventListener("click", () => {
      root.classList.add("theme-anim");
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      setTimeout(() => root.classList.remove("theme-anim"), 500);
    });
  }

  // ---------- 2. Custom cursor (mouse devices only) ----------
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const dot = document.querySelector(".cursor--dot");
    const ring = document.querySelector(".cursor--ring");

    if (dot && ring) {
      root.classList.add("has-cursor");

      let x = 0, y = 0, rx = 0, ry = 0;

      window.addEventListener("mousemove", (e) => {
        x = e.clientX;
        y = e.clientY;
        dot.style.transform = `translate(${x}px, ${y}px)`;
        if (!root.classList.contains("cursor-on")) {
          rx = x; ry = y; // first move: put the ring right under the dot
          root.classList.add("cursor-on");
        }
      }, { passive: true });

      // The ring trails behind the dot
      const follow = () => {
        rx += (x - rx) * 0.18;
        ry += (y - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px)`;
        requestAnimationFrame(follow);
      };
      follow();

      const hoverTargets = "a, button, .flip";
      document.addEventListener("mouseover", (e) => {
        if (e.target.closest(hoverTargets)) root.classList.add("cursor-hover");
      });
      document.addEventListener("mouseout", (e) => {
        if (e.target.closest(hoverTargets)) root.classList.remove("cursor-hover");
      });

      window.addEventListener("mousedown", () => root.classList.add("cursor-down"));
      window.addEventListener("mouseup", () => root.classList.remove("cursor-down"));

      // Hide the cursor when the mouse leaves the window
      document.addEventListener("mouseleave", () => root.classList.remove("cursor-on"));
      document.addEventListener("mouseenter", () => root.classList.add("cursor-on"));
    }
  }

  // ---------- 3. Fun fact flip cards ----------
  document.querySelectorAll(".flip").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("is-flipped"));
  });

  // ---------- 4. Scroll reveal ----------
  const revealEls = document.querySelectorAll(".reveal");
  let startReveal = () => {};

  if (!("IntersectionObserver" in window)) {
    // Very old browsers: just show everything.
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    // Stagger: items that sit side by side appear one after another.
    const groups = [".traits", ".cards", ".facts", ".timeline", ".contact__links"];

    groups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((group) => {
        group.querySelectorAll(".reveal").forEach((el, i) => {
          el.style.setProperty("--delay", `${i * 0.12}s`);
        });
      });
    });

    document.querySelectorAll(".hero > .reveal").forEach((el, i) => {
      el.style.setProperty("--delay", `${i * 0.15}s`);
    });

    // Turn on the hidden state (CSS only hides .reveal once this class exists).
    root.classList.add("js-ready");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // animate once, then stop watching
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    // Called once the loader is gone, so the hero animates in right after it
    startReveal = () => revealEls.forEach((el) => observer.observe(el));
  }

  // ---------- 5. Page loader ----------
  const loader = document.getElementById("loader");
  const MIN_SHOW = 2200; // how long the loader stays at least (ms)

  if (loader) {
    root.classList.add("is-loading");

    const minTime = new Promise((resolve) => setTimeout(resolve, MIN_SHOW));
    const pageReady = new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", resolve, { once: true });
    });

    Promise.all([minTime, pageReady]).then(() => {
      loader.classList.add("is-hidden");
      root.classList.remove("is-loading");
      startReveal();
      setTimeout(() => loader.remove(), 900);
    });
  } else {
    startReveal();
  }

  // ---------- 6. Footer year ----------
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---------- 7. Nav shadow on scroll ----------
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("nav--scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();