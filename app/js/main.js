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
    slidesPerView: 1,
    spaceBetween: 30,
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

  // кнопка меню
  const btn = document.querySelector(".menu__btn");
  const list = document.querySelector(".menu__list");

  btn.addEventListener("click", () => {
    list.classList.toggle("show");
  });

  // липкая шапка
  const menu = document.querySelector(".menu");
  const sticky = menu.offsetTop;

  window.onscroll = function () {
    scroll();
  };

  function scroll() {
    if (window.pageYOffset > sticky) {
      menu.classList.add("sticky");
    } else {
      menu.classList.remove("sticky");
    }
  }

  // модальное окно
  const modal = document.querySelector(".modal");

  modal.setTimeout(() => {
    modal.style.display = "block";
  }, 5000);
});
