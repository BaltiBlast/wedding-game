class Elevator extends Phaser.Scene {
  constructor() {
    super({ key: "Elevator" });
  }

  preload() {
    // Images
    this.load.image("bg_elevator", "../assets/images/elevator/bg_elevator.png");
    this.load.image("char_alexis_game", "../assets/images/characters/char_alexis_game.png");
    this.load.image("char_vefa_game", "../assets/images/characters/char_vefa_game.png");

    // Musique
    this.load.audio("mus_elevator_theme", "../assets/sounds/elevator/mus_elevator_theme.mp3");
  }

  create() {
    // Scene transition
    this.setupTransition();

    // Audio setup
    AudioManager.setBackgroundMusic(this, "mus_elevator_theme", 0.1, false, 2500);

    // Background
    this.elevatorCage = this.add.image(512, 512, "bg_elevator");

    // Display current character selected
    this.currentCharacter();

    // Elevator's animation
    this.elevatorAnimation();

    // Scene fade out
    this.fadeOutScene();
  }

  update() {}

  // ------------------------------------------------------------------------------------------ //
  // SCENE TRANSITION SETUP
  // ------------------------------------------------------------------------------------------ //
  setupTransition() {
    SceneManager.fadeInScene(this);
  }

  // ------------------------------------------------------------------------------------------ //
  // CURRENT CHARACTER SELECTED SETUP
  // ------------------------------------------------------------------------------------------ //
  currentCharacter() {
    const selectedCharacter = this.registry.get("selectedCharacter") || "Vefa";
    const selectedCharacterNormalize = selectedCharacter.toLowerCase();
    if (selectedCharacter === "Vefa") {
      this.player = this.add.sprite(430, 650, `char_${selectedCharacterNormalize}_game`);
      this.player.setScale(0.6);
    } else {
      this.player = this.add.sprite(430, 620, `char_${selectedCharacterNormalize}_game`);
      this.player.setScale(2);
    }
  }

  // ------------------------------------------------------------------------------------------ //
  // ELEVATOR ANIMATION
  // ------------------------------------------------------------------------------------------ //
  elevatorAnimation() {
    this.tweens.add({
      targets: this.elevatorCage,
      x: "+=2",
      duration: 100,
      yoyo: true,
      repeat: -1,
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // SCENE FADEOUT
  // ------------------------------------------------------------------------------------------ //
  fadeOutScene() {
    this.time.delayedCall(10000, () => {
      AudioManager.stopBackgroundMusic(this, "mus_elevator_theme", 2500);
      SceneManager.changeSceneWithFade(this, "Level2", 2600);
    });
  }
}
