function preloadTitleScreen() {
  // Images
  this.load.image("title-background", "assets/images/title_screen/title_background.png");
  this.load.image("alexis-sprite", "assets/images/title_screen/start_alexis.png");
  this.load.image("vefa-sprite", "assets/images/title_screen/start_vefa.png");

  // Audio
  this.load.audio("character-select", "assets/sounds/title_screen/woosh.mp3");
  this.load.audio("ambiance", "assets/sounds/title_screen/ambiance.mp3");
  this.load.audio("start", "assets/sounds/title_screen/start.wav");
}

function createTitleScreen() {
  // Fade in de la scène complète
  this.cameras.main.fadeIn(1000, 0, 0, 0);

  // Son ambiant
  const titleMusic = this.sound.add("ambiance", {
    volume: 0.3,
    loop: true,
  });
  titleMusic.play();

  // Image de fond
  this.add.image(512, 512, "title-background");

  // ================================================================================================================================== //
  // ELEMENT DU DE L'ECRAN TITRE (Invisible avant display)
  // ================================================================================================================================== //

  // -------------------------------------------------------------------------------------------- //
  // Titre
  const title = this.add
    .text(512, 120, "F A V E X I S", {
      fontFamily: "Comfortaa",
      fontSize: "72px",
      fontWeight: "700",
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

  // -------------------------------------------------------------------------------------------- //
  // Emplacement personnage
  characterDisplay = this.add
    .text(200, 400, "Choisissez un personnage", {
      fontSize: "18px",
      fill: "#cccccc",
    })
    .setOrigin(0.5)
    .setAlpha(0);

  selectedCharacter = "Vefa";
  this.registry.set("selectedCharacter", selectedCharacter);

  characterSprite = this.add.image(200, 650, "vefa-sprite");
  characterSprite.setScale(0.5).setAlpha(0);

  // -------------------------------------------------------------------------------------------- //
  // Alexis boutton

  const alexisButtonText = this.add
    .text(800, 600, "[ Alexis ]", {
      fontFamily: "Space Mono",
      fontSize: "28px",
      fill: "#fff",
      strokeThickness: 1,
    })
    .setOrigin(0.5)
    .setAlpha(0);

  // -------------------------------------------------------------------------------------------- //
  // Vefa boutton

  const vefaButtonText = this.add
    .text(800, 675, "[ Vefa ]", {
      fontFamily: "Space Mono",
      fontSize: "28px",
      fill: "#fff",
      strokeThickness: 1,
    })
    .setOrigin(0.5)
    .setAlpha(0);

  // -------------------------------------------------------------------------------------------- //
  // Start boutton
  const startButton = this.add.rectangle(512, 950, 200, 60, 0x1a4d4d).setAlpha(0);
  startButton.setStrokeStyle(2, 0x64ffda);

  const startButtonText = this.add
    .text(512, 950, "Start", {
      fontFamily: "Space Mono",
      fontSize: "24px",
      fill: "#ffffff",
    })
    .setOrigin(0.5)
    .setAlpha(0);

  // ================================================================================================================================== //
  // SÉQUENCE D'ANIMATIONS
  // ================================================================================================================================== //

  this.cameras.main.once("camerafadeincomplete", () => {
    // -------------------------------------------------------------------------------------------- //
    // Titre (Fade in + mouvement)
    this.tweens.add({
      targets: title,
      y: 170,
      alpha: 1,
      duration: 1500,
      ease: "Back.easeOut",
      onComplete: () => {
        this.tweens.add({
          targets: title,
          alpha: 0.8,
          duration: 2500,
          ease: "Sine.easeInOut",
          yoyo: true,
          repeat: -1,
        });

        this.tweens.add({
          targets: title.style,
          strokeThickness: 6,
          duration: 3000,
          ease: "Sine.easeInOut",
          yoyo: true,
          repeat: -1,
        });
      },
    });

    // -------------------------------------------------------------------------------------------- //
    // Emplacement personnage + boutton de séléction (Fade in)
    this.time.delayedCall(800, () => {
      this.tweens.add({
        targets: [characterDisplay, characterSprite, alexisButtonText, vefaButtonText],
        alpha: 1,
        duration: 600,
        ease: "Sine.easeOut",
      });
    });

    // -------------------------------------------------------------------------------------------- //
    // Boutton start (Fade in)
    this.time.delayedCall(1400, () => {
      this.tweens.add({
        targets: [startButton, startButtonText],
        alpha: 1,
        duration: 600,
        ease: "Sine.easeOut",
      });
    });
  });

  // ================================================================================================================================== //
  // INTERACTIONS ELEMENT SCENE
  // ================================================================================================================================== //

  // -------------------------------------------------------------------------------------------- //
  // Alexis boutton
  alexisButtonText.setInteractive({ useHandCursor: true });

  alexisButtonText.on("pointerover", () => {
    alexisButtonText.setStyle({
      fill: "#64FFDA",
      stroke: "#64FFDA",
    });
  });

  alexisButtonText.on("pointerout", () => {
    alexisButtonText.setStyle({
      fill: "#fff",
      stroke: "#fff",
    });
  });

  alexisButtonText.on("pointerdown", () => {
    this.sound.play("character-select", { volume: 0.1 });
    selectedCharacter = "Alexis";
    this.registry.set("selectedCharacter", selectedCharacter);

    if (characterSprite) {
      this.tweens.add({
        targets: characterSprite,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          characterSprite.destroy();
          characterSprite = this.add.image(200, 650, "alexis-sprite");
          characterSprite.setScale(0.5);
          characterSprite.setAlpha(0);
          this.tweens.add({
            targets: characterSprite,
            alpha: 1,
            duration: 50,
          });
        },
      });
    }
  });

  // -------------------------------------------------------------------------------------------- //
  // Vefa boutton
  vefaButtonText.setInteractive({ useHandCursor: true });

  vefaButtonText.on("pointerover", () => {
    vefaButtonText.setStyle({
      fill: "#64FFDA",
      stroke: "#64FFDA",
    });
  });

  vefaButtonText.on("pointerout", () => {
    vefaButtonText.setStyle({
      fill: "#fff",
      stroke: "#fff",
    });
  });

  vefaButtonText.on("pointerdown", () => {
    this.sound.play("character-select", { volume: 0.1 });
    selectedCharacter = "Vefa";
    this.registry.set("selectedCharacter", selectedCharacter);

    if (characterSprite) {
      this.tweens.add({
        targets: characterSprite,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          characterSprite.destroy();
          characterSprite = this.add.image(200, 650, "vefa-sprite");
          characterSprite.setScale(0.5);
          characterSprite.setAlpha(0);
          this.tweens.add({
            targets: characterSprite,
            alpha: 1,
            duration: 50,
          });
        },
      });
    }
  });

  // -------------------------------------------------------------------------------------------- //
  // Start boutton
  startButton.setInteractive({ useHandCursor: true });

  startButton.on("pointerover", () => {
    startButton.setFillStyle(0x2a5d5d);
    startButtonText.setStyle({ fill: "#64FFDA" });
  });

  startButton.on("pointerout", () => {
    startButton.setFillStyle(0x1a4d4d);
    startButtonText.setStyle({ fill: "#ffffff" });
  });

  startButton.on("pointerdown", () => {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.sound.stopAll();
    this.sound.play("start", { volume: 0.3 });

    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("Level1");
    });
  });
}
