// Meet Our Team — pin section, horizontal scrub, then continue vertical
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth < 1025) {
    return; // mobile keeps CSS auto-scroll
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Please load GSAP and ScrollTrigger first");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const teamSection = document.querySelector(".team-section");
  const teamTrack = document.querySelector(".team-track");

  if (!teamSection || !teamTrack) return;

  teamTrack.style.animation = "none";
  teamTrack.style.justifyContent = "flex-start";

  let st = null;

  function setup() {
    if (st) {
      st.kill();
      st = null;
      gsap.set(teamTrack, { clearProps: "x" });
    }

    if (window.innerWidth < 1025) return;

    const trackWidth = teamTrack.scrollWidth;
    const sectionWidth = teamSection.offsetWidth;
    const scrollDistance = Math.max(0, trackWidth - sectionWidth);

    if (scrollDistance <= 40) {
      teamTrack.style.justifyContent = "center";
      return;
    }

    const tween = gsap.to(teamTrack, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: teamSection,
        start: "top top",
        end: () => "+=" + Math.max(scrollDistance * 1.15, window.innerHeight),
        scrub: 0.85,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,
      },
    });

    st = tween.scrollTrigger;
  }

  // Wait for images so widths are correct
  const images = teamTrack.querySelectorAll("img");
  let pending = images.length;

  function maybeSetup() {
    pending -= 1;
    if (pending <= 0) {
      setup();
      ScrollTrigger.refresh();
    }
  }

  if (pending === 0) {
    setup();
  } else {
    images.forEach((img) => {
      if (img.complete) maybeSetup();
      else {
        img.addEventListener("load", maybeSetup, { once: true });
        img.addEventListener("error", maybeSetup, { once: true });
      }
    });
    // safety refresh
    setTimeout(() => {
      setup();
      ScrollTrigger.refresh();
    }, 600);
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      setup();
      ScrollTrigger.refresh();
    }, 250);
  });
});
