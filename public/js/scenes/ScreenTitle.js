class ScreenTitle extends Phaser.Scene {
  constructor() {
    super({ key: "ScreenTitle" });
  }

  // ------------------------------------------------------------------------------------------ //
  // PRELOAD SCENE'S ASSETS
  // ------------------------------------------------------------------------------------------ //
  preload() {
    // Images
    this.load.image("bg_title_screen", "../assets/images/title_screen/bg_title_screen.png");
    this.load.image("char_alexis_idle", "../assets/images/title_screen/char_alexis_idle.png");
    this.load.image("char_vefa_idle", "../assets/images/title_screen/char_vefa_idle.png");
    this.load.image("prop_astronaut", "../assets/images/title_screen/prop_astronaut.png");
    this.load.image("prop_lantern", "../assets/images/title_screen/prop_lantern.png");
    this.load.spritesheet("fx_fire_animation", "../assets/images/title_screen/fx_fire_animation.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    // Audio
    this.load.audio("sfx_character_select", "../assets/sounds/title_screen/sfx_character_select.mp3");
    this.load.audio("amb_title_atmosphere", "../assets/sounds/title_screen/amb_title_atmosphere.mp3");
    this.load.audio("sfx_button_start", "../assets/sounds/title_screen/sfx_button_start.mp3");
    this.load.audio("ow_title_theme", "../assets/sounds/title_screen/ow_title_theme.mp3");
  }

  // ------------------------------------------------------------------------------------------ //
  // CREATE SCENE'S ELEMENTS
  // ------------------------------------------------------------------------------------------ //
  create() {
    // Background scene
    this.add.image(512, 512, "bg_title_screen");

    // Scene transition
    this.setUpTransition();

    // Audio setup
    AudioManager.setBackgroundMusic(this, "amb_title_atmosphere", 0.1, true, 5000);
    AudioManager.setBackgroundMusic(this, "ow_title_theme", 0.3, true, 5000);

    // Title
    this.createTitle();

    // Characters
    this.createCharacters();

    // Start button
    this.createStartButton();

    // Decorative elements
    this.createDecorativeElements();

    // Start animation sequence
    this.cameras.main.once("camerafadeincomplete", () => {
      this.startAnimationSequence();
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // TITLE SETUP
  // ------------------------------------------------------------------------------------------ //
  createTitle() {
    this.title = this.add
      .text(512, 120, "Stellar Wedding", {
        fontFamily: "Doto",
        fontSize: "80px",
        fontWeight: "500",
        fill: "#ffffff",
        stroke: "#64FFDA",
        strokeThickness: 4,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: "#64FFDA",
          blur: 20,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0);
  }

  animateTitle() {
    this.tweens.add({
      targets: this.title,
      y: 170,
      alpha: 1,
      duration: 1500,
      ease: "Back.easeOut",
      onComplete: () => {
        // Continuous pulsation animation
        this.tweens.add({
          targets: this.title,
          alpha: 0.8,
          duration: 2500,
          ease: "Sine.easeInOut",
          yoyo: true,
          repeat: -1,
        });

        this.tweens.add({
          targets: this.title.style,
          strokeThickness: 6,
          duration: 3000,
          ease: "Sine.easeInOut",
          yoyo: true,
          repeat: -1,
        });
      },
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // CHARACTERS SETUP
  // ------------------------------------------------------------------------------------------ //
  createCharacters() {
    // Selection text
    this.characterDisplay = this.add
      .text(512, 400, "Choisissez un personnage", {
        fontSize: "18px",
        fill: "#cccccc",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Character sprites
    this.alexisSprite = this.add.image(800, 650, "char_alexis_idle");
    this.alexisSprite.setScale(0.49);
    this.alexisSprite.setAlpha(0);
    this.alexisSprite.setInteractive({ useHandCursor: true });

    this.vefaSprite = this.add.image(250, 670, "char_vefa_idle");
    this.vefaSprite.setScale(-0.5, 0.5);
    this.vefaSprite.setAlpha(0);
    this.vefaSprite.setInteractive({ useHandCursor: true });

    // Selection variables
    this.selectedCharacter = "Vefa";
    this.registry.set("selectedCharacter", this.selectedCharacter);

    // Character name text
    this.characterNameText = this.add
      .text(0, 0, "", {
        fontSize: "20px",
        fill: "#64FFDA",
        fontFamily: "Space Mono",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Interactions
    this.setupCharacterInteractions();
  }

  setupCharacterInteractions() {
    this.alexisSprite.on("pointerdown", () => {
      AudioManager.playSoundEffects(this, "sfx_character_select", 0.1);
      this.selectedCharacter = "Alexis";
      this.registry.set("selectedCharacter", this.selectedCharacter);
      this.updateCharacterSelection();
    });

    this.vefaSprite.on("pointerdown", () => {
      AudioManager.playSoundEffects(this, "sfx_character_select", 0.1);
      this.selectedCharacter = "Vefa";
      this.registry.set("selectedCharacter", this.selectedCharacter);
      this.updateCharacterSelection();
    });
  }

  updateCharacterSelection() {
    if (this.selectedCharacter === "Alexis") {
      // Alexis selected
      this.alexisSprite.setTint(0xffffff);
      this.alexisSprite.setAlpha(1);

      // Vefa unselected
      this.vefaSprite.setTint(0x888888);
      this.vefaSprite.setAlpha(0.7);

      // Name above Alexis
      this.characterNameText.setText("Alexis");
      this.characterNameText.setPosition(this.alexisSprite.x, 400);
      this.characterNameText.setAlpha(1);
    } else {
      // Vefa selected
      this.vefaSprite.setTint(0xffffff);
      this.vefaSprite.setAlpha(1);

      // Alexis unselected
      this.alexisSprite.setTint(0x888888);
      this.alexisSprite.setAlpha(0.7);

      // Name above Vefa
      this.characterNameText.setText("Vefa");
      this.characterNameText.setPosition(this.vefaSprite.x, 400);
      this.characterNameText.setAlpha(1);
    }
  }

  // ------------------------------------------------------------------------------------------ //
  // START BUTTON SETUP
  // ------------------------------------------------------------------------------------------ //
  createStartButton() {
    this.startButton = this.add.rectangle(512, 950, 200, 60, 0x1a4d4d);
    this.startButton.setAlpha(0);
    this.startButton.setStrokeStyle(2, 0x64ffda);
    this.startButton.setDepth(1);
    this.startButton.setInteractive({ useHandCursor: true });

    this.startButtonText = this.add
      .text(512, 950, "Start", {
        fontFamily: "Space Mono",
        fontSize: "24px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(1);

    this.setupStartButtonInteractions();
  }

  setupStartButtonInteractions() {
    this.startButton.on("pointerover", () => {
      this.startButton.setFillStyle(0x2a5d5d);
      this.startButtonText.setStyle({ fill: "#64FFDA" });
    });

    this.startButton.on("pointerout", () => {
      this.startButton.setFillStyle(0x1a4d4d);
      this.startButtonText.setStyle({ fill: "#ffffff" });
    });

    this.startButton.on("pointerdown", () => {
      AudioManager.playSoundEffects(this, "sfx_button_start", 0.03);
      AudioManager.stopBackgroundMusic(this, "ow_title_theme", 2500);
      AudioManager.stopBackgroundMusic(this, "amb_title_atmosphere", 2500);
      SceneManager.changeSceneWithFade(this, "Level1", 2600);
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // DECORATIVE ELEMENTS SETUP
  // ------------------------------------------------------------------------------------------ //
  createDecorativeElements() {
    // Astronaut
    this.cosmonaute = this.add.image(690, 850, "prop_astronaut");

    // Lantern
    this.lanterne = this.add.image(875, 850, "prop_lantern");

    // Fire animation
    this.anims.create({
      key: "fx_fire_animation",
      frames: this.anims.generateFrameNumbers("fx_fire_animation", { start: 0, end: 7 }),
      frameRate: 7,
      repeat: -1,
    });

    this.spark = this.add.sprite(510, 720, "fx_fire_animation");
    this.spark.setScale(6);
    this.spark.play("fx_fire_animation");
  }

  // ------------------------------------------------------------------------------------------ //
  // ANIMATION SEQUENCE
  // ------------------------------------------------------------------------------------------ //
  startAnimationSequence() {
    this.animateTitle();
    this.showCharacters();
    this.showStartButton();
  }

  showStartButton() {
    // Start button appears last
    SceneManager.showElementWithDelay(this, this.startButton, 1800, 600);
    SceneManager.showElementWithDelay(this, this.startButtonText, 1800, 600);
  }

  showCharacters() {
    // Selection text
    SceneManager.showElementWithDelay(this, this.characterDisplay, 800, 600);

    // Vefa (selected by default)
    this.vefaSprite.setTint(0xffffff);
    SceneManager.showElementWithDelay(this, this.vefaSprite, 1200, 400, 1);

    // Alexis (unselected)
    this.alexisSprite.setTint(0x888888);
    SceneManager.showElementWithDelay(this, this.alexisSprite, 1400, 400, 0.7);

    // Vefa's name after her appearance
    this.time.delayedCall(1600, () => {
      this.updateCharacterSelection();
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // TRANSITION SCENE SETUP
  // ------------------------------------------------------------------------------------------ //
  setUpTransition() {
    SceneManager.fadeInScene(this);
  }
}
