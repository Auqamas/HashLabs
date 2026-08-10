/**
 * Micro-animations for About / Services / Work / Contact
 * Matches site motion language (GSAP + ScrollTrigger)
 */
(function () {
  function boot() {
    if (typeof gsap === "undefined") return;

    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document
        .querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero entrance
    const hero = document.querySelector(".page-hero-center");
    if (hero) {
      const parts = hero.querySelectorAll("h1, p, .hero-cta");
      gsap.from(parts, {
        opacity: 0,
        y: 26,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15,
      });
    }

    // Scroll reveals
    document.querySelectorAll(".reveal").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    document.querySelectorAll(".reveal-left").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -36 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    document.querySelectorAll(".reveal-right").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: 36 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    document.querySelectorAll(".reveal-scale").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Stagger children in grids
    document.querySelectorAll("[data-stagger]").forEach((group) => {
      const kids = group.children;
      if (!kids.length) return;
      gsap.from(kids, {
        opacity: 0,
        y: 24,
        duration: 0.65,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: group,
          start: "top 86%",
          toggleActions: "play none none none",
        },
      });
    });

    // Soft float on decorative images
    document.querySelectorAll("[data-float]").forEach((el) => {
      gsap.to(el, {
        y: -8,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // About story: text animation handled by Shery (shery-text class on the heading)

    // Dual-column orbit: rotate with page scroll
    document.querySelectorAll("[data-scroll-orbit]").forEach((el) => {
      const core = el.querySelector(".about-orbit-core");
      const trigger = el.closest(".about-dual") || el;
      gsap.to(el, {
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      if (core) {
        gsap.to(core, {
          rotation: -360,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    });

    // Detail heading: fixed, clean full-block entrance
    const detailHead = document.querySelector(".about-detail-head");
    if (detailHead) {
      const title = detailHead.querySelector(".about-detail-title");
      const sub = detailHead.querySelector(".about-detail-sub");

      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: 36, clipPath: "inset(0 0 100% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: detailHead,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (sub) {
        gsap.fromTo(
          sub,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: 0.18,
            ease: "power2.out",
            scrollTrigger: {
              trigger: detailHead,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }

    // Detail section: pin only once heading + full cards fit, then scroll horizontally
    document.querySelectorAll("[data-detail-scroll]").forEach((scroller) => {
      const track = scroller.querySelector("[data-detail-track]");
      const section = scroller.closest(".about-detail") || scroller;
      const cards = scroller.querySelectorAll(".detail-card");
      const reverse = scroller.hasAttribute("data-detail-reverse");
      if (!track) return;

      const getTravel = () => Math.max(0, track.scrollWidth - scroller.clientWidth);

      gsap.fromTo(
        track,
        { x: () => (reverse ? -getTravel() : 0) },
        {
          x: () => (reverse ? 0 : -getTravel()),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            // pin when section top reaches the top (heading fully readable)
            start: "top top",
            end: () =>
              "+=" + Math.max(getTravel() * 1.2, window.innerHeight * 0.85),
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              if (scroller.dataset.fitAdjusted === "true") return;
              const overflow = section.scrollHeight - window.innerHeight;
              if (overflow <= 8) return;
              const imgH =
                parseFloat(
                  getComputedStyle(scroller).getPropertyValue(
                    "--detail-card-img-h"
                  )
                ) || 210;
              if (imgH <= 160) return;
              scroller.style.setProperty(
                "--detail-card-img-h",
                Math.max(160, imgH - overflow - 12) + "px"
              );
              scroller.dataset.fitAdjusted = "true";
              requestAnimationFrame(() => self.refresh());
            },
            onUpdate: (self) => {
              if (!cards.length) return;
              const step = Math.min(
                cards.length - 1,
                Math.floor(self.progress * cards.length)
              );
              const i = reverse ? cards.length - 1 - step : step;
              cards.forEach((c, idx) =>
                c.classList.toggle("is-active", idx === i)
              );
            },
          },
        }
      );

      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          cards.forEach((c) => c.classList.remove("is-active"));
          card.classList.add("is-active");
        });
      });
    });

    // Impact line: scroll-scrub word highlight (gray → black)
    document.querySelectorAll("[data-impact-line]").forEach((line) => {
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
    });

    // Stats counters
    document.querySelectorAll("[data-counter]").forEach((el) => {
      const target = Number(el.dataset.target) || 0;
      const suffix = el.dataset.suffix || "";
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val) + suffix;
        },
      });
    });

    // Engagement: premium peel / flip stack
    // Pin the stage only — stack never translates; each top board peels then exits.
    const engage = document.querySelector("[data-engage-stack]");
    if (engage && typeof ScrollTrigger !== "undefined") {
      const pinEl = engage.querySelector("[data-engage-pin]");
      const cards = Array.from(engage.querySelectorAll("[data-engage-card]"));
      const faces = cards.map((c) => c.querySelector(".engage-card-face"));
      const dot = engage.querySelector("[data-engage-dot]");
      const rail = engage.querySelector("[data-engage-rail]");
      const railInner = engage.querySelector(".about-engage-rail-inner");

      // Horizontal image scrollers inside each card
      engage.querySelectorAll("[data-engage-gallery]").forEach((track) => {
        gsap.to(track, {
          xPercent: -50,
          duration: 22,
          ease: "none",
          repeat: -1,
        });
      });

      if (pinEl && cards.length && faces.every(Boolean)) {
        const n = cards.length;
        // Overlap so next board takes focus before previous fully exits
        const overlap = 0.28;
        const totalUnits = 1 + (n - 1) * (1 - overlap);

        const stack = engage.querySelector("[data-engage-cards]");
        const applyStack = () => {
          const peek = window.innerWidth < 768 ? 52 : 64;
          if (stack) {
            stack.style.setProperty("--engage-peek", peek + "px");
            stack.style.setProperty("--engage-count", String(n));
          }
          cards.forEach((card, i) => {
            gsap.set(card, { zIndex: n - i });
          });
        };
        applyStack();

        faces.forEach((face) => {
          gsap.set(face, {
            transformOrigin: "top center",
            force3D: true,
            rotateX: 0,
            yPercent: 0,
            scale: 1,
            opacity: 1,
            filter: "none",
          });
        });

        const master = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pinEl,
            // Start when the stack is centered in the viewport (not when it hits the top)
            start: "center center",
            end: () => "+=" + Math.round(window.innerHeight * 1.3 * n),
            pin: true,
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: applyStack,
            onToggle: (self) => {
              if (rail) rail.classList.toggle("is-on", self.isActive);
            },
            onUpdate: (self) => {
              if (dot && railInner) {
                const travel = Math.max(0, railInner.clientHeight - dot.clientHeight);
                dot.style.top = self.progress * travel + "px";
              }

              const t = self.progress * totalUnits;
              let active = 0;
              for (let i = 0; i < n; i++) {
                const startAt = i * (1 - overlap);
                if (t >= startAt) active = i;
              }
              cards.forEach((c, i) => c.classList.toggle("is-active", i === active));
            },
          },
        });

        cards.forEach((card, i) => {
          const face = faces[i];
          const startAt = i * (1 - overlap);
          const tl = gsap.timeline({ defaults: { ease: "none" } });

          tl.set(card, { zIndex: 50 + (n - i) }, 0);

          tl.fromTo(
            face,
            { rotateX: 0, scale: 1, opacity: 1, yPercent: 0 },
            {
              rotateX: -10,
              scale: 0.97,
              opacity: 0.94,
              duration: 0.36,
            },
            0
          );

          tl.to(
            face,
            {
              yPercent: -118,
              rotateX: -11.5,
              scale: 0.965,
              opacity: 0,
              duration: 0.64,
            },
            0.36
          );

          if (i < n - 1) {
            tl.set(cards[i + 1], { zIndex: 40 + (n - i - 1) }, 0.4);
          }

          master.add(tl, startAt);
        });

        master.to({}, { duration: Math.max(0, totalUnits - master.duration()) });
      }
    }

    // Services: studio intro → red wash → hide → stacked service menu
    const svcScroll = document.querySelector("[data-svc-scroll]");
    if (svcScroll && typeof ScrollTrigger !== "undefined") {
      const pinEl = svcScroll.querySelector("[data-svc-pin]");
      const wash = svcScroll.querySelector("[data-svc-wash]");
      const introDark = svcScroll.querySelector("[data-svc-intro-dark]");
      const introLight = svcScroll.querySelector("[data-svc-intro-light]");
      const menu = svcScroll.querySelector("[data-svc-menu]");
      const front = svcScroll.querySelector("[data-svc-front]");
      const helpReveal = svcScroll.querySelector("[data-help-reveal]");
      const cards = Array.from(svcScroll.querySelectorAll("[data-svc-card]"));
      const prevBtn = svcScroll.querySelector("[data-svc-prev]");
      const nextBtn = svcScroll.querySelector("[data-svc-next]");
      const deck = svcScroll.querySelector("[data-svc-deck]");
      const collapses = Array.from(
        svcScroll.querySelectorAll("[data-svc-collapse]")
      );
      const introLineBlocks = Array.from(
        svcScroll.querySelectorAll(".svc-intro-line")
      );

      if (pinEl && wash && introDark && introLight && menu) {
        gsap.set(wash, { clipPath: "inset(100% 0 0 0)" });
        gsap.set([introDark, introLight], { opacity: 1, y: 0, scale: 1 });
        gsap.set(menu, { opacity: 0, y: 28, visibility: "hidden" });
        gsap.set(svcScroll.querySelectorAll("[data-svc-line]"), { yPercent: 0 });
        if (front) gsap.set(front, { yPercent: 0 });
        if (helpReveal) {
          gsap.set(helpReveal, {
            opacity: 0,
            visibility: "hidden",
            scale: 1,
            y: 0,
          });
        }

        collapses.forEach((el) => {
          const w = Math.ceil(el.getBoundingClientRect().width);
          gsap.set(el, {
            maxWidth: w || 220,
            width: "auto",
            opacity: 1,
            scale: 1,
            scaleX: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            transformOrigin: "center center",
            marginLeft: "",
            marginRight: "",
            paddingLeft: "",
            paddingRight: "",
          });
        });

        let frontIndex = 0;
        let autoTimer = null;
        let menuLive = false;
        const n = cards.length;
        if (deck) deck.style.setProperty("--svc-deck-count", String(Math.max(n, 1)));

        const peekOf = () => {
          if (!deck) {
            if (window.innerWidth < 640) return 36;
            if (window.innerWidth < 960) return 46;
            return 56;
          }
          const raw = getComputedStyle(deck).getPropertyValue("--svc-deck-peek");
          const parsed = parseFloat(raw);
          return Number.isFinite(parsed) ? parsed : 52;
        };
        const shiftOf = () => {
          if (!deck) {
            if (window.innerWidth < 640) return 8;
            if (window.innerWidth < 960) return 11;
            return 14;
          }
          const raw = getComputedStyle(deck).getPropertyValue("--svc-deck-shift-x");
          const parsed = parseFloat(raw);
          return Number.isFinite(parsed) ? parsed : 12;
        };

        const stackPose = (order) => ({
          x: order * shiftOf(),
          y: -order * peekOf(),
          scale: 1 - order * 0.012,
          opacity: 1,
          zIndex: n - order,
        });

        const layoutDeck = (active, animate) => {
          if (!n) return;
          frontIndex = ((active % n) + n) % n;
          cards.forEach((card, i) => {
            const order = (i - frontIndex + n) % n;
            card.style.setProperty("--i", String(order));
            card.classList.toggle("is-front", order === 0);
            const props = {
              ...stackPose(order),
              duration: animate ? 0.55 : 0,
              ease: "power3.inOut",
            };
            if (animate) gsap.to(card, props);
            else gsap.set(card, props);
          });
        };

        const stopAuto = () => {
          if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
          }
        };

        const startAuto = () => {
          stopAuto();
          if (n < 2) return;
          autoTimer = setInterval(() => {
            layoutDeck(frontIndex + 1, true);
          }, 3000);
        };

        const bumpAuto = () => {
          if (!menuLive) return;
          startAuto();
        };

        // Cards sit in the stacked pose immediately (no scroll assemble)
        layoutDeck(0, false);

        const washDuration = 1.35;
        const introBaseFonts = introLineBlocks.map(
          (line) => parseFloat(getComputedStyle(line).fontSize) || 16
        );
        const introFontBoost =
          window.innerWidth < 640 ? 1.14 : window.innerWidth < 960 ? 1.17 : 1.2;
        const collapseAt = (name, fallback) => {
          const el = introDark.querySelector(
            `[data-svc-collapse="${name}"]`
          );
          if (!el) return fallback;
          const pinRect = pinEl.getBoundingClientRect();
          const rect = el.getBoundingClientRect();
          if (!pinRect.height) return fallback;
          const elementBottom = (rect.bottom - pinRect.top) / pinRect.height;
          const washProgress = 1 - elementBottom;
          return Math.max(
            0.12,
            Math.min(washDuration - 0.3, washProgress * washDuration)
          );
        };

        const master = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: () => {
              const h = window.innerHeight || 800;
              const mult = window.innerWidth < 640 ? 3.15 : window.innerWidth < 960 ? 3.35 : 3.6;
              return "+=" + Math.round(h * mult);
            },
            pin: true,
            scrub: window.innerWidth < 640 ? 0.3 : 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              collapses.forEach((el) => {
                if (gsap.getProperty(el, "opacity") > 0.85) {
                  gsap.set(el, { maxWidth: "none", width: "auto" });
                  const w = Math.ceil(el.getBoundingClientRect().width);
                  gsap.set(el, { maxWidth: w || 220 });
                }
              });
              layoutDeck(frontIndex, false);
            },
            onUpdate: (self) => {
              const p = self.progress;
              const live = p >= 0.4 && p < 0.66;
              menu.classList.toggle("is-live", live);
              menu.setAttribute("aria-hidden", live ? "false" : "true");
              if (helpReveal) {
                const helpLive = p >= 0.74;
                helpReveal.classList.toggle("is-live", helpLive);
                helpReveal.setAttribute("aria-hidden", helpLive ? "false" : "true");
              }
              if (live && !menuLive) {
                menuLive = true;
                startAuto();
              } else if (!live && menuLive) {
                menuLive = false;
                stopAuto();
              }
            },
            onKill: () => stopAuto(),
          },
        });

        // 1) Red wash rises
        master.fromTo(
          wash,
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: washDuration },
          0
        );

        // Each inline component closes as the rising wash reaches its lower
        // edge. Dark/light duplicates share the same tween so the repaint
        // boundary stays perfectly aligned.
        [
          { name: "cta", fallback: 0.34 },
          { name: "arrow", fallback: 0.5 },
          { name: "thumbs", fallback: 0.68 },
        ].forEach(({ name, fallback }) => {
          const group = Array.from(
            svcScroll.querySelectorAll(`[data-svc-collapse="${name}"]`)
          );
          const at = collapseAt(name, fallback);
          if (!group.length) return;

          master.to(
            group,
            {
              clipPath: "inset(0% 50% 0% 50%)",
              scaleX: 0.05,
              opacity: 0,
              duration: 0.32,
              ease: "power3.inOut",
            },
            at
          );

          master.to(
            group,
            {
              maxWidth: 0,
              minWidth: 0,
              width: 0,
              marginLeft: 0,
              marginRight: 0,
              paddingLeft: 0,
              paddingRight: 0,
              duration: 0.44,
              ease: "power3.inOut",
            },
            at + 0.04
          );
        });

        // As the gaps close, both text layers grow together. Animating the
        // actual font size lets flex layout reflow naturally instead of using
        // a visual-only transform.
        master.to(
          introLineBlocks,
          {
            fontSize: (index) => introBaseFonts[index] * introFontBoost,
            duration: 1.06,
            ease: "power2.inOut",
          },
          0.28
        );

        // Once the wash and reflow complete, all three baselines exit together.
        const darkLines = Array.from(
          introDark.querySelectorAll("[data-svc-line]")
        );
        const lightLines = Array.from(
          introLight.querySelectorAll("[data-svc-line]")
        );
        const allLines = darkLines.concat(lightLines);
        master.to(
          allLines,
          {
            yPercent: 115,
            duration: 0.56,
            ease: "power3.inOut",
          },
          1.58
        );

        // Soft hide wrappers after lines are gone
        master.to(
          [introDark, introLight],
          { opacity: 0, duration: 0.2 },
          1.58 + 0.5
        );

        // 3) Service menu enters after line exit
        const menuInAt = 1.58 + 0.56;
        master.fromTo(
          menu,
          { opacity: 0, y: 40, visibility: "hidden" },
          { opacity: 1, y: 0, visibility: "visible", duration: 0.55 },
          menuInAt
        );

        // Hold so the menu can be read / auto-cycled before handoff
        master.to({}, { duration: 1.05 });

        // 4) Front stage curtain-closes from centre → out (clip-path split)
        //    The front element clips from the middle outward, creating a
        //    smooth left/right curtain-reveal of the help-stories behind it.
        const handoffAt = master.duration();
        const liftTarget = front || [wash, menu, introDark, introLight];
        if (helpReveal) {
          master.set(
            helpReveal,
            { opacity: 1, visibility: "visible", scale: 1, y: 0 },
            handoffAt
          );
        }

        // Curtain split: clip-path goes from full-visible → centre strip → gone
        master.fromTo(
          liftTarget,
          { clipPath: "inset(0% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 50% 0% 50%)",
            duration: 1.15,
            ease: "power2.inOut",
          },
          handoffAt
        );
        // Settle on help stories
        master.to({}, { duration: 0.7 });

        if (prevBtn) {
          prevBtn.addEventListener("click", () => {
            layoutDeck(frontIndex - 1, true);
            bumpAuto();
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener("click", () => {
            layoutDeck(frontIndex + 1, true);
            bumpAuto();
          });
        }

        // Keep stack geometry correct across breakpoint changes
        let resizeTimer = null;
        window.addEventListener("resize", () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            layoutDeck(frontIndex, false);
            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
          }, 150);
        });
      }
    }

    // Services editorial statement — line reveal + staggered copy
    const studioStatement = document.querySelector("[data-studio-statement]");
    if (
      studioStatement &&
      typeof gsap !== "undefined" &&
      typeof ScrollTrigger !== "undefined"
    ) {
      const statementLines = Array.from(
        studioStatement.querySelectorAll(".studio-statement-line > span")
      );
      const statementCopy = Array.from(
        studioStatement.querySelectorAll(
          "[data-statement-copy], [data-statement-link]"
        )
      );
      const statementLabel = studioStatement.querySelector(
        "[data-statement-label]"
      );

      const statementTl = gsap.timeline({
        scrollTrigger: {
          trigger: studioStatement,
          start: "top 82%",
          end: "top 24%",
          scrub: 0.75,
        },
      });

      if (statementLabel) {
        statementTl.fromTo(
          statementLabel,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
          0
        );
      }

      statementTl.fromTo(
        statementLines,
        { yPercent: 115, rotate: 1.5 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.8,
          stagger: 0.11,
          ease: "power3.out",
        },
        0.08
      );

      statementTl.fromTo(
        statementCopy,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.14,
          ease: "power2.out",
        },
        0.32
      );
    }

    // AI strategy bottom rail (Our Work / any page with the track)
    const aiStrategy = document.querySelector("[data-ai-strategy]");
    const aiTrack = document.querySelector("[data-ai-track]");
    if (aiStrategy && aiTrack && typeof gsap !== "undefined") {
      let aiTween = null;
      let isIntersecting = false;
      const loop = () => {
        const half = aiTrack.scrollWidth / 2;
        if (aiTween) aiTween.kill();
        gsap.set(aiTrack, { x: 0 });
        if (half > 0) {
          aiTween = gsap.to(aiTrack, {
            x: -half,
            duration: Math.max(28, half / 42),
            ease: "none",
            repeat: -1,
            paused: true,
          });
          if (isIntersecting) aiTween.play();
        }
      };

      if (typeof IntersectionObserver !== "undefined") {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isIntersecting = entry.isIntersecting;
              if (aiTween) {
                if (entry.isIntersecting) aiTween.play();
                else aiTween.pause();
              }
            });
          },
          { threshold: 0.02 }
        );
        observer.observe(aiStrategy);
      } else {
        isIntersecting = true;
      }

      loop();
      window.addEventListener("resize", () => {
        clearTimeout(window.__aiRailTimer);
        window.__aiRailTimer = setTimeout(loop, 200);
      });
    }

    // Client stories: 4s rotation + progress, with manual navigation
    const storiesSection = document.querySelector(".help-stories-section");
    if (storiesSection) {
      const storyData = [
        {
          quote:
            '"Hash Labs rebuilt our customer portal and API layer in weeks, not months. Performance jumped and our internal team finally understood the architecture."',
          name: "Ayesha Rahman",
          role: "Head of Product, Fintech client",
          initials: "AR",
        },
        {
          quote:
            '"They treated discovery like engineering — clear risks, clear estimates, and demos every week. We shipped our MVP without drama."',
          name: "Bilal Hassan",
          role: "Founder, SaaS startup",
          initials: "BH",
        },
        {
          quote:
            '"From cloud setup to CI/CD and monitoring, the handoff docs were as strong as the code. Our ops team was productive on day one."',
          name: "Sara Khan",
          role: "Engineering Manager, logistics platform",
          initials: "SK",
        },
        {
          quote:
            '"Practical AI, not slide decks. Hash Labs wired models into our workflows with measurable accuracy and a plan for iteration."',
          name: "Omar Siddiqui",
          role: "CTO, analytics company",
          initials: "OS",
        },
      ];

      const quote = storiesSection.querySelector("#story-quote");
      const name = storiesSection.querySelector("#story-author-name");
      const role = storiesSection.querySelector("#story-author-role");
      const avatar = storiesSection.querySelector("#story-avatar");
      const counter = storiesSection.querySelector("#story-counter");
      const progress = storiesSection.querySelector("#story-progress");
      const prev = storiesSection.querySelector("#story-prev");
      const next = storiesSection.querySelector("#story-next");
      let storyIndex = 0;
      let storyTimer = null;
      let sectionVisible = false;

      const restartProgress = () => {
        if (!progress) return;
        progress.style.transition = "none";
        progress.style.width = "0%";
        void progress.offsetWidth;
        requestAnimationFrame(() => {
          progress.style.transition = "width 4s linear";
          progress.style.width = "100%";
        });
      };

      const updateStory = (index, animate = true) => {
        storyIndex = (index + storyData.length) % storyData.length;
        const story = storyData[storyIndex];
        const content = storiesSection.querySelector(".story-content-wrapper");

        const apply = () => {
          if (quote) quote.textContent = story.quote;
          if (name) name.textContent = story.name;
          if (role) role.textContent = story.role;
          if (avatar) avatar.textContent = story.initials;
          if (counter) {
            counter.textContent =
              String(storyIndex + 1).padStart(2, "0") +
              "/" +
              String(storyData.length).padStart(2, "0");
          }
        };

        if (animate && content) {
          gsap.to(content, {
            opacity: 0,
            y: 8,
            duration: 0.18,
            ease: "power2.in",
            onComplete: () => {
              apply();
              gsap.fromTo(
                content,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" }
              );
            },
          });
        } else {
          apply();
        }
        restartProgress();
      };

      const stopStories = () => {
        if (storyTimer) clearInterval(storyTimer);
        storyTimer = null;
      };

      const startStories = () => {
        stopStories();
        restartProgress();
        storyTimer = setInterval(() => updateStory(storyIndex + 1), 4000);
      };

      const navigateStory = (direction) => {
        updateStory(storyIndex + direction);
        if (sectionVisible) startStories();
      };

      if (prev) prev.addEventListener("click", () => navigateStory(-1));
      if (next) next.addEventListener("click", () => navigateStory(1));
      updateStory(0, false);

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            sectionVisible = entry.isIntersecting;
            if (sectionVisible) startStories();
            else stopStories();
          },
          { threshold: 0.25 }
        );
        observer.observe(storiesSection);
      } else {
        sectionVisible = true;
        startStories();
      }

      // Service title hover/focus previews
      const helpItems = Array.from(
        storiesSection.querySelectorAll(".help-item")
      );
      const preview = storiesSection.querySelector("#help-preview-container");
      const previewImg = storiesSection.querySelector("#help-preview-img");

      const showPreview = (item) => {
        if (!preview || !previewImg || !item) return;
        const src = item.dataset.img;
        const helpList = storiesSection.querySelector(".help-list-wrapper");
        if (helpList && window.innerWidth >= 960) {
          const itemRect = item.getBoundingClientRect();
          const listRect = helpList.getBoundingClientRect();
          const previewHeight = preview.offsetHeight || 360;
          const itemCenter = itemRect.top - listRect.top + itemRect.height / 2;
          const previewCenter = Math.max(
            previewHeight / 2,
            Math.min(listRect.height - previewHeight / 2, itemCenter)
          );
          preview.style.setProperty("--help-preview-y", `${previewCenter}px`);
        }
        helpItems.forEach((entry) =>
          entry.classList.toggle("is-active", entry === item)
        );
        if (src && previewImg.getAttribute("src") !== src) {
          previewImg.style.opacity = "0";
          const preload = new Image();
          preload.onload = () => {
            previewImg.src = src;
            previewImg.alt = `${item.textContent.trim()} preview`;
            requestAnimationFrame(() => {
              previewImg.style.opacity = "1";
            });
          };
          preload.onerror = () => {
            previewImg.src = src;
            previewImg.alt = `${item.textContent.trim()} preview`;
            previewImg.style.opacity = "1";
          };
          preload.src = src;
        }
        preview.classList.add("is-visible");
      };

      helpItems.forEach((item) => {
        item.tabIndex = 0;
        item.addEventListener("pointerenter", () => showPreview(item));
        item.addEventListener("focus", () => showPreview(item));
        item.addEventListener("click", () => showPreview(item));
      });

      // Keep one service and its image active at all times.
      if (helpItems.length) showPreview(helpItems[0]);
    }

    /* Labs story — fast word-by-word color on scroll */
    const labsStory = document.querySelector("[data-labs-story]");
    const wordReveal = labsStory && labsStory.querySelector("[data-word-reveal]");
    if (labsStory && wordReveal && typeof ScrollTrigger !== "undefined") {
      const raw = wordReveal.textContent.trim().replace(/\s+/g, " ");
      const parts = raw.split(" ");
      wordReveal.textContent = "";
      const words = parts.map((part) => {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = part;
        wordReveal.appendChild(span);
        wordReveal.appendChild(document.createTextNode(" "));
        return span;
      });

      gsap.set(words, { color: "var(--labs-muted)" });

      gsap.to(words, {
        color: "var(--labs-active)",
        ease: "none",
        stagger: 0.04,
        scrollTrigger: {
          trigger: wordReveal,
          start: "top 78%",
          end: "bottom 42%",
          scrub: 0.35, /* snappy / a little fast */
        },
      });

      gsap.from(".labs-story-follow", {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: labsStory,
          start: "top 75%",
          once: true,
        },
      });
    }



    /* Capabilities Section Scroll Trigger Entrance */
    const capCards = document.querySelectorAll(".home-cap-card");
    if (capCards.length && typeof ScrollTrigger !== "undefined") {
      gsap.fromTo(
        capCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".home-capabilities",
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    }
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
