function preloadLevel1() {
  // Images
  this.load.image("lvl1-background", "assets/images/level1/lvl1_background.png");
  this.load.image("npc-sprite", "assets/images/level1/Ardoise.png");
  this.load.image("alexis-game-sprite", "assets/images/characters/Alexis.png");
  this.load.image("vefa-game-sprite", "assets/images/characters/Vefa.png");
  this.load.image("poteau1", "assets/images/level1/poteau1.png");
  this.load.image("poteau2", "assets/images/level1/poteau2.png");
  this.load.image("poteau3", "assets/images/level1/poteau3.png");
  this.load.image("maison", "assets/images/level1/maison.png");
  this.load.image("sapin", "assets/images/level1/sapin.png");
  this.load.image("paper", "assets/images/level1/paper.png");

  this.load.spritesheet("alexis-spritesheet", "assets/images/characters/alexis-spritesheet.png", {
    frameWidth: 270,
    frameHeight: 600,
  });

  this.load.spritesheet("vefa-spritesheet", "assets/images/characters/vefa-spritesheet.png", {
    frameWidth: 270,
    frameHeight: 600,
  });

  this.load.spritesheet("campfire", "assets/images/title_screen/fire_spark.png", {
    frameWidth: 48,
    frameHeight: 48,
  });

  // Audio
  this.load.audio("footstep", "assets/sounds/step_walk/grass.mp3");
  this.load.audio("access_denied", "assets/sounds/level1/access_denied.mp3");
  this.load.audio("open", "assets/sounds/level1/open.wav");
  this.load.audio("access_granted", "assets/sounds/level1/access_granted.wav");
  this.load.audio("music_level", "assets/sounds/level1/music_level.wav");
}

