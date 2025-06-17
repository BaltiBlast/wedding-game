class StarshipManager {
  static state = {
    scene: null,
    spaceship: null,
    cursors: null,
    keys: null,
    baseY: null,
    elapsed: 0,
  };

  static createStarshipControls(scene) {
    this.state.scene = scene;

    this.state.spaceship = scene.physics.add.image(800, 500, "prop_spaceship").setScale(0.2);
    this.state.spaceship.setCircle(300, 80, 50);

    this.state.baseY = this.state.spaceship.y;

    this.state.cursors = scene.input.keyboard.createCursorKeys();
    this.state.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  static updateMovement(speed = 150) {
    const { spaceship, cursors, keys } = this.state;
    if (!spaceship) return;

    // Reset la vélocité à chaque frame
    spaceship.setVelocity(0);

    // Mouvement basé sur les touches
    if (cursors.left.isDown || keys.left.isDown) {
      spaceship.setVelocityX(-speed);
    }
    if (cursors.right.isDown || keys.right.isDown) {
      spaceship.setVelocityX(speed);
    }
    if (cursors.up.isDown || keys.up.isDown) {
      spaceship.setVelocityY(-speed);
    }
    if (cursors.down.isDown || keys.down.isDown) {
      spaceship.setVelocityY(speed);
    }

    // Légère oscillation (flottement)
    this.state.elapsed += 0.1;
    const floatOffset = Math.sin(this.state.elapsed) * 2;
    spaceship.y += floatOffset * 0.1; // très subtil pour ne pas fausser la hitbox
  }
  static getSpaceship() {
    return this.state.spaceship;
  }
}
