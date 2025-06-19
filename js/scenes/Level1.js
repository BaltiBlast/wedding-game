class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }

  // ------------------------------------------------------------------------------------------ //
  // PRELOAD SCENE'S ASSETS
  // ------------------------------------------------------------------------------------------ //
  preload() {
    // Keyboard guide assets
    KeyboardGuide.preloadKeyboardGuide(this);

    // Images
    this.load.image("bg_level1", "assets/images/level1/bg_level1.png");
    this.load.image("npc_ardoise", "assets/images/level1/npc_ardoise.png");
    this.load.image("char_alexis_game", "assets/images/characters/char_alexis_game.png");
    this.load.image("char_vefa_game", "assets/images/characters/char_vefa_game.png");
    this.load.image("prop_pole1", "assets/images/level1/prop_pole1.png");
    this.load.image("prop_pole2", "assets/images/level1/prop_pole2.png");
    this.load.image("prop_pole3", "assets/images/level1/prop_pole3.png");
    this.load.image("prop_house", "assets/images/level1/prop_house.png");
    this.load.image("prop_tree", "assets/images/level1/prop_tree.png");
    this.load.image("item_paper", "assets/images/level1/item_paper.png");

    // Spritesheets
    this.load.spritesheet("char_alexis_spritesheet", "assets/images/characters/char_alexis_spritesheet.png", {
      frameWidth: 270,
      frameHeight: 600,
    });

    this.load.spritesheet("char_vefa_spritesheet", "assets/images/characters/char_vefa_spritesheet.png", {
      frameWidth: 270,
      frameHeight: 600,
    });

    this.load.spritesheet("fx_campfire", "assets/images/title_screen/fx_fire_animation.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    // Audio
    this.load.audio("sfx_footstep_grass", "assets/sounds/step_walk/sfx_footstep_grass.mp3");
    this.load.audio("sfx_access_denied", "assets/sounds/level1/sfx_access_denied.mp3");
    this.load.audio("sfx_open", "assets/sounds/level1/sfx_open.wav");
    this.load.audio("sfx_access_granted", "assets/sounds/level1/sfx_access_granted.wav");
    this.load.audio("mus_level1_theme", "assets/sounds/level1/mus_level1_theme.mp3");
    this.load.audio("sfx_paper", "assets/sounds/level1/sfx_paper.wav");
  }

  // ------------------------------------------------------------------------------------------ //
  // CREATE SCENE'S ELEMENTS
  // ------------------------------------------------------------------------------------------ //
  create() {
    // Scene transition
    this.setupTransition();

    // Show stage banner
    StageBanner.showStageBanner(this, "Atrebois", 1000);

    // Background
    this.add.image(512, 512, "bg_level1");

    // Display keyboard guide
    KeyboardGuide.createKeyboardGuideAnimations(this);
    KeyboardGuide.displayKeyboardGuide(this, 512, 900, 3.5);

    // Audio setup
    AudioManager.setBackgroundMusic(this, "mus_level1_theme", 0.1, true, 2500);

    // Show quets summary
    const quests = [
      "🕹️ - Utilise les flèches directionnelles pour te déplacer.",
      "👀 - Approche-toi du feu de camp pour parler à l'extraterrestre Ardoise.",
    ];

    this.time.delayedCall(5000, () => {
      QuestSummary.showQuestsSummary(this, quests);
    });

    // Player setup
    this.createPlayer();

    // Level obstacles
    this.createObstacles();

    // Invisible walls
    this.createInvisibleWalls();

    // Decorative elements
    this.createDecorativeElements();

    // Interactive elements
    this.createInteractiveElements();

    // Elevator UI
    this.createElevatorUI();
  }

  // ------------------------------------------------------------------------------------------ //
  // UPDATE LOOP
  // ------------------------------------------------------------------------------------------ //
  update() {
    if (!this.elevatorUIVisible) {
      PlayerManager.updatePlayerMovement(this);
    }

    this.updateInteractions();
    this.updateDynamicDepth();
  }

  // ------------------------------------------------------------------------------------------ //
  // INTERACTIONS UPDATE
  // ------------------------------------------------------------------------------------------ //
  updateInteractions() {
    if (this.elevatorUIVisible) return; // Skip interactions when UI is open

    // NPC interaction
    checkProximity(
      this,
      this.npc,
      "nearNPC",
      this.interactionDistance,
      () => {
        this.interactionBubble.setVisible(true);
        DialogueManager.showNPCDialogue(this, this.npcDialogue, "npc_ardoise", "Ardoise");
      },
      () => {
        this.interactionBubble.setVisible(false);
        DialogueManager.hideNPCDialogue(this);
      }
    );

    // Paper interaction
    checkProximity(this, this.paper, "nearPaper", this.interactionDistance, () => {
      this.paperBubble.setVisible(true);

      if (!this.hasPlayedPaperSound) {
        AudioManager.playSoundEffects(this, "sfx_paper", 0.15);
        this.hasPlayedPaperSound = true;
      }
    });

    // Elevator interaction
    checkProximity(
      this,
      this.elevator,
      "nearElevator",
      this.interactionDistance,
      () => {
        if (!this.elevatorUIVisible) {
          this.elevatorBubble.setVisible(true);
          this.showElevatorUI();
        }
      },
      () => {
        this.elevatorBubble.setVisible(false);
        if (this.elevatorUIVisible) {
          this.hideElevatorUI();
        }
      }
    );

    // Button hover effects
    this.updateButtonHovers();
  }

  updateButtonHovers() {
    if (!this.elevatorUIVisible) return;

    // Validate button hover
    checkButtonHover(
      this,
      this.validateButton,
      "hoveringValidateButton",
      () => this.validateButton.setFillStyle(0x85ffe4),
      () => this.validateButton.setFillStyle(0x64ffda)
    );

    // Close button hover
    checkButtonHover(
      this,
      this.closeButton,
      "hoveringCloseButton",
      () => this.closeButton.setFillStyle(0x2b2b44),
      () => this.closeButton.setFillStyle(0x1a1a2e)
    );
  }

  // ------------------------------------------------------------------------------------------ //
  // DYNAMIC DEPTH MANAGEMENT
  // ------------------------------------------------------------------------------------------ //
  updateDynamicDepth() {
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
      if (obj) {
        obj.setDepth(obj.y);
      }
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // SCENE TRANSITION SETUP
  // ------------------------------------------------------------------------------------------ //
  setupTransition() {
    SceneManager.fadeInScene(this);
  }

  // ------------------------------------------------------------------------------------------ //
  // PLAYER SETUP
  // ------------------------------------------------------------------------------------------ //
  createPlayer() {
    const selectedCharacter = this.registry.get("selectedCharacter") || "Vefa";
    this.player = PlayerManager.setupCompletePlayer(this, 430, 570, selectedCharacter, 135, "sfx_footstep_grass");
  }

  // ------------------------------------------------------------------------------------------ //
  // OBSTACLES SETUP
  // ------------------------------------------------------------------------------------------ //
  createObstacles() {
    // NPC
    this.npc = ObstacleManager.createNPC(this, 680, 690, "npc_ardoise", {
      scale: 0.13,
      size: { width: 750, height: 500 },
      offset: { x: 200, y: 500 },
    });

    // Poles
    this.poteau1 = ObstacleManager.createPole(this, 830, 710, "prop_pole1", 1.1, 15, 20);
    this.poteau2 = ObstacleManager.createPole(this, 490, 480, "prop_pole2", 1.1, 15, 20);
    this.poteau3 = ObstacleManager.createPole(this, 245, 580, "prop_pole3", 1, 80, 30);

    // Trees
    this.sapin1 = ObstacleManager.createTree(this, 60, 700, "prop_tree", 1.2);
    this.sapin2 = ObstacleManager.createTree(this, 900, 850, "prop_tree", 0.8);
    this.sapin3 = ObstacleManager.createTree(this, 90, 400, "prop_tree", 0.9);
    this.sapin4 = ObstacleManager.createTree(this, 990, 730, "prop_tree", 1.2);
    this.sapin5 = ObstacleManager.createTree(this, 250, 850, "prop_tree", 1);

    // House
    this.maison = ObstacleManager.createHouse(this, 839, 484, "prop_house");
  }

  // ------------------------------------------------------------------------------------------ //
  // INVISIBLE WALLS SETUP
  // ------------------------------------------------------------------------------------------ //
  createInvisibleWalls() {
    // Level boundaries
    this.wallBottom = ObstacleManager.createInvisibleWall(this, 512, 1000, 1024, 200);
    this.wallTop = ObstacleManager.createInvisibleWall(this, 512, 150, 1024, 350);
    this.wallLeft = ObstacleManager.createInvisibleWall(this, 20, 512, 40, 1024);
    this.wallRight = ObstacleManager.createInvisibleWall(this, 1000, 512, 40, 1024);

    // Special walls
    this.roundRock = ObstacleManager.createRoundInvisibleWall(this, 550, 635, 55);
  }

  // ------------------------------------------------------------------------------------------ //
  // DECORATIVE ELEMENTS SETUP
  // ------------------------------------------------------------------------------------------ //
  createDecorativeElements() {
    // Campfire animation
    this.anims.create({
      key: "fx_campfire",
      frames: this.anims.generateFrameNumbers("fx_campfire", { start: 0, end: 7 }),
      frameRate: 7,
      repeat: -1,
    });

    this.campfire = this.add.sprite(547, 595, "fx_campfire");
    this.campfire.setScale(4);
    this.campfire.setDepth(this.campfire.y);
    this.campfire.play("fx_campfire");
  }

  // ------------------------------------------------------------------------------------------ //
  // INTERACTIVE ELEMENTS SETUP
  // ------------------------------------------------------------------------------------------ //
  createInteractiveElements() {
    // NPC dialogue setup
    this.interactionBubble = this.add.text(this.npc.x, this.npc.y).setOrigin(0.5).setVisible(false);
    this.interactionDistance = 80;
    this.nearNPC = false;

    // Paper with code
    this.paper = this.add.image(200, 850, "item_paper");
    this.paper.setScale(0.8);

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

    this.nearPaper = false;
    this.paperFound = false;

    // Elevator
    this.elevator = ObstacleManager.createInvisibleWall(this, 210, 300, 80, 50);

    this.elevatorBubble = this.add
      .text(this.elevator.x, this.elevator.y - 100, "🔐", {
        fontSize: "32px",
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.nearElevator = false;
    this.elevatorUIVisible = false;

    // Setup dialogue
    DialogueManager.createNPCDialogue(this);
    this.npcDialogue = `dAh, te voilà ! C’est terrible, ta moitié s’est perdue dans l’espace !
L’ascenseur pour rejoindre le vaisseau est juste là-haut… mais il est verrouillé.
Il faut entrer la date du mariage. Évidemment, j’ai oublié…  
Je l’avais notée sur un petit papier… que j’ai perdu.
Si tu le retrouves, tu pourras décoller. En attendant, explore Atrebois.
Avec un peu de chance, il traîne dans le coin...`;
  }

  // ------------------------------------------------------------------------------------------ //
  // ELEVATOR UI SETUP
  // ------------------------------------------------------------------------------------------ //
  createElevatorUI() {
    // Background
    this.elevatorUI = this.add.rectangle(512, 512, 400, 300, 0x1a1a2e, 0.95);
    this.elevatorUI.setStrokeStyle(4, 0x64ffda);
    this.elevatorUI.setVisible(false);
    this.elevatorUI.setDepth(1000);

    // Title
    this.elevatorTitle = this.add
      .text(512, 420, "CODE DE L'ASCENSEUR", {
        fontSize: "24px",
        fill: "#64FFDA",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(1001);

    // Input field
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

    // Validate button
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

    // Close button
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

    // Error message
    this.errorMessage = this.add
      .text(512, 380, "", {
        fontSize: "16px",
        fill: "#ff6b6b",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(1002);

    // Variables
    this.currentCode = "";
    this.maxCodeLength = 8;

    // Setup interactions
    this.setupElevatorInteractions();
  }

  // ------------------------------------------------------------------------------------------ //
  // ELEVATOR INTERACTIONS SETUP
  // ------------------------------------------------------------------------------------------ //
  setupElevatorInteractions() {
    // Button events
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

    // Keyboard input
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
  }

  // ------------------------------------------------------------------------------------------ //
  // ELEVATOR UI MANAGEMENT
  // ------------------------------------------------------------------------------------------ //
  showElevatorUI() {
    this.elevatorUIVisible = true;

    // Stop player movement
    PlayerManager.stopPlayer(this);
    AudioManager.playSoundEffects(this, "sfx_open", 0.3);

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

    // Show all elements
    this.elevatorElements.forEach((el) => el.setVisible(true));

    // Hide interaction bubble
    this.elevatorBubble.setVisible(false);

    // Reset code
    this.currentCode = "";
    this.updateCodeDisplay();
    this.errorMessage.setVisible(false);
  }

  hideElevatorUI() {
    this.elevatorUIVisible = false;

    this.elevatorElements.forEach((el) => el.setVisible(false));

    // Reset code
    this.currentCode = "";

    // Reset player idle animation
    if (this.player.anims) {
      const idleDirection = this.lastDirection || "down";
      this.player.anims.play(`idle-${idleDirection}`, true);
    }
  }

  updateCodeDisplay() {
    if (this.currentCode.length > 0) {
      this.codeInputText.setText(this.currentCode);
      this.codeInputText.setVisible(true);
      this.inputPlaceholder.setVisible(false);
    } else {
      this.codeInputText.setText("");
      this.codeInputText.setVisible(false);
      this.inputPlaceholder.setVisible(true);
    }
  }

  validateCode() {
    // Clear previous error
    this.errorMessage.setVisible(false);

    if (this.currentCode === GameConfig.WEDDING_DATE) {
      // Correct code
      this.hideElevatorUI();
      AudioManager.playSoundEffects(this, "sfx_access_granted", 0.3);
      AudioManager.stopBackgroundMusic(this, "mus_level1_theme", 2500);

      // Scene transition
      SceneManager.changeSceneWithFade(this, "Elevator", 2600);
    } else {
      // Incorrect code
      this.errorMessage.setText("Code incorrect !");
      this.errorMessage.setVisible(true);

      AudioManager.playSoundEffects(this, "sfx_access_denied", 0.3);

      // Flash input red
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

      this.currentCode = "";
      this.updateCodeDisplay();
      this.errorMessage.setVisible(false);
    }
  }
}
