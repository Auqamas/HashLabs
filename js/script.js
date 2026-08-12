/**
 * Boot: fast loader + shared helpers.
 * Loader no longer waits on every image/video; max wait after DOM is capped.
 */
(function () {
  const loader = document.getElementById("loader");
  const main = document.getElementById("main");

  function finalizeMain() {
    if (main) {
      main.style.width = "100%";
      main.style.maxWidth = "100%";
      main.style.height = "auto";
      main.style.minHeight = "100vh";
      main.style.opacity = "1";
      main.style.margin = "0";
      main.style.overflow = "visible";
    }

    document.body.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("overflow");
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";
    document.documentElement.style.overflowY = "auto";

    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    if (window.__lenis) {
      try {
        window.__lenis.resize();
      } catch (_) {}
    }

    window.dispatchEvent(new Event("hashlabs:ready"));
  }

  function revealWithoutGsap() {
    if (loader) loader.style.display = "none";
    finalizeMain();
    const header = document.getElementById("site-header");
    if (header) {
      header.style.opacity = "1";
      header.style.transform = "none";
    }
  }

  let revealed = false;
  function revealSite() {
    if (revealed) return;
    revealed = true;

    if (typeof gsap === "undefined") {
      revealWithoutGsap();
      return;
    }

    const tl = gsap.timeline();

    tl.to("#loader h1", {
      duration: 0.28,
      opacity: 1,
      ease: "power2.out",
    });

    tl.to(
      "#loader",
      {
        y: -36,
        duration: 0.42,
        opacity: 0,
        ease: "power3.inOut",
        onComplete: () => {
          if (loader) loader.style.display = "none";
        },
      },
      "-=0.05"
    );

    tl.to(
      "#main",
      {
        duration: 0.65,
        width: "100%",
        opacity: 1,
        ease: "power3.out",
        onComplete: finalizeMain,
      },
      "-=0.28"
    );

    tl.fromTo(
      "#site-header",
      { opacity: 0, y: -48 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
      "-=0.45"
    );
  }

  function armLoader() {
    if (!loader) {
      if (main && (main.style.opacity === "" || getComputedStyle(main).opacity === "0")) {
        finalizeMain();
      }
      return;
    }

    const softStart = () => {
      requestAnimationFrame(() => setTimeout(revealSite, 180));
    };

    if (document.readyState === "complete") softStart();
    else window.addEventListener("load", softStart, { once: true });

    // Cap wait: don't hang on slow videos / third-party logos
    const maxWait = () => setTimeout(revealSite, 1600);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", maxWait, { once: true });
    } else {
      maxWait();
    }
  }

  armLoader();
})();

/** Lazy-decode below-the-fold images without changing markup layout. */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img, index) => {
    if (!img.hasAttribute("decoding")) img.decoding = "async";
    if (img.hasAttribute("loading")) return;
    if (index < 3) {
      img.loading = "eager";
      if (index === 0) img.fetchPriority = "high";
    } else {
      img.loading = "lazy";
    }
  });
});

/** Home work-showcase tabs + autoplay progress */
document.addEventListener("DOMContentLoaded", () => {
  const stage = document.querySelector("[data-work-stage]");
  if (!stage) return;

  const tabs = Array.from(stage.querySelectorAll(".work-tab"));
  const tabText = stage.querySelector("#tab-text");
  const tabImage = stage.querySelector("#tab-image");
  const tabTags = stage.querySelector("#tab-tags");
  const tabBadge = stage.querySelector("#tab-badge");
  const tabNote = stage.querySelector("#tab-note");
  const tabNumber = stage.querySelector("#tab-number");

  if (!tabs.length || !tabText || !tabImage) return;

  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tabData = {
    design: {
      text: "Our engineers and product designers turn ideas into clear technical blueprints. We define architecture, user flows, and system requirements so every build starts with a solid software foundation.",
      img: "assets/images/work-design-v2.png",
      alt: "Minimal UX design workspace with wireframes on a tablet",
      tags: ["Architecture", "Wireframes", "Prototyping"],
      note: "Clarity before code",
    },
    project: {
      text: "With the plan locked, our development team builds and integrates your product. We manage sprints, code quality, APIs, testing, and vendor coordination — keeping delivery transparent from backlog to staging.",
      img: "assets/images/work-project-v2.png",
      alt: "Agile engineering workspace with kanban board and code",
      tags: ["Sprints", "APIs", "QA"],
      note: "Built in the open",
    },
    execution: {
      text: "We stay with you through launch and beyond. Our engineers handle deployment, monitoring, and handover so your software goes live cleanly and continues to perform in production.",
      img: "assets/images/work-execution-v2.png",
      alt: "Cloud deployment scene with growth metrics and monitoring",
      tags: ["Deployment", "Monitoring", "Support"],
      note: "Ready for the real world",
    },
  };

  const order = tabs.map((tab) => tab.getAttribute("data-tab"));
  const AUTOPLAY_MS = 6000;

  let activeIndex = 0;
  let rafId = null;
  let phaseStart = 0;
  let switchTimer = null;
  let inView = false;

  function stopProgress() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    phaseStart = 0;
  }

  function startProgress() {
    stopProgress();
    if (reduceMotion || !inView) return;

    const fill = tabs[activeIndex].querySelector("[data-progress-fill]");
    if (!fill) return;

    const frame = (now) => {
      if (!phaseStart) phaseStart = now;
      const elapsed = now - phaseStart;
      const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
      fill.style.width = pct + "%";

      if (pct >= 100) {
        goTo(activeIndex + 1);
      } else {
        rafId = requestAnimationFrame(frame);
      }
    };

    rafId = requestAnimationFrame(frame);
  }

  function renderTags(names) {
    if (!tabTags) return;
    tabTags.innerHTML = "";
    names.forEach((name) => {
      const span = document.createElement("span");
      span.className = "work-tag";
      span.textContent = name;
      tabTags.appendChild(span);
    });
  }

  function goTo(index) {
    stopProgress();
    if (switchTimer) window.clearTimeout(switchTimer);
    activeIndex = ((index % order.length) + order.length) % order.length;
    const data = tabData[order[activeIndex]];
    if (!data) return;
    stage.dataset.theme = order[activeIndex];

    tabs.forEach((tab, i) => {
      const isActive = i === activeIndex;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      const fill = tab.querySelector("[data-progress-fill]");
      if (fill) fill.style.width = "0%";
    });

    tabImage.classList.add("is-switching");
    switchTimer = window.setTimeout(() => {
      tabImage.src = data.img;
      tabImage.alt = data.alt || "";
      tabText.textContent = data.text;
      renderTags(data.tags);
      if (tabNote) tabNote.textContent = data.note;

      if (tabBadge) {
        const current = String(activeIndex + 1).padStart(2, "0");
        const total = String(order.length).padStart(2, "0");
        tabBadge.textContent = `${current} / ${total}`;
        if (tabNumber) tabNumber.textContent = current;
      }

      requestAnimationFrame(() => tabImage.classList.remove("is-switching"));
    }, 260);

    startProgress();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => goTo(i));
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) startProgress();
        else stopProgress();
      },
      { threshold: 0.35 }
    );
    observer.observe(stage);
  } else {
    inView = true;
  }

  goTo(0);
});
