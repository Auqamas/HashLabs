document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  // --- Active page highlight ---
  const path = (window.location.pathname || "").toLowerCase().replace(/\\/g, "/");
  const file = path.split("/").pop() || "index.html";

  const pageKeys = [
    { match: ["about.html", "/about"], key: "about" },
    { match: ["services.html", "/services"], key: "services" },
    { match: ["team.html", "/team"], key: "team" },
    { match: ["work.html", "/work"], key: "work" },
    { match: ["contact.html", "/contact"], key: "contact" },
    { match: ["index.html", "", "/"], key: "home" },
  ];

  let activeKey = "home";
  for (const item of pageKeys) {
    if (item.match.some((m) => path.endsWith(m) || file === m || path.includes(m))) {
      if (item.key === "home" && file && file !== "index.html" && file !== "") continue;
      activeKey = item.key;
      if (item.key !== "home") break;
    }
  }

  document
    .querySelectorAll(".nav-links a, .mobile-menu-links a, .mobile-menu-inner > .header-button")
    .forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    const isActive =
      (activeKey === "about" && href.includes("about")) ||
      (activeKey === "services" && href.includes("services")) ||
      (activeKey === "team" && href.includes("team")) ||
      (activeKey === "work" && href.includes("work")) ||
      (activeKey === "contact" && href.includes("contact"));

    if (isActive) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // --- Floating nav scroll state ---
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- Mobile menu ---
  if (!hamburger || !mobileMenu) return;

  // Wrap link text for baseline reveal + right-side arrow
  mobileMenu
    .querySelectorAll(".mobile-menu-links a, .mobile-menu-inner > .header-button")
    .forEach((link) => {
      if (link.querySelector(".menu-line")) return;
      const text = link.textContent.trim();
      link.textContent = "";

      const clip = document.createElement("span");
      clip.className = "menu-clip";

      const line = document.createElement("span");
      line.className = "menu-line";
      line.textContent = text;
      clip.appendChild(line);

      const arrow = document.createElement("span");
      arrow.className = "menu-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";

      link.appendChild(clip);
      link.appendChild(arrow);
    });

  const setMenuState = (open) => {
    if (open) {
      // Restart staggered baseline animation each open
      mobileMenu.classList.remove("active");
      void mobileMenu.offsetWidth;
      mobileMenu.classList.add("active");
    } else {
      mobileMenu.classList.remove("active");
    }

    hamburger.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
  };

  const closeMenu = () => setMenuState(false);
  const toggleMenu = () => setMenuState(!mobileMenu.classList.contains("active"));

  hamburger.setAttribute("aria-controls", "mobile-menu");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "Open menu");
  mobileMenu.setAttribute("id", "mobile-menu");
  mobileMenu.setAttribute("aria-hidden", "true");

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
});
