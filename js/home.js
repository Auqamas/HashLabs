/**
 * Homepage interactions: video autoplay-on-view, stacked capabilities, counters.
 */
(() => {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Video: autoplay when section enters view ---------- */
  function initVideoSection() {
    const section = document.querySelector(".hash-video");
    const video = section?.querySelector("video");
    if (!section || !video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.removeAttribute("poster");
    video.removeAttribute("controls");

    const tryPlay = () => {
      if (video.readyState < 2) {
        video.preload = "auto";
        video.load();
      }
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    const tryPause = () => {
      if (!video.paused) video.pause();
    };

    if (reduceMotion) {
      tryPause();
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
              tryPlay();
            } else {
              tryPause();
            }
          });
        },
        { threshold: [0, 0.4, 0.65] }
      );
      observer.observe(section);
    } else {
      tryPlay();
    }
  }

  /* ---------- Core Capabilities stats counters ---------- */
  function formatCounterValue(value, format) {
    const n = Math.round(value);
    if (format === "k") {
      if (n >= 1000) {
        const k = n / 1000;
        return Number.isInteger(k) ? `${k}K` : `${k.toFixed(1)}K`;
      }
    }
    return String(n);
  }

  function initCapCounters() {
    const nums = document.querySelectorAll(".home-capabilities [data-counter]");
    if (!nums.length) return;

    if (
      reduceMotion ||
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined"
    ) {
      nums.forEach((el) => {
        const target = Number(el.dataset.target) || 0;
        const suffix = el.dataset.suffix || "";
        const format = el.dataset.format || "";
        el.textContent = formatCounterValue(target, format) + suffix;
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    nums.forEach((el) => {
      const target = Number(el.dataset.target);
      if (!Number.isFinite(target)) return;

      const suffix = el.dataset.suffix || "";
      const format = el.dataset.format || "";
      const obj = { val: 0 };

      el.textContent = formatCounterValue(0, format) + suffix;

      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = formatCounterValue(obj.val, format) + suffix;
        },
      });
    });
  }

  /* ---------- Overlapping horizontal capability cards ---------- */
  function initCapStack() {
    const section = document.querySelector(".home-cap-cards");
    const stack =
      section?.querySelector("[data-cap-stack]") ||
      section?.querySelector(".cap-stack");
    const cards = stack
      ? Array.from(stack.querySelectorAll(".cap-stack-card"))
      : [];
    if (!section || !stack || !cards.length) return;

    // Every card moves aside; opposite subtle rotate; scrub keeps going while section scrolls
    const spread = [
      { rotate: -3.5, x: -92, y: 20 },
      { rotate: 2.5, x: -34, y: 10 },
      { rotate: -2.5, x: 34, y: 10 },
      { rotate: 3.5, x: 92, y: 20 },
    ];

    if (
      reduceMotion ||
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined"
    ) {
      cards.forEach((card, i) => {
        const s = spread[i % spread.length];
        card.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rotate}deg)`;
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const triggers = [];

      cards.forEach((card, i) => {
        const s = spread[i % spread.length];
        gsap.set(card, {
          rotate: 0,
          x: 0,
          y: 8,
          scale: 1,
          zIndex: i + 1,
        });

        const tween = gsap.to(card, {
          rotate: s.rotate,
          x: s.x,
          y: s.y,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            // Keep scrubbing the whole time the section is on screen
            end: "bottom top",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });

        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      return () => {
        triggers.forEach((st) => st.kill());
        cards.forEach((card) => {
          gsap.killTweensOf(card);
          gsap.set(card, { clearProps: "transform" });
        });
      };
    });

    mm.add("(max-width: 768px)", () => {
      if (typeof Swiper === "undefined") return;

      const swiper = new Swiper(stack, {
        slidesPerView: 1.12,
        spaceBetween: 14,
        centeredSlides: true,
        grabCursor: true,
        resistanceRatio: 0.65,
        speed: 420,
        breakpoints: {
          520: {
            slidesPerView: 1.28,
            spaceBetween: 18,
          },
        },
      });

      return () => {
        swiper.destroy(true, true);
      };
    });
  }

  /* ---------- Impact line: pin + gray → black word reveal (About) ---------- */
  function initImpactLine() {
    const line = document.querySelector("[data-impact-line]");
    if (!line) return;

    const raw = (line.textContent || "").trim().replace(/\s+/g, " ");
    const words = raw.split(" ");
    line.textContent = "";
    words.forEach((w, i) => {
      const span = document.createElement("span");
      span.className = "about-impact-word";
      span.textContent = w;
      line.appendChild(span);
      if (i < words.length - 1) {
        line.appendChild(document.createTextNode(" "));
      }
    });

    const wordEls = line.querySelectorAll(".about-impact-word");

    if (
      reduceMotion ||
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined"
    ) {
      wordEls.forEach((el) => el.classList.add("is-on"));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const pinWrap = line.closest(".about-impact-pin") || line;

    ScrollTrigger.create({
      trigger: pinWrap,
      start: "top 28%",
      end: "+=70%",
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const n = wordEls.length;
        const active = Math.min(n - 1, Math.floor(self.progress * n));
        wordEls.forEach((el, idx) => {
          el.classList.toggle("is-on", idx <= active);
        });
      },
    });
  }

  /* ---------- FAQ: pin left, scroll right ---------- */
  function initFaqSection() {
    const section = document.querySelector("[data-faq-stage]");
    if (!section) return;

    const buttons = section.querySelectorAll(".faq-question");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const content = btn.nextElementSibling;
        const icon = btn.querySelector(".faq-q-icon svg");
        const isOpen = content.classList.contains("open");

        section.querySelectorAll(".faq-item").forEach((el) => {
          el.classList.remove("is-open");
        });
        section.querySelectorAll(".faq-answer").forEach((a) => {
          a.classList.remove("open");
        });
        section.querySelectorAll(".faq-question").forEach((q) => {
          q.setAttribute("aria-expanded", "false");
        });
        section.querySelectorAll(".faq-q-icon svg").forEach((i) => {
          i.classList.remove("rotate-180");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          content.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
          if (icon) icon.classList.add("rotate-180");
        }

        if (typeof ScrollTrigger !== "undefined") {
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }
      });
    });

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const lead = section.querySelector(".faq-lead");
    const listWrap = section.querySelector(".faq-list-wrap");
    if (!lead || !listWrap) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", () => {
      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top+=80",
        end: () => {
          const distance = listWrap.offsetHeight - window.innerHeight + 180;
          return `+=${Math.max(0, distance)}`;
        },
        pin: lead,
        pinSpacing: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      });

      return () => pinTrigger.kill();
    });
  }

  function boot() {
    initVideoSection();
    initCapCounters();
    initCapStack();
    initImpactLine();
    initFaqSection();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("hashlabs:ready", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });
})();
