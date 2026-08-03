/**
 * Circular Arc Showcase
 * Cards sit on a lifted center arc — sides drop & tilt as you scroll.
 * Drag / wheel / prev-next with momentum + infinite loop.
 */
(function () {
  "use strict";

  function initInnovationShowcase() {
    const showcase = document.querySelector("[data-inno-showcase]");
    if (!showcase) return;

    const viewport = showcase.querySelector("[data-inno-viewport]");
    const track = showcase.querySelector("[data-inno-track]");
    const prevBtn = showcase.querySelector("[data-inno-prev]");
    const nextBtn = showcase.querySelector("[data-inno-next]");
    const origCards = Array.from(showcase.querySelectorAll(".inno-card"));

    if (!viewport || !track || !origCards.length) return;

    /* Clone card sets for seamless infinite loop */
    const cloneSetCount = 2;
    for (let c = 0; c < cloneSetCount; c++) {
      origCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
    }

    const allCards = Array.from(track.querySelectorAll(".inno-card"));

    let currentX = 0;
    let targetX = 0;
    let isDragging = false;
    let startX = 0;
    let dragStartX = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = Date.now();
    let animFrameId = null;
    let singleSetWidth = 0;

    function getGap() {
      return parseFloat(getComputedStyle(track).gap) || 28;
    }

    function calculateSetWidth() {
      const gap = getGap();
      let w = 0;
      for (let i = 0; i < origCards.length; i++) {
        w += origCards[i].offsetWidth + gap;
      }
      singleSetWidth = w;
    }

    function wrapOffset(val) {
      if (singleSetWidth <= 0) return val;
      return ((val % singleSetWidth) - singleSetWidth) % singleSetWidth;
    }

    /**
     * Place each card on a circular arc:
     * center = highest / upright, sides drop down & tilt.
     * Uses layout offsets (not getBoundingClientRect) so card
     * transforms don't feedback into the math.
     */
    function cardLayoutCenter(card) {
      /* offsetLeft is from track border edge (track is position:relative) */
      return card.offsetLeft + card.offsetWidth / 2;
    }

    function updateArc() {
      const viewW = viewport.clientWidth;
      const viewCenter = viewW / 2;
      const displayX = wrapOffset(currentX);

      /*
       * ── CIRCULAR / CURVE SETTINGS (edit these) ───────────────
       * File: js/exp-carousel.js  →  inside updateArc()
       *
       * radius   → LARGER = flatter / less curved
       *            SMALLER = more circular / stronger arch
       * maxDrop  → how far side cards sink down (px)
       * maxRot   → max tilt angle of side cards (degrees)
       */
      const radius = Math.max(viewW * 1, 1600); /* flatter arc */
      const isMobile = viewW < 640;
      const maxDrop = isMobile ? 130 : 180;
      const maxRot = isMobile ? 4 : 7;

      allCards.forEach((card) => {
        const cardCenterInView = cardLayoutCenter(card) + displayX;
        const dx = cardCenterInView - viewCenter;
        const angle = dx / radius;

        let y = radius * (1 - Math.cos(angle));
        let rot = (angle * 180) / Math.PI;

        if (y > maxDrop) y = maxDrop + (y - maxDrop) * 0.25;
        if (rot > maxRot) rot = maxRot + (rot - maxRot) * 0.2;
        if (rot < -maxRot) rot = -maxRot + (rot + maxRot) * 0.2;

        card.style.setProperty("--arc-y", y.toFixed(2) + "px");
        card.style.setProperty("--arc-rot", rot.toFixed(3) + "deg");
      });
    }

    function render() {
      if (!isDragging) {
        if (Math.abs(velocity) > 0.08) {
          targetX += velocity;
          velocity *= 0.93;
        } else {
          velocity = 0;
        }
      }

      currentX += (targetX - currentX) * 0.12;

      const displayX = wrapOffset(currentX);
      track.style.transform = "translate3d(" + displayX.toFixed(2) + "px, 0, 0)";
      updateArc();

      if (
        Math.abs(targetX - currentX) > 0.05 ||
        isDragging ||
        Math.abs(velocity) > 0.08
      ) {
        animFrameId = requestAnimationFrame(render);
      } else {
        animFrameId = null;
        /* Keep arc correct even when idle (e.g. after resize) */
        updateArc();
      }
    }

    function requestRender() {
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(render);
      }
    }

    function onPointerDown(e) {
      if (e.target.closest("a, button")) return;

      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      dragStartX = currentX;
      velocity = 0;
      lastX = startX;
      lastTime = Date.now();

      viewport.style.cursor = "grabbing";
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
      document.addEventListener("pointercancel", onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;

      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - startX;

      const now = Date.now();
      const dt = Math.max(1, now - lastTime);
      velocity = ((clientX - lastX) / dt) * 14;
      lastX = clientX;
      lastTime = now;

      targetX = dragStartX + deltaX;
      requestRender();
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      viewport.style.cursor = "grab";

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);

      snapToNearestCard();
      requestRender();
    }

    function getCardStep() {
      return (origCards[0] ? origCards[0].offsetWidth : 300) + getGap();
    }

    /** Offset that places a given original-card index at viewport center */
    function offsetForCenteredCard(index) {
      const card = origCards[index];
      if (!card) return 0;
      return viewport.clientWidth / 2 - cardLayoutCenter(card);
    }

    function snapToNearestCard() {
      const step = getCardStep();
      if (step <= 0) return;
      const base = offsetForCenteredCard(0);
      const n = Math.round((base - targetX) / step);
      targetX = base - n * step;
    }

    viewport.addEventListener("pointerdown", onPointerDown);

    /* Wheel disabled — control only via drag + arrow buttons */

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        targetX += getCardStep();
        velocity = 0;
        snapToNearestCard();
        requestRender();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        targetX -= getCardStep();
        velocity = 0;
        snapToNearestCard();
        requestRender();
      });
    }

    function centerOnCard(index) {
      const offset = offsetForCenteredCard(index);
      currentX = offset;
      targetX = offset;
    }

    function onResize() {
      calculateSetWidth();
      centerOnCard(Math.min(2, origCards.length - 1));
      updateArc();
      requestRender();
    }

    calculateSetWidth();
    /* Start with a mid card centered so the arc reads immediately */
    centerOnCard(Math.min(2, origCards.length - 1));

    window.addEventListener("resize", onResize);
    requestRender();

    /* Entrance — opacity only so GSAP never overwrites arc transforms */
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".shape-blue-circle, .shape-lime-arc", {
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: showcase, start: "top 80%", once: true },
      });

      gsap.from(".inno-showcase-title", {
        opacity: 0,
        y: 36,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: showcase, start: "top 75%", once: true },
      });

      gsap.from(origCards, {
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: { trigger: showcase, start: "top 70%", once: true },
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInnovationShowcase);
  } else {
    setTimeout(initInnovationShowcase, 60);
  }
})();