function createLevel1() {
  this.cameras.main.fadeIn(1000, 0, 0, 0);
  this.add.image(512, 512, "lvl1-background");

  const selectedCharacter = this.registry.get("selectedCharacter") || "Vefa";
  this.player = createAnimatedPlayer(this, 430, 570, selectedCharacter);
  this.player.setScale(0.2);
  this.player.setOrigin(0.5, 1);

  this.sound.play("music_level", {
    loop: true,
    volume: 0.3,
  });

  // Respiration naturelle
  this.tweens.add({
    targets: this.player,
    scaleY: 0.205,
    duration: 1000,
    ease: "Sine.easeInOut",
    yoyo: true,
    repeat: -1,
  });

  // ------------------------------------------------------------ //
  // Déplacement - STOCKER DANS THIS
  createPlayerMovement(this, this.player, 135);
  createPlayerDialogue(this);

  // ------------------------------------------------------------ //
  // COLIDERS DU NIVEAU
  // ------------------------------------------------------------ //

  // npc
  this.npc = createObstacle(this, 680, 690, "npc-sprite", {
    scale: 0.13,
    size: { width: 750, height: 500 },
    offset: { x: 200, y: 500 },
  });

  // poteau 1
  this.poteau1 = createObstacle(this, 830, 710, "poteau1", {
    scale: 1.1,
    size: { width: 15, height: 20 },
    offset: { x: 15, y: 100 },
  });

  // poteau 2
  this.poteau2 = createObstacle(this, 490, 480, "poteau2", {
    scale: 1.1,
    size: { width: 15, height: 20 },
    offset: { x: 10, y: 100 },
  });

  // poteau 3
  this.poteau3 = createObstacle(this, 245, 580, "poteau3", {
    scale: 1,
    size: { width: 80, height: 30 },
    offset: { x: 10, y: 100 },
  });

  // sapin 1
  this.sapin1 = createObstacle(this, 60, 700, "sapin", {
    scale: 1.2,
    size: { width: 50, height: 30 },
    offset: { x: 50, y: 250 },
  });

  // sapin 2
  this.sapin2 = createObstacle(this, 900, 850, "sapin", {
    scale: 0.8,
    size: { width: 50, height: 30 },
    offset: { x: 50, y: 250 },
  });

  // sapin 3
  this.sapin3 = createObstacle(this, 90, 400, "sapin", {
    scale: 0.9,
    size: { width: 50, height: 30 },
    offset: { x: 50, y: 250 },
  });

  // sapin 4
  this.sapin4 = createObstacle(this, 990, 730, "sapin", {
    scale: 1.2,
    size: { width: 50, height: 30 },
    offset: { x: 50, y: 250 },
  });

  // sapin 5
  this.sapin5 = createObstacle(this, 250, 850, "sapin", {
    scale: 1,
    size: { width: 50, height: 30 },
    offset: { x: 50, y: 250 },
  });

  // maison
  this.maison = createObstacle(this, 839, 484, "maison", {
    scale: 1,
    size: { width: 180, height: 70 },
    offset: { x: 20, y: 130 },
  });

  // ------------------------------------------------------------ //
  // MUR INVISIBLE
  // ------------------------------------------------------------ //

  // mur feu de camp
  this.roundRock = createRoundInvisibleWall(this, 550, 635, 55);

  // mur bas
  this.wallBottom = createInvisibleWall(this, 512, 1000, 1024, 200);

  // mur haut
  this.wallTop = createInvisibleWall(this, 512, 150, 1024, 350);

  // mur gauche
  this.wallLeft = createInvisibleWall(this, 20, 512, 40, 1024);

  // mur droit
  this.wallRight = createInvisibleWall(this, 1000, 512, 40, 1024);

  // ------------------------------------------------------------ //
  // SPRITESHEET FEU DE CAMP
  // ------------------------------------------------------------ //

  this.anims.create({
    key: "campfire",
    frames: this.anims.generateFrameNumbers("campfire", { start: 0, end: 7 }),
    frameRate: 7,
    repeat: -1,
  });

  this.campfire = this.add.sprite(547, 595, "campfire");
  this.campfire.setScale(4);
  this.campfire.setDepth(this.campfire.y);
  this.campfire.play("campfire");

  // Bulle d'interaction - STOCKER DANS THIS
  this.interactionBubble = this.add.text(this.npc.x, this.npc.y).setOrigin(0.5).setVisible(false);

  // Variables - STOCKER DANS THIS
  this.interactionDistance = 80;
  this.nearNPC = false;

  createNPCDialogue(this);

  // Texte du dialogue
  if (selectedCharacter === "Alexis") {
    this.npcDialogue = `Salut Alexis !\nSi tu veux sauver Vefa`;
  } else {
    this.npcDialogue = `Nozvezh vat Vefa !\nSi tu veux sauver Alexis`;
  }

  // ------------------------------------------------------------ //
  // PAPIER AVEC LE CODE
  // ------------------------------------------------------------ //

  // Position du papier (ajustez selon votre map)
  this.paper = this.add.image(200, 850, "paper");
  this.paper.setScale(0.8);

  // Bulle d'information pour le papier
  this.paperBubble = this.add
    .text(this.paper.x, this.paper.y - 80, GameConfig.WEDDING_DATE, {
      fontSize: "24px",
      fill: "#64FFDA",
      align: "center",
      backgroundColor: "#1a1a2e",
      padding: { x: 15, y: 10 },
      stroke: "#64FFDA",
      strokeThickness: 2,
    })
    .setOrigin(0.5)
    .setDepth(999)
    .setVisible(false);

  // Variables pour le papier
  this.nearPaper = false;
  this.paperFound = false;

  // ------------------------------------------------------------ //
  // NOUVEAU : ASCENSEUR
  // ------------------------------------------------------------ //

  // Position de l'ascenseur (ajustez selon votre map)
  this.elevator = createInvisibleWall(this, 210, 300, 80, 50);

  // Bulle d'interaction pour l'ascenseur
  this.elevatorBubble = this.add
    .text(this.elevator.x, this.elevator.y - 100, "🔐", {
      fontSize: "32px",
    })
    .setOrigin(0.5)
    .setVisible(false);

  // Variables pour l'ascenseur
  this.nearElevator = false;
  this.elevatorUIVisible = false;

  // ------------------------------------------------------------ //
  // INTERFACE DE L'ASCENSEUR
  // ------------------------------------------------------------ //

  // Fond de l'interface
  this.elevatorUI = this.add.rectangle(512, 512, 400, 300, 0x1a1a2e, 0.95);
  this.elevatorUI.setStrokeStyle(4, 0x64ffda);
  this.elevatorUI.setVisible(false);
  this.elevatorUI.setDepth(1000);

  // Titre
  this.elevatorTitle = this.add
    .text(512, 420, "CODE DE L'ASCENSEUR", {
      fontSize: "24px",
      fill: "#64FFDA",
      fontWeight: "bold",
    })
    .setOrigin(0.5)
    .setVisible(false)
    .setDepth(1001);

  // Input visuel
  this.codeInputBG = this.add.rectangle(512, 480, 250, 50, 0x2d4a22);
  this.codeInputBG.setStrokeStyle(2, 0x64ffda);
  this.codeInputBG.setVisible(false);
  this.codeInputBG.setDepth(1001);

  this.codeInputText = this.add
    .text(512, 480, "", {
      fontSize: "20px",
      fill: "#ffffff",
      backgroundColor: "#2d4a22",
      padding: { x: 10, y: 8 },
    })
    .setOrigin(0.5)
    .setVisible(false)
    .setDepth(1002);

  // Placeholder
  this.inputPlaceholder = this.add
    .text(512, 480, "Entrez le code...", {
      fontSize: "18px",
      fill: "#888888",
    })
    .setOrigin(0.5)
    .setVisible(false)
    .setDepth(1002);

  // Bouton valider
  this.validateButton = this.add.rectangle(512, 550, 150, 40, 0x64ffda);
  this.validateButton.setStrokeStyle(2, 0x64ffda);
  this.validateButton.setVisible(false);
  this.validateButton.setInteractive({ useHandCursor: true });
  this.validateButton.setDepth(1001);

  this.validateButtonText = this.add
    .text(512, 550, "VALIDER", {
      fontSize: "16px",
      fill: "#1a1a2e",
      fontWeight: "bold",
    })
    .setOrigin(0.5)
    .setVisible(false)
    .setDepth(1002);

  // Bouton fermer
  this.closeButton = this.add.rectangle(512, 600, 100, 30, 0x1a1a2e);
  this.closeButton.setStrokeStyle(2, 0x666666);
  this.closeButton.setVisible(false);
  this.closeButton.setInteractive({ useHandCursor: true });
  this.closeButton.setDepth(1001);

  this.closeButtonText = this.add
    .text(512, 600, "FERMER", {
      fontSize: "14px",
      fill: "#ffffff",
    })
    .setOrigin(0.5)
    .setVisible(false)
    .setDepth(1002);

  // Message d'erreur
  this.errorMessage = this.add
    .text(512, 380, "", {
      fontSize: "16px",
      fill: "#ff6b6b",
      fontWeight: "bold",
    })
    .setOrigin(0.5)
    .setVisible(false)
    .setDepth(1002);

  // Variables pour la saisie du code
  this.currentCode = "";
  this.maxCodeLength = 8;

  // ------------------------------------------------------------ //
  // MÉTHODES DE L'ASCENSEUR (attachées à this)
  // ------------------------------------------------------------ //

  this.showElevatorUI = function () {
    this.elevatorUIVisible = true;

    // Forcer l'arrêt du mouvement en réinitialisant les états des touches
    stopPlayer(this);

    this.sound.play("open", {
      volume: 0.3,
    });

    this.elevatorElements = [
      this.elevatorUI,
      this.elevatorTitle,
      this.codeInputBG,
      this.codeInputText,
      this.inputPlaceholder,
      this.validateButton,
      this.validateButtonText,
      this.closeButton,
      this.closeButtonText,
      this.errorMessage,
    ];

    // Afficher tous les éléments de l'UI
    this.elevatorElements.forEach((el) => el.setVisible(true));

    // Cacher la bulle d'interaction
    this.elevatorBubble.setVisible(false);

    // Reset du code
    this.currentCode = "";
    this.updateCodeDisplay();
    this.errorMessage.setVisible(false);
  };

  this.hideElevatorUI = function () {
    this.elevatorUIVisible = false;

    this.elevatorElements.forEach((el) => el.setVisible(false));

    // Reset du code quand on ferme
    this.currentCode = "";

    // Remettre le joueur en animation idle dans la dernière direction
    if (this.player.anims) {
      const idleDirection = this.lastDirection || "down";
      this.player.anims.play(`idle-${idleDirection}`, true);
    }
  };

  this.updateCodeDisplay = function () {
    if (this.currentCode.length > 0) {
      this.codeInputText.setText(this.currentCode);
      this.codeInputText.setVisible(true);
      this.inputPlaceholder.setVisible(false);
    } else {
      this.codeInputText.setText("");
      this.codeInputText.setVisible(false);
      this.inputPlaceholder.setVisible(true);
    }
  };

  this.validateCode = function () {
    // Effacer le message d'erreur précédent
    this.errorMessage.setVisible(false);

    if (this.currentCode === GameConfig.WEDDING_DATE) {
      // Code correct !
      this.hideElevatorUI();

      // Animation de transition
      this.cameras.main.fadeOut(1000, 0, 0, 0);

      // Message de succès avant la transition

      this.sound.play("access_granted", {
        volume: 0.3,
      });

      // Transition vers le niveau 2 après le fade
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("Level2"); // Vous devrez créer Level2
      });
    } else {
      // Code incorrect
      this.errorMessage.setText("Code incorrect !");
      this.errorMessage.setVisible(true);

      this.sound.play("access_denied", {
        volume: 0.3,
      });

      // Faire clignoter l'input en rouge
      this.tweens.add({
        targets: this.codeInputBG,
        alpha: 0.3,
        duration: 150,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          this.codeInputBG.setAlpha(1);
        },
      });

      // Effacer le code après 2 secondes
      this.time.delayedCall(2000, () => {
        this.currentCode = "";
        this.updateCodeDisplay();
        this.errorMessage.setVisible(false);
      });
    }
  };

  // ------------------------------------------------------------ //
  // GESTION DU CLAVIER POUR L'INPUT
  // ------------------------------------------------------------ //

  this.input.keyboard.on("keydown", (event) => {
    if (this.elevatorUIVisible) {
      event.preventDefault();

      if (event.key === "Backspace") {
        this.currentCode = this.currentCode.slice(0, -1);
        this.updateCodeDisplay();
      } else if (event.key === "Enter") {
        this.validateCode();
      } else if (event.key.length === 1 && this.currentCode.length < this.maxCodeLength) {
        if (/[a-zA-Z0-9\.\-\/]/.test(event.key)) {
          this.currentCode += event.key;
          this.updateCodeDisplay();
        }
      }
    }
  });

  // ------------------------------------------------------------ //
  // EVENTS DES BOUTONS
  // ------------------------------------------------------------ //

  this.validateButton.on("pointerdown", () => {
    this.validateCode();
  });

  this.validateButton.on("pointerover", () => {
    this.validateButton.setFillStyle(0x7cffea);
    this.validateButtonText.setColor("#1a1a2e");
  });

  this.validateButton.on("pointerout", () => {
    this.validateButton.setFillStyle(0x64ffda);
    this.validateButtonText.setColor("#1a1a2e");
  });

  this.closeButton.on("pointerdown", () => {
    this.hideElevatorUI();
  });

  this.closeButton.on("pointerover", () => {
    this.closeButton.setFillStyle(0x555555);
    this.closeButtonText.setColor("#ffffff");
  });

  this.closeButton.on("pointerout", () => {
    this.closeButton.setFillStyle(0x444444);
    this.closeButtonText.setColor("#ffffff");
  });

  // ------------------------------------------------------------ //
  // PLAYER
  this.physics.add.existing(this.player);
  this.player.body.setSize(250, 75);
  this.player.body.setOffset(0, 500);
}

