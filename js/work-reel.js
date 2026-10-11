/**
 * Our Work product reel — seamless auto-scroll (pauses on hover).
 */
(function () {
  "use strict";

  var SPEED = 0.55;

  function initWorkReel() {
    var root = document.querySelector("[data-work-reel]");
    if (!root) return;

    var scroller = root.querySelector("[data-work-reel-scroller]");
    var track = root.querySelector("[data-work-reel-track]");
    var dots = Array.from(root.querySelectorAll("[data-work-reel-dots] button"));
    if (!scroller || !track) return;

    var originals = Array.from(track.querySelectorAll(".work-reel-panel"));
    var count = originals.length;
    if (!count) return;

    /* Duplicate once for seamless loop */
    originals.forEach(function (panel) {
      var clone = panel.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("data-reel-index");
      track.appendChild(clone);
    });

    var paused = false;
    var resumeTimer = null;
    var active = 0;
    var halfWidth = 0;
    var rafId = 0;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function measure() {
      halfWidth = track.scrollWidth / 2;
    }

    function setActive(i) {
      var next = ((i % count) + count) % count;
      if (next === active) return;
      active = next;
      dots.forEach(function (dot, di) {
        dot.classList.toggle("is-active", di === next);
      });
    }

    function syncActive() {
      if (!halfWidth) return;
      var mid = scroller.scrollLeft + scroller.clientWidth / 2;
      var panels = track.querySelectorAll(".work-reel-panel");
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i < panels.length; i++) {
        var panel = panels[i];
        var center = panel.offsetLeft + panel.offsetWidth / 2;
        var dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      setActive(best % count);
    }

    function goTo(i) {
      var target = ((i % count) + count) % count;
      var panel = originals[target];
      if (!panel) return;
      paused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      var left = panel.offsetLeft - (scroller.clientWidth - panel.offsetWidth) / 2;
      scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      setActive(target);
      resumeTimer = setTimeout(function () {
        paused = false;
      }, 2200);
    }

    function tick() {
      if (!reduceMotion && !paused && halfWidth > 0) {
        scroller.scrollLeft += SPEED;
        if (scroller.scrollLeft >= halfWidth) {
          scroller.scrollLeft -= halfWidth;
        }
        syncActive();
      }
      rafId = window.requestAnimationFrame(tick);
    }

    scroller.addEventListener("mouseenter", function () {
      paused = true;
    });
    scroller.addEventListener("mouseleave", function () {
      if (resumeTimer) clearTimeout(resumeTimer);
      paused = false;
    });
    scroller.addEventListener(
      "touchstart",
      function () {
        paused = true;
      },
      { passive: true }
    );
    scroller.addEventListener(
      "touchend",
      function () {
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () {
          paused = false;
        }, 1800);
      },
      { passive: true }
    );

    scroller.addEventListener(
      "scroll",
      function () {
        window.requestAnimationFrame(syncActive);
      },
      { passive: true }
    );

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var i = Number(dot.getAttribute("data-reel-to"));
        if (!Number.isNaN(i)) goTo(i);
      });
    });

    window.addEventListener("resize", function () {
      measure();
      syncActive();
    });

    measure();
    syncActive();
    rafId = window.requestAnimationFrame(tick);

    /* Expose cleanup if needed */
    root._workReelStop = function () {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWorkReel);
  } else {
    initWorkReel();
  }
})();
