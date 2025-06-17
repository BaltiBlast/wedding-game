class AsteroidManager {
  static state = {
    scene: null,
    group: null,
    textures: ["asteroid_ron", "asteroid_flat", "asteroid_broken"],
  };

  static preloadAsteroides(scene) {
    scene.load.image("asteroid_ron", "assets/images/traveling/prop_asteroide_ron.png");
    scene.load.image("asteroid_flat", "assets/images/traveling/prop_asteroide_flat.png");
    scene.load.image("asteroid_broken", "assets/images/traveling/prop_asteroide_broken.png");
  }

  static createAsteroides(scene) {
    this.state.scene = scene;

    this.state.group = scene.physics.add.group();

    scene.time.addEvent({
      delay: 600,
      callback: this.spawnAsteroid,
      callbackScope: this,
      loop: true,
    });
  }

  static spawnAsteroid() {
    const { group, textures } = this.state;

    const y = Phaser.Math.Between(50, 950);
    const texture = Phaser.Utils.Array.GetRandom(textures);
    const speed = Phaser.Math.Between(100, 450);

    const scale = Phaser.Math.FloatBetween(0.1, 0.25);
    const asteroid = group.create(-50, y, texture).setScale(scale);

    // Hitbox adaptée
    this.setHitbox(asteroid, texture);
    asteroid.setVelocityX(speed);
    asteroid.setDepth(1);
  }

  static updateAsteroides() {
    const { group } = this.state;

    group.getChildren().forEach((asteroid) => {
      if (asteroid.x > 1100) {
        group.remove(asteroid, true, true);
      }
    });
  }

  static setHitbox(asteroid, texture) {
    switch (texture) {
      case "asteroid_ron":
        asteroid.setCircle(300, 50, 75);
        break;

      case "asteroid_flat":
        asteroid.setSize(700, 250);
        break;

      case "asteroid_broken":
        asteroid.setCircle(230, 120, 50);
        break;
    }
  }

  static getGroup() {
    return this.state.group;
  }
}
