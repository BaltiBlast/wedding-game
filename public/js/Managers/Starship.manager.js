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
  }

  static updateMovement(speed = 150) {
    const { spaceship, cursors } = this.state;
    if (!spaceship) return;

    spaceship.setVelocity(0);

    if (cursors.left.isDown) {
      spaceship.setVelocityX(-speed);
    }
    if (cursors.right.isDown) {
      spaceship.setVelocityX(speed);
    }
    if (cursors.up.isDown) {
      spaceship.setVelocityY(-speed);
    }
    if (cursors.down.isDown) {
      spaceship.setVelocityY(speed);
    }

    this.state.elapsed += 0.1;
    const floatOffset = Math.sin(this.state.elapsed) * 2;
    spaceship.y += floatOffset * 0.1;
  }
  static getSpaceship() {
    return this.state.spaceship;
  }
}
