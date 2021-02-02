window.addEventListener("DOMContentLoaded", () => {
  "use strict";
  // слайдер шапки
  const swiper = new Swiper(".header__container", {
    pagination: {
      el: ".swiper-pagination",
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    lazy: true,
  });

  // слайдер отзывов
  const swiper2 = new Swiper(".reviews__container", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    slidesPerView: 2,
    spaceBetween: 30,
    lazy: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });

  // рейтинг
  const ratings = document.querySelectorAll(".rating");

  if (ratings.length > 0) {
    initRatings();
  }

  // Функция запуска рейтинга
  function initRatings() {
    let ratingActive, ratingValue;
    for (let index = 0; index < ratings.length; index++) {
      const rating = ratings[index];
      initRating(rating);
    }

    // инициилизируем рейтинг
    function initRating(rating) {
      initRatingVars(rating);
      setRatingActiveWith();
    }

    // инициализация переменных
    function initRatingVars(rating) {
      ratingActive = rating.querySelector(".rating__active");
      ratingValue = rating.querySelector(".rating__value");
    }

    // меняем ширину активных звезд
    function setRatingActiveWith(index = ratingValue.innerHTML) {
      const ratingActiveWidth = index / 0.05;
      ratingActive.style.width = `${ratingActiveWidth}%`;
    }
  }
});
