class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: "Level2" });
  }

  preload() {
    // Keyboard guide assets
    KeyboardGuide.preloadKeyboardGuide(this);

    // Images
    this.load.image("bg_level2", "assets/images/level2/bg_level2.png");
    this.load.image("prop_fences", "assets/images/level2/prop_fences.png");
    this.load.image("prop_spaceship", "assets/images/level2/prop_spaceship.png");

    // Spritesheets
    this.load.spritesheet("char_alexis_spritesheet", "assets/images/characters/char_alexis_spritesheet.png", {
      frameWidth: 270,
      frameHeight: 600,
    });

    this.load.spritesheet("char_vefa_spritesheet", "assets/images/characters/char_vefa_spritesheet.png", {
      frameWidth: 270,
      frameHeight: 600,
    });

    this.load.spritesheet("fx_fire_animation", "assets/images/title_screen/fx_fire_animation.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    // Audio
    this.load.audio("sfx_footstep_wood", "assets/sounds/step_walk/sfx_footstep_wood.mp3");
    this.load.audio("mus_level2_theme", "assets/sounds/level2/mus_level2_theme.mp3");
    this.load.audio("fx_enter_door", "assets/sounds/level2/fx_enter_door.wav");
  }

  create() {
    // Scene transition
    this.setupTransition();

    // Background
    this.add.image(512, 512, "bg_level2");

    // Set up keyboard guide
    KeyboardGuide.createKeyboardGuideAnimations(this);
    KeyboardGuide.displayKeyboardGuide(this, 150, 150, 3.5);

    // Audio setup
    this.setupAudio();

    // Player setup
    this.createPlayer();

    // Display invisible walls
    this.createInvisibleWalls();

    // Display obstacles
    this.createObstacles();

    // Starship
    this.createSpaceshipStatic();

    // Startship UI
    this.createStarshipUI();

    this.events.on("wake", () => {
      if (this.registry.get("fromCockpit")) {
        this.registry.remove("fromCockpit");
        this.createSpaceshipWithFlame();
        this.launchPostCockpitSequence();
      }
    });
  }

  update() {
    if (!this.spaceshipUIVisible) {
      PlayerManager.updatePlayerMovement(this);
    }
    this.updateInteractions();
    this.updateDynamicDepth();
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
    this.musicLevel = AudioManager.playMusic(this, "mus_level2_theme", 0.1);
  }

  // ------------------------------------------------------------------------------------------ //
  // PLAYER SETUP
  // ------------------------------------------------------------------------------------------ //
  createPlayer() {
    const selectedCharacter = this.registry.get("selectedCharacter") || "Vefa";
    this.player = PlayerManager.setupCompletePlayer(this, 450, 890, selectedCharacter, 135, "sfx_footstep_wood");
  }

  // ------------------------------------------------------------------------------------------ //
  // INVISIBLE WALLS SETUP
  // ------------------------------------------------------------------------------------------ //
  createInvisibleWalls() {
    this.fencesTop = ObstacleManager.createInvisibleWall(this, 512, 580, 1024, 20);
    this.fencesLeft1 = ObstacleManager.createInvisibleWall(this, 390, 830, 20, 150);
    this.fencesLeft2 = ObstacleManager.createInvisibleWall(this, 300, 750, 20, 400);
    this.fencesLeft3 = ObstacleManager.createInvisibleWall(this, 350, 765, 100, 20);
    this.fencesRight = ObstacleManager.createInvisibleWall(this, 860, 750, 20, 400);
    this.fencesBottomRight1 = ObstacleManager.createInvisibleWall(this, 750, 910, 70, 20);
    this.fencesBottomRight2 = ObstacleManager.createInvisibleWall(this, 820, 880, 70, 20);
    this.leftSpaceship = ObstacleManager.createInvisibleWall(this, 590, 650, 40, 200);
  }

  // ------------------------------------------------------------------------------------------ //
  // OBSTACLES SETUP
  // ------------------------------------------------------------------------------------------ //
  createObstacles() {
    // Fences
    this.fences = ObstacleManager.createObstacle(this, 512, 1020, "prop_fences", {
      scale: 1,
      size: { width: 1024, height: 20 },
      offset: { x: 0, y: 920 },
    });
  }

  createSpaceshipStatic() {
    this.spaceship = ObstacleManager.createObstacle(this, 680, 750, "prop_spaceship", {
      scale: 0.45,
      size: { width: 650, height: 20 },
      offset: { x: 115, y: 645 },
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // DYNAMIC DEPTH MANAGEMENT
  // ------------------------------------------------------------------------------------------ //
  updateDynamicDepth() {
    this.dynamicDepthObjects = [
      this.player,
      this.fences,
      this.fencesTop,
      this.fencesLeft1,
      this.fencesLeft2,
      this.fencesRight,
      this.fencesBottomRight1,
      this.fencesBottomRight2,
      this.spaceship,
      this.leftSpaceship,
    ];

    this.dynamicDepthObjects.forEach((obj) => {
      if (obj) {
        obj.setDepth(obj.y);
      }
    });
  }

  // ----------------------------------------------------------------------------------- //
  // STARSHIP UI SETUP
  // ------------------------------------------------------------------------------------------ //
  createStarshipUI() {
    this.interactionDistance = 20;

    // Background
    this.spaceshipPrompt = this.add
      .rectangle(512, 820, 600, 150, 0x1a1a2e, 0.95)
      .setStrokeStyle(3, 0x64ffda)
      .setVisible(false)
      .setDepth(2000);

    // Title
    this.spaceshipPromptText = this.add
      .text(512, 780, "Entrer dans le vaisseau ?", { fontSize: "20px", fill: "#ffffff" })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(2001);

    // "yes" button background
    this.spaceshipYesBtn = this.add
      .rectangle(440, 850, 100, 40, 0x64ffda)
      .setInteractive({ useHandCursor: true })
      .setVisible(false)
      .setDepth(2001);

    // "yes" button text
    this.spaceshipYesText = this.add
      .text(440, 850, "Oui", { fontSize: "16px", fill: "#1a1a2e" })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(2002);

    // "no" button background
    this.spaceshipNoBtn = this.add
      .rectangle(580, 850, 100, 40, 0x64ffda)
      .setInteractive({ useHandCursor: true })
      .setVisible(false)
      .setDepth(2001);

    // "no" button text
    this.spaceshipNoText = this.add
      .text(580, 850, "Non", { fontSize: "16px", fill: "#1a1a2e" })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(2002);

    this.spaceshipElements = [
      this.spaceshipPrompt,
      this.spaceshipPromptText,
      this.spaceshipYesBtn,
      this.spaceshipYesText,
      this.spaceshipNoBtn,
      this.spaceshipNoText,
    ];

    this.spaceshipNoBtn.on("pointerdown", () => {
      this.hideSpaceshipUi();
    });

    this.spaceshipYesBtn.on("pointerdown", () => {
      this.enterStarshipCockpit();
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // STARSHIP INTERACTIONS SETUP
  // ------------------------------------------------------------------------------------------ //
  showSpaceshipUi() {
    this.spaceshipUIVisible = true;
    PlayerManager.stopPlayer(this);
    this.allowPlayerMovement = false;
    this.spaceshipElements.forEach((el) => el.setVisible(true));
  }

  hideSpaceshipUi() {
    this.spaceshipUIVisible = false;
    this.spaceshipElements.forEach((el) => el.setVisible(false));
    this.allowPlayerMovement = true;
  }

  enterStarshipCockpit() {
    this.hideSpaceshipUi();

    this.input.keyboard.removeAllListeners();
    this.input.keyboard.manager.clearCaptures();
    this.input.keyboard.enabled = false;

    this.scene.sleep();
    this.scene.launch("StartshipCockpit");

    AudioManager.playSound(this, "fx_enter_door", 0.1);
    this.player.setVisible(false);
    this.spaceship.setVisible(false);
  }

  // ------------------------------------------------------------------------------------------ //
  // STARSHIP ANIMATION AFTER COCKPIT
  // ------------------------------------------------------------------------------------------ //

  launchPostCockpitSequence() {
    this.playSpaceshipLaunchAnimation();
  }

  playSpaceshipLaunchAnimation() {
    this.tweens.add({
      targets: this.spaceshipContainer,
      x: this.spaceshipContainer.x - 10,
      y: this.spaceshipContainer.y - 10,
      duration: 100,
      yoyo: true,
      repeat: 2,
      ease: "Power1",
      onComplete: () => {
        const shake = this.tweens.add({
          targets: this.spaceshipContainer,
          x: { from: this.spaceshipContainer.x - 1, to: this.spaceshipContainer.x + 1 },
          y: { from: this.spaceshipContainer.y - 1, to: this.spaceshipContainer.y + 1 },
          duration: 100,
          yoyo: true,
          repeat: -1,
        });

        this.tweens.add({
          targets: this.spaceshipContainer,
          y: this.spaceshipContainer.y - 150,
          duration: 2000,
          ease: "Sine.easeInOut",
          onComplete: () => {
            this.tweens.add({
              targets: this.spaceshipContainer,
              y: this.spaceshipContainer.y - 800,
              duration: 2500,
              ease: "Expo.easeIn",
              onComplete: () => {
                shake.stop();

                if (this.flame) {
                  this.flame.anims.stop();
                  this.flame.setVisible(false);
                }

                this.time.delayedCall(2000, () => {
                  const music = this.sound.get("mus_launch_starship");

                  if (music && music.isPlaying) {
                    this.tweens.add({
                      targets: music,
                      volume: 0,
                      duration: 1500,
                      onComplete: () => {
                        music.stop();
                        this.scene.start("StarshipTraveling");
                      },
                    });
                  } else {
                    this.scene.start("StarshipTraveling");
                  }
                });
              },
            });
          },
        });
      },
    });
  }

  createSpaceshipWithFlame() {
    this.spaceshipContainer = this.add.container(680, 585);

    this.flameBack = this.add.sprite(-100, 120, "fx_fire_animation").setScale(4).setRotation(Phaser.Math.DegToRad(180));
    this.spaceshipContainer.add(this.flameBack);

    this.spaceship = this.add.image(0, 0, "prop_spaceship").setScale(0.45);
    this.spaceshipContainer.add(this.spaceship);

    this.flame = this.add.sprite(100, 125, "fx_fire_animation").setScale(4).setRotation(Phaser.Math.DegToRad(180));
    this.spaceshipContainer.add(this.flame);

    this.anims.create({
      key: "flame_burn",
      frames: this.anims.generateFrameNumbers("fx_fire_animation", { start: 0, end: 3 }),
      frameRate: 15,
      repeat: -1,
    });

    this.flameBack.play("flame_burn");
    this.flame.play("flame_burn");

    this.leftSpaceship = ObstacleManager.createInvisibleWall(this, 590, 650, 40, 200);
  }

  // ------------------------------------------------------------------------------------------ //
  // INTERACTIONS UPDATE
  // ------------------------------------------------------------------------------------------ //
  updateInteractions() {
    InteractionManager.checkProximity(this, this.spaceship, "nearStartship", this.interactionDistance, () => {
      this.showSpaceshipUi();
    });
  }
}
