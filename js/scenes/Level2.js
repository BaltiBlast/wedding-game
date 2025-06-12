function preloadLevel2() {
  // Images
  this.load.image("background", "assets/images/level2/lvl2_background.png");
}
function createLevel2() {
  this.cameras.main.fadeIn(1000, 0, 0, 0);
  this.add.image(512, 512, "background");
}
function updateLevel2() {}
