function preloadTitleScreen() {
  // Images
  this.load.image("title-background", "assets/images/title_screen/title_background.png");
  this.load.image("alexis-sprite", "assets/images/title_screen/start_alexis.png");
  this.load.image("vefa-sprite", "assets/images/title_screen/start_vefa.png");
  this.load.image("cosmonaute", "assets/images/title_screen/cosmonaute.png");
  this.load.image("lanterne", "assets/images/title_screen/lanterne.png");
  this.load.spritesheet("fire_spark", "assets/images/title_screen/fire_spark.png", {
    frameWidth: 48, // ou la bonne largeur exacte d'une frame
    frameHeight: 48, // idem pour la hauteur
  });

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
    .text(512, 120, "Stelar Wedding", {
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

  // -------------------------------------------------------------------------------------------- //
  // Emplacement personnage
  characterDisplay = this.add
    .text(512, 400, "Choisissez un personnage", {
      fontSize: "18px",
      fill: "#cccccc",
    })
    .setOrigin(0.5)
    .setAlpha(0);

  // Alexis à droite du feu
  const alexisSprite = this.add.image(800, 650, "alexis-sprite");
  alexisSprite.setScale(0.49);
  alexisSprite.setAlpha(0);
  alexisSprite.setInteractive({ useHandCursor: true });

  // Vefa à gauche du feu
  const vefaSprite = this.add.image(250, 670, "vefa-sprite");
  vefaSprite.setScale(-0.5, 0.5);
  vefaSprite.setAlpha(0);
  vefaSprite.setInteractive({ useHandCursor: true });

  // Variable pour tracker la sélection
  selectedCharacter = "Vefa";
  this.registry.set("selectedCharacter", selectedCharacter);

  // Texte du nom du personnage sélectionné (invisible au début)
  const characterNameText = this.add
    .text(0, 0, "", {
      fontSize: "20px",
      fill: "#64FFDA",
      fontFamily: "Space Mono",
      fontWeight: "bold",
    })
    .setOrigin(0.5)
    .setAlpha(0);

  // Fonction pour mettre à jour l'effet de sélection
  // Fonction pour mettre à jour l'effet de sélection
  function updateCharacterSelection(selectedChar, alexisSprite, vefaSprite, nameText) {
    if (selectedChar === "Alexis") {
      // Alexis sélectionné : lumineux
      alexisSprite.setTint(0xffffff);
      alexisSprite.setAlpha(1);

      // Vefa non sélectionné : plus sombre
      vefaSprite.setTint(0x888888);
      vefaSprite.setAlpha(0.7);

      // Afficher le nom au-dessus d'Alexis
      nameText.setText("Alexis");
      nameText.setPosition(alexisSprite.x, 400);
      nameText.setAlpha(1);
    } else {
      // Vefa sélectionné : lumineux
      vefaSprite.setTint(0xffffff);
      vefaSprite.setAlpha(1);

      // Alexis non sélectionné : plus sombre
      alexisSprite.setTint(0x888888);
      alexisSprite.setAlpha(0.7);

      // Afficher le nom au-dessus de Vefa
      nameText.setText("Vefa");
      nameText.setPosition(vefaSprite.x, 400);
      nameText.setAlpha(1);
    }
  }

  alexisSprite.on("pointerdown", () => {
    this.sound.play("character-select", { volume: 0.1 });
    selectedCharacter = "Alexis";
    this.registry.set("selectedCharacter", selectedCharacter);
    updateCharacterSelection(selectedCharacter, alexisSprite, vefaSprite, characterNameText);
  });

  vefaSprite.on("pointerdown", () => {
    this.sound.play("character-select", { volume: 0.1 });
    selectedCharacter = "Vefa";
    this.registry.set("selectedCharacter", selectedCharacter);
    updateCharacterSelection(selectedCharacter, alexisSprite, vefaSprite, characterNameText);
  });

  // -------------------------------------------------------------------------------------------- //
  // Start boutton
  const startButton = this.add.rectangle(512, 950, 200, 60, 0x1a4d4d).setAlpha(0);
  startButton.setStrokeStyle(2, 0x64ffda);
  startButton.setDepth(1);

  const startButtonText = this.add
    .text(512, 950, "Start", {
      fontFamily: "Space Mono",
      fontSize: "24px",
      fill: "#ffffff",
    })
    .setOrigin(0.5)
    .setAlpha(0)
    .setDepth(1);

  // -------------------------------------------------------------------------------------------- //
  // Armure cosmonaute
  this.cosmonaute = this.add.image(690, 850, "cosmonaute");

  // -------------------------------------------------------------------------------------------- //
  // Lanterne
  this.lanterne = this.add.image(875, 850, "lanterne");

  // -------------------------------------------------------------------------------------------- //
  // Sparkle
  this.anims.create({
    key: "fire_spark",
    frames: this.anims.generateFrameNumbers("fire_spark", { start: 0, end: 7 }),
    frameRate: 7,
    repeat: -1,
  });

  this.spark = this.add.sprite(510, 720, "fire_spark");
  this.spark.setScale(6);
  this.spark.play("fire_spark");

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
    // Texte de sélection (Fade in)
    this.time.delayedCall(800, () => {
      this.tweens.add({
        targets: characterDisplay,
        alpha: 1,
        duration: 600,
        ease: "Sine.easeOut",
      });
    });

    // -------------------------------------------------------------------------------------------- //
    // Sprites des personnages (Fade in avec un léger délai entre eux)
    this.time.delayedCall(1200, () => {
      // Vefa apparaît en premier (sélectionné par défaut)
      vefaSprite.setTint(0xffffff);
      this.tweens.add({
        targets: vefaSprite,
        alpha: 1,
        duration: 400,
        ease: "Sine.easeOut",
        onComplete: () => {
          // Afficher le nom de Vefa dès qu'elle est visible
          characterNameText.setText("Vefa");
          characterNameText.setPosition(vefaSprite.x, 400);
          characterNameText.setAlpha(1);
        },
      });

      // Alexis apparaît 200ms après (non sélectionné)
      this.time.delayedCall(200, () => {
        alexisSprite.setTint(0x888888);
        this.tweens.add({
          targets: alexisSprite,
          alpha: 0.7,
          duration: 400,
          ease: "Sine.easeOut",
        });
      });
    });

    // -------------------------------------------------------------------------------------------- //
    // Bouton start (Fade in)
    this.time.delayedCall(1800, () => {
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
