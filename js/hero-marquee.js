/**
 * Curved ribbon marquees — GSAP + MotionPathPlugin.
 *
 * ============================================================
 * HOW TO EDIT THE HOME PAGE MARQUEE
 * ============================================================
 * All runtime settings live in the CONFIG object below.
 *
 * • phrase            — the repeating line of text (use " | " separators)
 * • textSpeed         — how fast type travels along the path (px/sec)
 * • gradientDuration  — seconds for one full colour loop (matches About: 30s)
 * • layouts[]         — font size, ribbon thickness, letter-spacing, and
 *                       which route set to use at each breakpoint
 * • ribbons[].flow    — 1 = left→right, -1 = right→left
 * • ribbons[].routes  — Bézier anchors as fractions of the stage box
 *                       (wide / medium / compact). Values outside 0–1
 *                       sit off-screen.
 *
 * Markup: index.html → <section class="ribbon-stage">
 * Styles: css/styles.css → .ribbon-stage / .ribbon-band / .ribbon-text
 * ============================================================
 *
 * Two endless typography ribbons weave across the hero and video blocks in
 * opposite directions. Each ribbon is a single stroked SVG path (the coloured
 * band) with one <text> riding the same path via <textPath>.
 *
 * Seamlessness: the line is tiled to a whole number of phrases and shifted by
 * exactly one phrase per cycle, so every cycle boundary renders a frame
 * identical to the one before it — no snap, no gap, no discoverable start.
 *
 * Geometry is authored as normalised anchor points (0–1 of the stage box) and
 * compiled to a `d` string at the current size, so the ribbons reflow exactly
 * with the layout instead of being stretched.
 */
