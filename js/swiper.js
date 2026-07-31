// Swiper for cards or product grid
const swiperCards = new Swiper('.swiper', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 4000, // 4s
    disableOnInteraction: false,
  },
  breakpoints: {
    640: { slidesPerView: 2 },   // tablets
    1024: { slidesPerView: 4 },  // large screens
  },
  pagination: {
    el: '.swiper-pagination-cards', // unique class
    clickable: true,
  },
});
