const test = {
  init: () => {
    test.isMobileOrTablet();
  },

  isMobileOrTablet: () => {
    const isSmallScreen = window.innerWidth < 1024 || window.innerHeight < 1024;

    if (isSmallScreen) {
      window.location.href = "./mobile.html";
    } else {
      window.location.href = "./game.html";
    }
  },
};

document.addEventListener("DOMContentLoaded", test.init);