(() => {
  "use strict";

  // =========================================================
  // CONFIG
  // =========================================================
  const CONFIG = {
    /** Ribbon copy. The trailing separator keeps the seam evenly spaced. */
    phrase:
      "Hash Labs | AI | Cloud | Web Development | Automation | Security | Data | UI/UX | ",

    /** Text travel speed along the path, in px/second. Constant and linear. */
    textSpeed: 105,

    /**
     * Ribbon colour wash — mirrors pages.css `.animated-gradient`:
     * linear-gradient(270deg, #bfd1f8, #adf4fd, #f5b4ff, #fff9c4, #afe6ff)
     * background-size: 600% 600%; animation: gradientMove 30s ease infinite;
     */
    gradientDuration: 30,

    /**
     * Per-breakpoint sizing. `band` is the ribbon height in px, `route` selects
     * which set of anchor points to draw.
     */
    layouts: [
      { minWidth: 1200, font: 24, band: 62, tracking: -0.02, route: "wide" },
      { minWidth: 768, font: 19, band: 48, tracking: -0.02, route: "medium" },
      { minWidth: 0, font: 14, band: 26, tracking: -0.02, route: "compact" },
    ],

    /**
     * Ribbon routes. Each is [startPoint, ...cubicSegments] where a segment is
     * [control1, control2, endPoint]. Coordinates are fractions of the stage
     * box, so anything outside 0–1 sits off-screen. Edit freely.
     *
     * Every route is authored left → right with x strictly increasing. A
     * <textPath> orients glyphs along the tangent, so a route that doubled back
     * would render that stretch upside down; monotonic x guarantees upright
     * type everywhere. Travel direction comes from `flow`, not from the
     * direction the path happens to be drawn in.
     *
     * Each breakpoint gets its own routing because the hero reflows: at `wide`
     * the copy is a narrow centred column with room either side, while at
     * `medium` and `compact` it spans the full width, so the ribbons have to
     * run above it and through the gap between the CTAs and the video.
     */
    ribbons: [
      {
        // Ribbon 1 — reads as: in from the top right, skimming over the hero
        // heading, then curving down and out to the left.
        pathId: "ribbonPathA",
        textId: "ribbonTextA",
        gradientId: "ribbonGradientA",
        flow: -1,
        gradientPhase: 0,
        routes: {
          wide: [
            [-0.38, 0.56],
            [[-0.22, 0.58], [-0.06, 0.5], [0.1, 0.34]],
            [[0.2, 0.22], [0.3, 0.13], [0.46, 0.105]],
            [[0.66, 0.09], [0.86, 0.1], [1.06, 0.07]],
            [[1.18, 0.055], [1.28, 0.05], [1.38, 0.03]],
          ],
          medium: [
            [-0.5, 0.19],
            [[-0.28, 0.2], [-0.06, 0.15], [0.18, 0.115]],
            [[0.42, 0.095], [0.66, 0.1], [0.9, 0.09]],
            [[1.12, 0.08], [1.3, 0.07], [1.5, 0.05]],
          ],
          compact: [
            [-0.6, 0.2],
            [[-0.3, 0.21], [0.05, 0.185], [0.4, 0.165]],
            [[0.75, 0.145], [1.15, 0.155], [1.6, 0.13]],
          ],
        },
      },
      {
        // Ribbon 2 — in from the left, crossing ribbon 1 once near the left
        // edge, threading the gap under the CTAs, then out to the right and
        // behind the video frame.
        pathId: "ribbonPathB",
        textId: "ribbonTextB",
        gradientId: "ribbonGradientB",
        flow: 1,
        gradientPhase: 0.5,
        routes: {
          wide: [
            [-0.38, 0.2],
            [[-0.2, 0.22], [-0.02, 0.3], [0.16, 0.37]],
            [[0.3, 0.41], [0.42, 0.415], [0.58, 0.415]],
            [[0.74, 0.415], [0.88, 0.44], [1.04, 0.5]],
            [[1.16, 0.555], [1.26, 0.59], [1.38, 0.66]],
          ],
          medium: [
            [-0.5, 0.47],
            [[-0.28, 0.475], [-0.06, 0.5], [0.18, 0.515]],
            [[0.42, 0.53], [0.66, 0.525], [0.9, 0.545]],
            [[1.12, 0.555], [1.3, 0.57], [1.5, 0.6]],
          ],
          compact: [
            [-0.6, 0.55],
            [[-0.3, 0.545], [0.05, 0.58], [0.4, 0.6]],
            [[0.75, 0.62], [1.15, 0.61], [1.6, 0.65]],
          ],
        },
      },
    ],
  };

  // =========================================================
  // ELEMENTS / STATE
  // =========================================================
  const stage = document.querySelector(".ribbon-stage");
  const svg = document.querySelector("#ribbonSvg");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let tweens = [];
  let resizeTimer = null;

  // =========================================================
  // GEOMETRY
  // =========================================================

  /** Compile normalised anchor points into an SVG path `d` string. */
  function compileRoute(route, width, height) {
    const px = ([x, y]) => `${(x * width).toFixed(2)} ${(y * height).toFixed(2)}`;

    return route
      .map((step, i) =>
        i === 0
          ? `M ${px(step)}`
          : `C ${px(step[0])} ${px(step[1])} ${px(step[2])}`
      )
      .join(" ");
  }

  /** Sizing rules for the current viewport width. */
  function getLayout() {
    return (
      CONFIG.layouts.find((l) => window.innerWidth >= l.minWidth) ||
      CONFIG.layouts[CONFIG.layouts.length - 1]
    );
  }

  // =========================================================
  // ANIMATION
  // =========================================================
  function killTweens() {
    tweens.forEach((t) => t.kill());
    tweens = [];
  }

  /**
   * Colour wash matching pages.css `.animated-gradient`.
   * `phase` (0–1) keeps the two ribbons complementary.
   */
  function animateGradient(gradient, phase = 0) {
    const size = Math.max(stage.clientWidth || 1200, stage.clientHeight || 800) * 6;

    gradient.setAttribute("gradientUnits", "userSpaceOnUse");
    gradient.removeAttribute("spreadMethod");
    // 270deg → leftward diagonal wash across the oversized canvas
    gradient.setAttribute("x1", String(size));
    gradient.setAttribute("y1", "0");
    gradient.setAttribute("x2", "0");
    gradient.setAttribute("y2", String(size * 0.35));

    // Start at background-position: 0% 50%
    const state = { x: 0, y: -size * 0.5 };

    const apply = () => {
      gradient.setAttribute(
        "gradientTransform",
        `translate(${state.x} ${state.y})`
      );
    };
    apply();

    if (prefersReducedMotion) {
      // Static opposite wash when motion is off
      if (phase) {
        state.x = -size;
        state.y = -size * 0.5;
        apply();
      }
      return;
    }

    // CSS `ease` ≈ cubic-bezier(0.25, 0.1, 0.25, 1)
    const ease = "power1.inOut";
    const step = CONFIG.gradientDuration / 4;

    const tl = gsap.timeline({ repeat: -1 });
    // 25% → 50% 0%
    tl.to(state, {
      x: -size * 0.5,
      y: 0,
      duration: step,
      ease,
      onUpdate: apply,
    });
    // 50% → 100% 50%
    tl.to(state, {
      x: -size,
      y: -size * 0.5,
      duration: step,
      ease,
      onUpdate: apply,
    });
    // 75% → 50% 100%
    tl.to(state, {
      x: -size * 0.5,
      y: -size,
      duration: step,
      ease,
      onUpdate: apply,
    });
    // 100% → 0% 50%
    tl.to(state, {
      x: 0,
      y: -size * 0.5,
      duration: step,
      ease,
      onUpdate: apply,
    });

    // Jump ribbon B halfway through the cycle so colours stay complementary.
    if (phase) {
      tl.progress(phase % 1);
      apply();
    }

    tweens.push(tl);
  }

  /** Words from the phrase, without the trailing separators. */
  function phraseWords() {
    return CONFIG.phrase
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  /**
   * Fill a textPath with word + soft `|` tspans (About marquee divider tone).
   * Returns the measured length of one phrase cycle when tiles === 1.
   */
  function fillRibbonCopy(textPath, textEl, tiles) {
    const ns = "http://www.w3.org/2000/svg";
    const words = phraseWords();
    textPath.textContent = "";

    for (let t = 0; t < tiles; t += 1) {
      words.forEach((word) => {
        const wordNode = document.createElementNS(ns, "tspan");
        wordNode.textContent = word;
        textPath.appendChild(wordNode);

        const sep = document.createElementNS(ns, "tspan");
        sep.setAttribute("class", "ribbon-sep");
        // Wide gap around the bar (About marquees use ~px-6 either side)
        sep.textContent = "\u00A0\u00A0\u00A0\u00A0|\u00A0\u00A0\u00A0\u00A0";
        textPath.appendChild(sep);
      });
    }

    return textEl.getComputedTextLength();
  }

  /** Tile and animate the text riding one ribbon. */
  function animateText(textPath, textEl, pathEl, flow) {
    const pathLength = MotionPathPlugin.getLength(pathEl);
    if (!pathLength) return;

    // Measure one phrase, then tile to always overrun the path by a full phrase.
    const phraseLength = fillRibbonCopy(textPath, textEl, 1);
    if (!phraseLength) return;

    const tiles = Math.ceil(pathLength / phraseLength) + 1;
    fillRibbonCopy(textPath, textEl, tiles);

    if (prefersReducedMotion) {
      textPath.setAttribute("startOffset", String(-phraseLength));
      return;
    }

    /*
     * Both endpoints of the sweep cover the whole path, so either direction
     * stays gap-free: forward runs -phrase → 0, reverse runs 0 → -phrase.
     */
    const forward = flow >= 0;
    const state = { offset: forward ? -phraseLength : 0 };

    tweens.push(
      gsap.to(state, {
        offset: forward ? 0 : -phraseLength,
        duration: phraseLength / CONFIG.textSpeed,
        ease: "none",
        repeat: -1,
        onUpdate() {
          textPath.setAttribute("startOffset", String(state.offset));
        },
      })
    );
  }

  function build() {
    if (typeof gsap === "undefined" || typeof MotionPathPlugin === "undefined") {
      return;
    }

    gsap.registerPlugin(MotionPathPlugin);
    killTweens();

    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;

    // 1:1 viewBox keeps stroke width and type in real pixels — no distortion.
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const layout = getLayout();

    CONFIG.ribbons.forEach((ribbon) => {
      const pathEl = document.getElementById(ribbon.pathId);
      const textPath = document.getElementById(ribbon.textId);
      const gradient = document.getElementById(ribbon.gradientId);
      if (!pathEl || !textPath || !gradient) return;

      const textEl = textPath.parentNode;

      const route = ribbon.routes[layout.route];
      pathEl.setAttribute("d", compileRoute(route, width, height));
      pathEl.setAttribute("stroke-width", String(layout.band));

      textEl.style.fontSize = `${layout.font}px`;
      textEl.style.letterSpacing = `${layout.tracking}em`;

      // Colour wash matches About `.animated-gradient` (30s ease).
      // Phases are opposite so the ribbons never share the same colour at once.
      animateGradient(gradient, ribbon.gradientPhase || 0);
      animateText(textPath, textEl, pathEl, ribbon.flow);
    });
  }

  // =========================================================
  // EVENTS / INIT
  // =========================================================
  function scheduleRebuild() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 150);
  }

  function init() {
    if (!stage || !svg) return;

    build();

    window.addEventListener("resize", scheduleRebuild, { passive: true });
    window.addEventListener("hashlabs:ready", scheduleRebuild);

    /*
     * The stage grows as the video and its poster settle, which changes the
     * pixel size every route is solved against. Watching the box itself is
     * more reliable than guessing from window resizes alone.
     */
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(scheduleRebuild).observe(stage);
    }

    // Inter can land after first paint — remeasure once metrics are final.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build).catch(() => {});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
