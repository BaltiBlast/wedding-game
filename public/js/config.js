const GameConfig = {
  width: 1024,
  height: 1024,
  pixelArt: true,
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  WEDDING_DATE: "270925",
  defaultDuration: 2000,

  dom: {
    createContainer: true,
  },
  scenes: [ScreenTitle, Atrebois, Elevator, LaunchPlatform, Cockpit, StarshipTraveling, Leviathe, Ending],
};
