var swiper2 = new Swiper(".mySwiper", {
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 800,
  pagination: {
    el: ".swiper-pagination",
    type: "progressbar",
  },
  on: {
    autoplayTimeLeft(s, time, progress) {
      const bar = document.querySelector(".mySwiper .swiper-pagination-progressbar-fill");
      if (bar) {
        bar.style.transform = `scaleX(${1 - progress})`; 
      }
    }
  }
});
