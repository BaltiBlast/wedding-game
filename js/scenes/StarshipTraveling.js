class StarshipTraveling extends Phaser.Scene {
  constructor() {
    super({ key: "StarshipTraveling" });
  }

  // ------------------------------------------------------------------------------------------ //
  // PRELOAD SCENE
  // ------------------------------------------------------------------------------------------ //
  preload() {
    // Keyboard guide assets
    KeyboardGuide.preloadKeyboardGuide(this);

    // Images
    this.load.image("bg_starship_traveling", "assets/images/traveling/bg_starship_traveling.png");
    this.load.image("prop_spaceship", "assets/images/level2/prop_spaceship.png");
    this.load.image("prop_green_planet", "assets/images/traveling/prop_green_planet.png");

    AsteroidManager.preloadAsteroides(this);

    // Audio
    this.load.audio("sfx_space_impact", "assets/sounds/traveling/sfx_space_impact.mp3");
    this.load.audio("mus_traveling_level", "assets/sounds/traveling/mus_traveling_level.mp3");
  }

  // ------------------------------------------------------------------------------------------ //
  // CREATE SCENE
  // ------------------------------------------------------------------------------------------ //
  create() {
    // Global
    this.lastLoopingTime = 0;
    this.planetSequenceStarted = false;

    // Scene transition
    this.setupTransition();

    // Set up keyboard guide
    KeyboardGuide.createKeyboardGuideAnimations(this);
    KeyboardGuide.displayKeyboardGuide(this, 850, 900, 4);

    // Audio setup
    AudioManager.setBackgroundMusic(this, "mus_traveling_level", 0.1, true, 2500);

    // Animated background
    this.bg = this.add.tileSprite(0, 0, 1024, 1024, "bg_starship_traveling").setOrigin(0).setScrollFactor(0);
    this.bgScrollSpeed = 1.5;

    // Starship deplacement + animation
    this.starshipInit();
    this.createInvisibleWalls();

    // Asteroides generator
    AsteroidManager.createAsteroides(this);

    // Colider between asteroide / starship
    this.coliderManagement();

    this.updateDynamicDepth();

    this.planetSetUp();
  }

  // ------------------------------------------------------------------------------------------ //
  // UPLOAD SCENE
  // ------------------------------------------------------------------------------------------ //
  update() {
    if (!this.hasStopped || !this.planetSequenceStarted) {
      this.bg.tilePositionX -= this.bgScrollSpeed;
    }

    StarshipManager.updateMovement();
    AsteroidManager.updateAsteroides();
    this.planetAnimationUpdate();
  }

  // ------------------------------------------------------------------------------------------ //
  // SCENE TRANSITION SETUP
  // ------------------------------------------------------------------------------------------ //
  setupTransition() {
    SceneManager.fadeInScene(this);
  }

  // ------------------------------------------------------------------------------------------ //
  // DYNAMIC DEPTH MANAGEMENT
  // ------------------------------------------------------------------------------------------ //
  updateDynamicDepth() {
    this.dynamicDepthObjects = [this.player, this.wall];

    this.dynamicDepthObjects.forEach((obj) => {
      if (obj) {
        obj.setDepth(obj.y);
      }
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // STARSHIP SETUP
  // ------------------------------------------------------------------------------------------ //
  starshipInit() {
    StarshipManager.createStarshipControls(this);
    this.player = StarshipManager.getSpaceship();
  }

  spaceshipHitAnimation(spaceship) {
    const cooldown = 3000;
    const now = this.time.now;

    if (now - this.lastLoopingTime < cooldown) return;

    this.lastLoopingTime = now;

    AudioManager.playSoundEffects(this, "sfx_space_impact", 0.05);

    this.tweens.add({
      targets: spaceship,
      angle: 360,
      duration: 400,
      ease: "Cubic.easeInOut",
      onComplete: () => {
        spaceship.angle = 0;
      },
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // COLLIDER SETUP
  // ------------------------------------------------------------------------------------------ //
  coliderManagement() {
    this.physics.add.overlap(
      StarshipManager.getSpaceship(),
      AsteroidManager.getGroup(),
      this.onAsteroidHit,
      null,
      this
    );
  }

  onAsteroidHit(spaceship) {
    this.spaceshipHitAnimation(spaceship);
  }

  // ------------------------------------------------------------------------------------------ //
  // INVISIBLE WALLS SETUP
  // ------------------------------------------------------------------------------------------ //
  createInvisibleWalls() {
    const walls = {
      top: this.add.rectangle(512, 0, 1024, 5, 0x000000, 0),
      bottom: this.add.rectangle(512, 1024, 1024, 5, 0x000000, 0),
      left: this.add.rectangle(0, 512, 5, 1024, 0x000000, 0),
      right: this.add.rectangle(1024, 512, 5, 1024, 0x000000, 0),
    };

    for (const wall of Object.values(walls)) {
      this.physics.add.existing(wall, true);
      this.physics.add.collider(this.player, wall);
    }
  }

  // ------------------------------------------------------------------------------------------ //
  // PLANET WALLS SETUP
  // ------------------------------------------------------------------------------------------ //
  planetSetUp() {
    this.time.delayedCall(25000, () => {
      this.planetSequenceStarted = true;
      this.planet = this.add.image(-200, 250, "prop_green_planet").setScale(0.2).setDepth(0);
      this.planetTargetX = 200;
      this.planetSpeed = 1;
      this.hasStopped = false;
      this.isPlanetArriving = true;
    });
  }

  planetAnimationUpdate() {
    if (this.planet && this.isPlanetArriving && !this.hasStopped) {
      if (this.planet.x < this.planetTargetX) {
        this.planet.x += this.planetSpeed;
      } else {
        this.hasStopped = true;
        this.planet.x = this.planetTargetX;

        this.time.delayedCall(2000, () => {
          this.launchToPlanet();
        });
      }
    }
  }

  launchToPlanet() {
    const ship = this.player;
    if (!ship) return;

    this.tweens.add({
      targets: ship,
      x: this.planet.x,
      y: this.planet.y,
      scale: 0,
      duration: 2000,
      ease: "Sine.easeInOut",
      onComplete: () => {
        ship.setVisible(false);

        this.time.delayedCall(500, () => {
          const sparkle = this.add
            .star(this.planet.x, this.planet.y, 4, 2, 8, 0xffce00)
            .setAlpha(1)
            .setScale(0.5)
            .setDepth(10);

          // Démarre en même temps les deux fadeouts
          AudioManager.stopBackgroundMusic(this, "mus_traveling_level", 2500);
          this.cameras.main.fadeOut(2600, 0, 0, 0);

          // Animation de l'étoile
          this.tweens.add({
            targets: sparkle,
            scale: 3,
            alpha: 0,
            duration: 600,
            ease: "Sine.easeOut",
            onComplete: () => {
              sparkle.destroy();
            },
          });

          // Changement de scène après que la caméra ait fini de fader
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("Level3");
          });
        });
      },
    });
  }
}
