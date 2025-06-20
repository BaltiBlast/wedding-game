// ======================================================================== //
// USAGE
//
// 1. Add in scene's preload :
// Keyboard guide assets
// KeyboardGuide.preloadKeyboardGuide(this);
//
// 2. Add in scene's create :
// Set up keyboard guide
// KeyboardGuide.createKeyboardGuideAnimations(this);
// KeyboardGuide.displayKeyboardGuide(this, x, y, scale);
//
// Explains : this = scene, x = position axe x, y = position axe y, scale = size (1 by default)
// ======================================================================== //

class KeyboardGuide {
  //-------------------------------------------------------------------------------------------- //
  static preloadKeyboardGuide(scene) {
    scene.load.spritesheet("keyboard", "../assets/images/spritesheets/keyboard.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  //-------------------------------------------------------------------------------------------- //
  static createKeyboardGuideAnimations(scene) {
    // Keyboard up
    scene.anims.create({
      key: "keyboardUp",
      frames: [
        { key: "keyboard", frame: 76 },
        { key: "keyboard", frame: 172 },
      ],
      frameRate: 1,
      yoyo: true,
      repeat: -1,
    });

    // Keyboard left
    scene.anims.create({
      key: "keyboardLeft",
      frames: [
        { key: "keyboard", frame: 91 },
        { key: "keyboard", frame: 187 },
      ],
      frameRate: 1,
      yoyo: true,
      repeat: -1,
    });

    // Keyboard down
    scene.anims.create({
      key: "keyboardDown",
      frames: [
        { key: "keyboard", frame: 92 },
        { key: "keyboard", frame: 188 },
      ],
      frameRate: 1,
      yoyo: true,
      repeat: -1,
    });

    // Keyboard right
    scene.anims.create({
      key: "keyboardRight",
      frames: [
        { key: "keyboard", frame: 93 },
        { key: "keyboard", frame: 189 },
      ],
      frameRate: 1,
      yoyo: true,
      repeat: -1,
    });
  }

  //-------------------------------------------------------------------------------------------- //
  static displayKeyboardGuide(scene, x, y, scale = 1) {
    const spacing = 16 * scale;
    const container = scene.add.container();

    // Keyboard up
    const up = scene.add
      .sprite(x, y - spacing, "keyboard")
      .setScale(scale)
      .play("keyboardUp");

    // Keyboard left
    const left = scene.add
      .sprite(x - spacing, y, "keyboard")
      .setScale(scale)
      .play("keyboardLeft");

    // Keyboard down
    const down = scene.add.sprite(x, y, "keyboard").setScale(scale).play("keyboardDown");

    // Keyboard right
    const right = scene.add
      .sprite(x + spacing, y, "keyboard")
      .setScale(scale)
      .play("keyboardRight");

    container.add([up, left, down, right]);
    container.setDepth(99999);

    // Hide block when a key has pushed
    this.hideOnArrowKeyPress(scene, container);
    return container;
  }

  //-------------------------------------------------------------------------------------------- //
  static hideOnArrowKeyPress(scene, container) {
    const keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });

    const removeIfKeyPressed = () => {
      if (keys.up.isDown || keys.down.isDown || keys.left.isDown || keys.right.isDown) {
        scene.tweens.add({
          targets: container,
          alpha: 0,
          duration: 300,
          onComplete: () => container.destroy(),
        });
        scene.events.off("update", removeIfKeyPressed);
      }
    };

    scene.events.on("update", removeIfKeyPressed);
  }
}
