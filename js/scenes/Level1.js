function preloadLevel1() {
  // Images
  this.load.image("lvl1-background", "assets/images/level1/lvl1_background.png");
  this.load.image("npc-sprite", "assets/images/level1/Ardoise.png");
  this.load.image("alexis-game-sprite", "assets/images/characters/Alexis.png");
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
  this.cameras.main.once("camerafadeincomplete", () => {
    const selectedCharacter = this.registry.get("selectedCharacter") || "Alexis";
    const otherCharacter = selectedCharacter === "Alexis" ? "Vefa" : "Alexis";

    const playerText = `Je dois trouver le code de l'ascenseur pour sauver ${otherCharacter} !\nIl doit y avoir un indice quelque part...`;
    const spritPlayer = `${selectedCharacter.toLowerCase()}-game-sprite`;

    showPlayerDialogue(this, playerText, spritPlayer, selectedCharacter);

    // Cacher après 10 secondes
    this.time.delayedCall(10000, () => {
      hidePlayerDialogue(this);
    });
  });

  // ------------------------------------------------------------ //
  // Déplacement - STOCKER DANS THIS
  createPlayerMovement(this, this.player, 135);
  createPlayerDialogue(this);

  // ------------------------------------------------------------ //
  // NPC - STOCKER DANS THIS
  this.npc = this.add.image(690, 620, "npc-sprite");
  this.npc.setScale(0.13);

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

  // NPC colider
  this.physics.add.existing(this.npc);
  this.npc.body.setSize(600, 550);
  this.npc.body.setOffset(200, 415);
  this.npc.body.setImmovable(true);

  this.physics.add.existing(this.player);
  this.player.body.setSize(250, 75); // largeur, hauteur
  this.player.body.setOffset(0, 500); // position du coin haut-gauche de la hitbox par rapport au sprite
  this.physics.add.collider(this.player, this.npc);
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
