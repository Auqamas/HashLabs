window.addEventListener("load", () => {
  const tl = gsap.timeline();

  // Fade in loader text
  tl.to("#loader h1", {
    duration: 1,
    opacity: 1,
    ease: "power2.inOut",
  });

  // Fade out loader
  tl.to("#loader", {
    y: -50,
    duration: 1,
    opacity: 0,
    ease: "power4.inOut",
    onComplete: () => {
      const loader = document.getElementById("loader");
      if (loader) loader.style.display = "none";
    },
  });

  // Expand main content — clear fixed height so the page can actually scroll
  tl.to("#main", {
    duration: 1.6,
    width: "100%",
    opacity: 1,
    ease: "power4.out",
    onComplete: () => {
      const main = document.getElementById("main");
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
    },
  });

  // Header drop-in
  tl.fromTo(
    "#site-header",
    { opacity: 0, y: -100 },
    { opacity: 1, y: 0, duration: 0.8, ease: "bounce.out" }
  );
});

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const tabText = document.querySelector(".tab-text");
  const tabImage = document.getElementById("tab-image");

  if (!tabs.length || !tabText || !tabImage) return;

  const tabData = {
    design: {
      text: "Our engineers and product designers turn ideas into clear technical blueprints. We define architecture, user flows, and system requirements so every build starts with a solid software foundation.",
      img: "assets/images/V1.png",
    },
    project: {
      text: "With the plan locked, our development team builds and integrates your product. We manage sprints, code quality, APIs, testing, and vendor coordination — keeping delivery transparent from backlog to staging.",
      img: "assets/images/V2.png",
    },
    execution: {
      text: "We stay with you through launch and beyond. Our engineers handle deployment, monitoring, and handover so your software goes live cleanly and continues to perform in production.",
      img: "assets/images/V3.png",
    },
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const tabName = tab.getAttribute("data-tab");
      tabText.textContent = tabData[tabName].text;
      tabImage.src = tabData[tabName].img;
    });
  });
});
