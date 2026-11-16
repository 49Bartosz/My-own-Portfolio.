// =========================================================
// Bartosz Zalesny, portfolio
// Scroll reveal, stagger, nav shadow, footer year
// =========================================================

(function () {
  const root = document.documentElement;
  const revealEls = document.querySelectorAll(".reveal");

  // Without IntersectionObserver (very old browsers), just show everything.
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    // 1. Stagger: items that sit side by side appear one after another.
    const groups = [".hero > .reveal", ".traits", ".cards", ".timeline", ".contact__links"];

    groups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((group) => {
        // ".hero > .reveal" matches the items themselves, the rest match containers
        const items = group.classList.contains("reveal")
          ? [group]
          : group.querySelectorAll(".reveal");
        items.forEach((el, i) => {
          if (!el.style.getPropertyValue("--delay")) {
            el.style.setProperty("--delay", `${i * 0.12}s`);
          }
        });
      });
    });

    // The hero items are matched one by one above, so stagger them by position.
    document.querySelectorAll(".hero > .reveal").forEach((el, i) => {
      el.style.setProperty("--delay", `${i * 0.15}s`);
    });

    // 2. Turn on the hidden state (CSS only hides .reveal once this class exists).
    root.classList.add("js-ready");

    // 3. Reveal elements as they scroll into view.
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

    revealEls.forEach((el) => observer.observe(el));
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Nav gets a soft shadow once you scroll down
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("nav--scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();