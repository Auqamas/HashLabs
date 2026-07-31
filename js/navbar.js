document.addEventListener("DOMContentLoaded", () => {
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
      // Prefer more specific page matches over bare "/"
      if (item.key === "home" && file && file !== "index.html" && file !== "") continue;
      activeKey = item.key;
      if (item.key !== "home") break;
    }
  }

  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach((link) => {
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

  // --- Mobile menu ---
  if (!hamburger || !mobileMenu) return;

  const closeMenu = () => {
    mobileMenu.classList.remove("active");
    hamburger.classList.remove("open");
  };

  const toggleMenu = () => {
    mobileMenu.classList.toggle("active");
    hamburger.classList.toggle("open");
  };

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (!mobileMenu.classList.contains("active")) return;
    const target = e.target;
    if (hamburger.contains(target) || mobileMenu.contains(target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
});
