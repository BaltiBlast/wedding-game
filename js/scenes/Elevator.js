function preloadElevator() {
  // Images
  this.load.image("elevator", "assets/images/elevator/elevator.png");
  this.load.image("alexis-game-sprite", "assets/images/characters/Alexis.png");
  this.load.image("vefa-game-sprite", "assets/images/characters/Vefa.png");

  // Musique
  this.load.audio("music_elevator", "assets/sounds/elevator/music_level.mp3");
}
function createElevator() {
  const SCENE_DURATION = 10000; // Durée totale de la scène en ms
  const MUSIC_FADE_DURATION = 2000;
  this.cameras.main.fadeIn(1000, 0, 0, 0);

  // Placeholder de la cage d’ascenseur
  this.elevatorCage = this.add.image(512, 512, "elevator");

  // Joueur visible dans l’ascenseur (sprite à ajuster selon le personnage)
  const selectedCharacter = this.registry.get("selectedCharacter") || "Alexis";

  if (selectedCharacter === "Vefa") {
    this.player = this.add.sprite(430, 650, `${selectedCharacter.toLowerCase()}-game-sprite`);
    this.player.setScale(0.6);
  } else {
    this.player = this.add.sprite(430, 620, `${selectedCharacter.toLowerCase()}-game-sprite`);
    this.player.setScale(2);
  }

  this.player.setDepth(2);

  // Animation de tremblement de la cage
  this.tweens.add({
    targets: this.elevatorCage,
    x: "+=2",
    duration: 100,
    yoyo: true,
    repeat: -1,
  });

  const musicElevatorLevel = this.sound.add("music_elevator", {
    volume: 0,
    loop: true,
  });

  musicElevatorLevel.play();

  // Fade in de la musique
  this.tweens.add({
    targets: musicElevatorLevel,
    volume: 0.05,
    duration: 2000,
  });

  // Fade out après 8 secondes et transition
  this.tweens.add({
    targets: musicElevatorLevel,
    volume: 0,
    delay: SCENE_DURATION - MUSIC_FADE_DURATION,
    duration: 2000,
    onComplete: () => {
      musicElevatorLevel.stop();
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.time.delayedCall(MUSIC_FADE_DURATION, () => {
        this.scene.start("Level2");
      });
    },
  });
}
function updateElevator() {}