function updateLevel1() {
  if (!this.elevatorUIVisible) {
    updatePlayerMovement(this);
  }

  // ------------------------------------------------------------ //
  // GESTION NPC (existant)
  // ------------------------------------------------------------ //
  checkProximity(
    this,
    this.npc,
    "nearNPC",
    this.interactionDistance,
    () => {
      this.interactionBubble.setVisible(true);
      showNPCDialogue(this, this.npcDialogue, "npc-sprite", "Ardoise");
    },
    () => {
      this.interactionBubble.setVisible(false);
      hideNPCDialogue(this);
    }
  );

  // ------------------------------------------------------------ //
  // NOUVEAU : GESTION DU PAPIER
  // ------------------------------------------------------------ //
  // Papier
  checkProximity(
    this,
    this.paper,
    "nearPaper",
    this.interactionDistance,
    () => {
      this.paperBubble.setVisible(true);
    },
    () => {
      this.paperBubble.setVisible(false);
    }
  );

  // ------------------------------------------------------------ //
  // NOUVEAU : GESTION DE L'ASCENSEUR
  // ------------------------------------------------------------ //
  // Ascenseur
  checkProximity(
    this,
    this.elevator,
    "nearElevator",
    this.interactionDistance,
    () => {
      if (!this.elevatorUIVisible) {
        this.elevatorBubble.setVisible(true);
        this.showElevatorUI(); // Bouton valider
        checkButtonHover(
          this,
          this.validateButton,
          "hoveringValidateButton",
          () => this.validateButton.setFillStyle(0x64ffda),
          () => this.validateButton.setFillStyle(0x1a1a2e)
        );

        // Bouton fermer
        checkButtonHover(
          this,
          this.closeButton,
          "hoveringCloseButton",
          () => this.closeButton.setFillStyle(0x64ffda),
          () => this.closeButton.setFillStyle(0x1a1a2e)
        );
      }
    },
    () => {
      this.elevatorBubble.setVisible(false);
      if (this.elevatorUIVisible) {
        this.hideElevatorUI();
      }
    }
  );

  // Bouton valider
  checkButtonHover(
    this,
    this.validateButton,
    "hoveringValidateButton",
    () => this.validateButton.setFillStyle(0x85ffe4),
    () => this.validateButton.setFillStyle(0x64ffda)
  );

  // Bouton fermer
  checkButtonHover(
    this,
    this.closeButton,
    "hoveringCloseButton",
    () => this.closeButton.setFillStyle(0x2b2b44),
    () => this.closeButton.setFillStyle(0x1a1a2e)
  );

  this.dynamicDepthObjects = [
    this.player,
    this.npc,
    this.poteau1,
    this.poteau2,
    this.poteau3,
    this.sapin1,
    this.sapin2,
    this.sapin3,
    this.sapin4,
    this.sapin5,
    this.maison,
  ];

  this.dynamicDepthObjects.forEach((obj) => {
    obj.setDepth(obj.y);
  });
}
