const test = {
  init: () => {
    test.isMobileOrTablet();
  },

  isMobileOrTablet: () => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768 || window.innerHeight < 500;

    if (isMobile || isSmallScreen) {
      window.location.href = "views/mobile.html";
    } else {
      window.location.href = "views/game.html";
    }
  },
};

document.addEventListener("DOMContentLoaded", test.init);
