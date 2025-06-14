class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }

  // ------------------------------------------------------------------------------------------ //
  // PRELOAD SCENE'S ASSETS
  // ------------------------------------------------------------------------------------------ //
  preload() {
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
  }

  // ------------------------------------------------------------------------------------------ //
  // CREATE SCENE'S ELEMENTS
  // ------------------------------------------------------------------------------------------ //
  create() {
    // Scene transition
    this.setupTransition();

    // Background
    this.add.image(512, 512, "bg_level1");

    // Audio setup
    this.setupAudio();

    // Player setup
    this.createPlayer();
  }

  // ------------------------------------------------------------------------------------------ //
  // SCENE TRANSITION SETUP
  // ------------------------------------------------------------------------------------------ //
  setupTransition() {
    SceneManager.fadeInScene(this);
  }

  // ------------------------------------------------------------------------------------------ //
  // AUDIO SETUP
  // ------------------------------------------------------------------------------------------ //
  setupAudio() {
    this.musicLevel = AudioManager.playMusic(this, "mus_level1_theme", 0.1);
  }

  // ------------------------------------------------------------------------------------------ //
  // PLAYER SETUP
  // ------------------------------------------------------------------------------------------ //
  createPlayer() {
    const selectedCharacter = this.registry.get("selectedCharacter") || "Vefa";
    this.player = PlayerManager.setupCompletePlayer(this, 430, 570, selectedCharacter, 135);
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
    createNPCDialogue(this);
    const selectedCharacter = this.registry.get("selectedCharacter") || "Vefa";
    if (selectedCharacter === "Alexis") {
      this.npcDialogue = `Salut Alexis !\nSi tu veux sauver Vefa`;
    } else {
      this.npcDialogue = `Demat Vefa !\nSi tu veux sauver Alexis`;
    }
  }

  // ------------------------------------------------------------------------------------------ //
  // UPDATE LOOP
  // ------------------------------------------------------------------------------------------ //
  update() {
    PlayerManager.updatePlayerMovement(this);
  }
}
