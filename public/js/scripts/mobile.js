function redirectToGameIfLargeEnough() {
  if (window.innerWidth >= 1024 && window.innerHeight >= 1024) {
    window.location.replace("./game.html");
  }
}

window.addEventListener("DOMContentLoaded", redirectToGameIfLargeEnough);
window.addEventListener("resize", redirectToGameIfLargeEnough);
