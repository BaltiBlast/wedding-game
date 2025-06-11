function preloadLevel1() {
  // Images
  this.load.image("lvl1-background", "assets/images/level1/lvl1_background.png");
  this.load.image("npc-sprite", "assets/images/level1/Ardoise.png");
  this.load.image("alexis-game-sprite", "assets/images/characters/Alexis.png");
  this.load.image("poteau1", "assets/images/level1/poteau1.png");
  this.load.image("poteau2", "assets/images/level1/poteau2.png");
  this.load.image("poteau3", "assets/images/level1/poteau3.png");
  this.load.image("maison", "assets/images/level1/maison.png");
  this.load.image("sapin", "assets/images/level1/sapin.png");

  // this.load.image("vefa-game-sprite", "assets/images/characters/vefa-game.png");
  this.load.spritesheet("alexis-spritesheet", "assets/images/characters/alexis-spritesheet.png", {
    frameWidth: 270,
    frameHeight: 600,
  });

  // Audio
  this.load.audio("footstep", "assets/sounds/step_walk/grass.mp3");
}

function createLevel1() {
  this.cameras.main.fadeIn(1000, 0, 0, 0);
  this.add.image(512, 512, "lvl1-background");

  const selectedCharacter = this.registry.get("selectedCharacter") || "Alexis";
  this.player = createAnimatedPlayer(this, 430, 570, selectedCharacter);
  this.player.setScale(0.2);
  this.player.setOrigin(0.5, 1);

  // Respiration naturelle
  this.tweens.add({
    targets: this.player,
    scaleY: 0.205,
    duration: 1000,
    ease: "Sine.easeInOut",
    yoyo: true,
    repeat: -1,
  });

  // Dialogue d'introduction (après le fade in)
  // this.cameras.main.once("camerafadeincomplete", () => {
  //   const selectedCharacter = this.registry.get("selectedCharacter") || "Alexis";
  //   const otherCharacter = selectedCharacter === "Alexis" ? "Vefa" : "Alexis";

  //   const playerText = `Je dois trouver le code de l'ascenseur pour sauver ${otherCharacter} !\nIl doit y avoir un indice quelque part...`;
  //   const spritPlayer = `${selectedCharacter.toLowerCase()}-game-sprite`;

  //   showPlayerDialogue(this, playerText, spritPlayer, selectedCharacter);

  //   // Cacher après 10 secondes
  //   this.time.delayedCall(10000, () => {
  //     hidePlayerDialogue(this);
  //   });
  // });

  // ------------------------------------------------------------ //
  // Déplacement - STOCKER DANS THIS
  createPlayerMovement(this, this.player, 135);
  createPlayerDialogue(this);

  // ------------------------------------------------------------ //
  // ELEMENTS COLIDER
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
  this.maison = createObstacle(this, 840, 485, "maison", {
    scale: 1,
    size: { width: 180, height: 70 },
    offset: { x: 20, y: 130 },
  });

  // mur invisible feu de camp
  this.roundRock = createRoundInvisibleWall(this, 550, 660, 50);

  // mur invisible bas
  this.wallBottom = createInvisibleWall(this, 512, 1000, 1024, 200);

  // mur invisible haut
  this.wallTop = createInvisibleWall(this, 512, 150, 1024, 350);

  // mur invisible gauche
  this.wallLeft = createInvisibleWall(this, 20, 512, 40, 1024);

  // mur invisible droit
  this.wallRight = createInvisibleWall(this, 1000, 512, 40, 1024);

  // Bulle d'interaction - STOCKER DANS THIS
  this.interactionBubble = this.add
    .text(this.npc.x, this.npc.y - 50, "💬", {
      fontSize: "32px",
    })
    .setOrigin(0.5)
    .setVisible(false);

  // Variables - STOCKER DANS THIS
  this.interactionDistance = 80;
  this.nearNPC = false;

  createNPCDialogue(this);

  // Texte du dialogue
  this.npcDialogue =
    "Le code de l'ascenseur ?\nIl me semble que c'est la date du mariage, mais… je n'en suis plus sûr.\nJe l'avais noté sur un papier que j'ai perdu.";

  // ------------------------------------------------------------ //
  // PLAYER
  this.physics.add.existing(this.player);
  this.player.body.setSize(250, 75);
  this.player.body.setOffset(0, 500);
  this.physics.add.collider(this.player, this.npc);

  // ------------------------------------------------------------ //
  // POTEAU
}

function updateLevel1() {
  updatePlayerMovement(this);

  const distanceToNPC = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);

  if (distanceToNPC < this.interactionDistance && !this.nearNPC) {
    this.nearNPC = true;
    this.interactionBubble.setVisible(true);
    showNPCDialogue(this, this.npcDialogue, "npc-sprite", "Ardoise");
  } else if (distanceToNPC >= this.interactionDistance && this.nearNPC) {
    this.nearNPC = false;
    this.interactionBubble.setVisible(false);
    hideNPCDialogue(this);
  }

  const sprites = [this.player, this.npc];
  sprites.forEach((sprite) => sprite.setDepth(sprite.y));
}
