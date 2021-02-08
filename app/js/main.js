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

  // кнопка наверх
  const btnUp = document.querySelector(".up");

  function trackScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      btnUp.style.display = "block";
      btnUp.classList.add("animated");
    }
    if (scrolled < coords) {
      btnUp.style.display = "none";
      btnUp.classList.remove("animated");
    }
  }

  function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(backToTop, 0);
    }
  }

  window.addEventListener("scroll", trackScroll);
  btnUp.addEventListener("click", backToTop);

  // модальное окно
  const modalTrigger = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal"),
    modalCloseBtn = document.querySelector("[data-close]");

  function openModal(params) {
    modal.style.display = "block";
    // фиксируем страницу за модальным окном
    document.body.style.overflow = "hidden";
    // если модальное окно было ранее открыто оно не вызывается
    clearInterval(modalTimerId);
  }

  modalTrigger.forEach((btn) => [btn.addEventListener("click", openModal)]);

  // dry не повторяй участки кода
  function closeModal(params) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  modalCloseBtn.addEventListener("click", closeModal); // closeModal передаем как название

  // действия по закрытию модального окна при клике вне окна
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(); // вызываем
    }
  });
  // при нажатии на esc закрываем модальное окно
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // модальное окно появляется когда пользыватель пролистал страницу или через промежуток времени
  const modalTimerId = setTimeout(openModal, 6000);

  function showModalBtScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal();
      window.removeEventListener("scroll", showModalBtScroll);
    }
  }

  window.addEventListener("scroll", showModalBtScroll);
});
