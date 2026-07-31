document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  function initMarquee(wrapper, track) {
    if (!wrapper || !track) return;
    if (wrapper.dataset.scrollerLoopInit === "true") return;
    wrapper.dataset.scrollerLoopInit = "true";

    const clone1 = track.cloneNode(true);
    const clone2 = track.cloneNode(true);
    clone1.removeAttribute("id");
    clone2.removeAttribute("id");
    wrapper.appendChild(clone1);
    wrapper.appendChild(clone2);

    let position = 0;
    const speed = Math.abs(Number(wrapper.dataset.speed) || 60);
    const reverse =
      wrapper.dataset.direction === "reverse" ||
      wrapper.dataset.direction === "rtl";
    let primed = false;
    let isPaused = false;
    let lastTime = performance.now();

    function step(now) {
      if (!isPaused) {
        const dt = Math.max(0, now - lastTime);
        lastTime = now;
        const w = track.offsetWidth || track.scrollWidth;
        if (w > 0) {
          if (!primed) {
            position = reverse ? -w : 0;
            primed = true;
          }
          if (reverse) {
            position += speed * (dt / 1000);
            if (position >= 0) position -= w;
          } else {
            position -= speed * (dt / 1000);
            if (position <= -w) position += w;
          }
          wrapper.style.transform = `translateX(${position}px)`;
        }
      } else {
        lastTime = now;
      }
      requestAnimationFrame(step);
    }

    wrapper.addEventListener("mouseenter", () => {
      isPaused = true;
    });
    wrapper.addEventListener("mouseleave", () => {
      isPaused = false;
    });

    requestAnimationFrame(step);
  }

  // Legacy single scroller (#scroller / #scroller-wrapper)
  initMarquee(
    document.getElementById("scroller-wrapper"),
    document.getElementById("scroller")
  );

  // Any additional marquees
  document.querySelectorAll("[data-marquee-wrapper]").forEach((wrapper) => {
    const track = wrapper.querySelector("[data-marquee-track]");
    initMarquee(wrapper, track);
  });
});
