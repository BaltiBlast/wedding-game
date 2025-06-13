function preloadLevel2() {
  // Images
  this.load.image("background", "assets/images/level2/lvl2_background.png");
  this.load.image("fences", "assets/images/level2/fences.png");
  this.load.image("spaceship", "assets/images/level2/spaceship.png");
  this.load.spritesheet("alexis-spritesheet", "assets/images/characters/alexis-spritesheet.png", {
    frameWidth: 270,
    frameHeight: 600,
  });

  this.load.spritesheet("vefa-spritesheet", "assets/images/characters/vefa-spritesheet.png", {
    frameWidth: 270,
    frameHeight: 600,
  });

  // Audio
  this.load.audio("footstep", "assets/sounds/step_walk/wood.mp3");
  this.load.audio("music_level", "assets/sounds/level2/kerbal.mp3");
}

function createLevel2() {
  // ----------------------------
  // PARAMÈTRES RÉUTILISABLES
  // ----------------------------
  this.spaceshipTriggerDistance = 30;
  this.nearShip = false;
  this.cameras.main.fadeIn(1000, 0, 0, 0);
  this.add.image(512, 512, "background");

  this.musicLevel = this.sound.add("music_level", {
    loop: true,
    volume: 0.1,
  });
  this.musicLevel.play();

  const selectedCharacter = this.registry.get("selectedCharacter") || "Vefa";
  this.player = createAnimatedPlayer(this, 450, 900, selectedCharacter);
  this.player.setScale(0.25);
  this.player.setOrigin(0.5, 1);

  createPlayerMovement(this, this.player, 135);

  this.tweens.add({
    targets: this.player,
    scaleY: 0.252,
    duration: 1000,
    ease: "Sine.easeInOut",
    yoyo: true,
    repeat: -1,
  });

  this.fences = createObstacle(this, 512, 1020, "fences", {
    scale: 1,
    size: { width: 1024, height: 20 },
    offset: { x: 0, y: 920 },
  });

  this.spaceship = createObstacle(this, 680, 750, "spaceship", {
    scale: 0.45,
    size: { width: 650, height: 20 },
    offset: { x: 115, y: 645 },
  });

  this.fencesTop = createInvisibleWall(this, 512, 580, 1024, 20);
  this.fencesLeft1 = createInvisibleWall(this, 390, 830, 20, 150);
  this.fencesLeft2 = createInvisibleWall(this, 300, 750, 20, 400);
  this.fencesLeft3 = createInvisibleWall(this, 350, 765, 100, 20);
  this.fencesRight = createInvisibleWall(this, 860, 750, 20, 400);
  this.fencesBottomRight1 = createInvisibleWall(this, 750, 910, 70, 20);
  this.fencesBottomRight2 = createInvisibleWall(this, 820, 880, 70, 20);
  this.leftSpaceship = createInvisibleWall(this, 590, 650, 40, 200);

  this.physics.add.existing(this.player);
  this.player.body.setSize(250, 75);
  this.player.body.setOffset(0, 500);

  // ----------------------------
  // UI SPACESHIP
  // ----------------------------
  this.spaceshipPrompt = this.add
    .rectangle(512, 820, 600, 150, 0x1a1a2e, 0.95)
    .setStrokeStyle(3, 0x64ffda)
    .setVisible(false)
    .setDepth(2000);
  this.spaceshipPromptText = this.add
    .text(512, 780, "Entrer dans le vaisseau ?", { fontSize: "20px", fill: "#ffffff" })
    .setOrigin(0.5)
    .setVisible(false)
    .setDepth(2001);

  this.spaceshipYesBtn = this.add
    .rectangle(440, 850, 100, 40, 0x64ffda)
    .setInteractive({ useHandCursor: true })
    .setVisible(false)
    .setDepth(2001);
  this.spaceshipYesText = this.add
    .text(440, 850, "Oui", { fontSize: "16px", fill: "#1a1a2e" })
    .setOrigin(0.5)
    .setVisible(false)
    .setDepth(2002);

  this.spaceshipNoBtn = this.add
    .rectangle(580, 850, 100, 40, 0x64ffda)
    .setInteractive({ useHandCursor: true })
    .setVisible(false)
    .setDepth(2001);
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
  this.spaceshipUIVisible = false;

  this.showSpaceshipUI = function () {
    if (this.spaceshipUIVisible) return;
    stopPlayer(this);
    this.allowPlayerMovement = false;
    this.spaceshipUIVisible = true;
    this.spaceshipElements.forEach((el) => el.setVisible(true));
  }.bind(this);

  this.hideSpaceshipUI = function () {
    if (!this.spaceshipUIVisible) return;
    this.spaceshipUIVisible = false;
    this.spaceshipElements.forEach((el) => el.setVisible(false));
    this.allowPlayerMovement = true;
  }.bind(this);

  this.spaceshipYesBtn.on("pointerdown", () => {
    // this.sound.play("spaceship_entry", { volume: 0.5 });
    this.spaceshipUsed = true;
    this.player.setVisible(false);
    this.hideSpaceshipUI();

    // Étape 1 : secousse forte unique
    this.tweens.add({
      targets: this.spaceship,
      x: this.spaceship.x - 10,
      y: this.spaceship.y - 10,
      duration: 100,
      yoyo: true,
      repeat: 2,
      ease: "Power1",
      onComplete: () => {
        // Étape 2 : décollage lent à mi-hauteur avec tremblement léger en continu
        const shake = this.tweens.add({
          targets: this.spaceship,
          x: { from: this.spaceship.x - 1, to: this.spaceship.x + 1 },
          y: { from: this.spaceship.y - 1, to: this.spaceship.y + 1 },
          duration: 100,
          yoyo: true,
          repeat: -1,
        });

        this.tweens.add({
          targets: this.spaceship,
          y: this.spaceship.y - 150,
          duration: 2000,
          ease: "Sine.easeInOut",
          onComplete: () => {
            // Étape 3 : accélération vers le haut pour quitter l'écran
            this.tweens.add({
              targets: this.spaceship,
              y: this.spaceship.y - 800,
              duration: 2500,
              ease: "Expo.easeIn",
              onComplete: () => {
                shake.stop();
              },
            });
          },
        });
      },
    });
  });

  this.enterCockpit = function () {
    this.allowPlayerMovement = false;
    this.add.image(512, 512, "cockpit").setDepth(0);
    this.spaceship.setVisible(false);
    this.fences.setVisible(false);
    startHologramForm(this, initialQuestions); // <-- ajout ici
  }.bind(this);

  this.spaceshipNoBtn.on("pointerdown", () => {
    this.hideSpaceshipUI();
  });
}

function updateLevel2() {
  if (this.allowPlayerMovement !== false) {
    updatePlayerMovement(this);
  } else {
    this.player.body.setVelocity(0);
  }

  const distanceToShip = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.spaceship.x, this.spaceship.y);
  if (
    !this.spaceshipUIVisible &&
    !this.spaceshipUsed &&
    distanceToShip < this.spaceshipTriggerDistance &&
    !this.nearShip
  ) {
    this.nearShip = true;
    this.showSpaceshipUI();
  }
  if (distanceToShip >= this.spaceshipTriggerDistance && this.nearShip) {
    this.nearShip = false;
  }

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
    obj.setDepth(obj.y);
  });
}
