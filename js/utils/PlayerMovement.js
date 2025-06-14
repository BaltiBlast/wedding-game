function createAnimatedPlayer(scene, x, y, selectedCharacter) {
  if (selectedCharacter === "Alexis") {
    // Créer toutes les animations d'Alexis
    scene.anims.create({
      key: "idle-down",
      frames: [{ key: "alexis-spritesheet", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });

    scene.anims.create({
      key: "idle-up",
      frames: [{ key: "alexis-spritesheet", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });

    scene.anims.create({
      key: "idle-left",
      frames: [{ key: "alexis-spritesheet", frame: 2 }],
      frameRate: 1,
      repeat: 0,
    });

    scene.anims.create({
      key: "idle-right",
      frames: [{ key: "alexis-spritesheet", frame: 3 }],
      frameRate: 1,
      repeat: 0,
    });

    scene.anims.create({
      key: "walk-down",
      frames: scene.anims.generateFrameNumbers("alexis-spritesheet", { start: 4, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-up",
      frames: scene.anims.generateFrameNumbers("alexis-spritesheet", { start: 8, end: 9 }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-left",
      frames: scene.anims.generateFrameNumbers("alexis-spritesheet", { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-right",
      frames: scene.anims.generateFrameNumbers("alexis-spritesheet", { start: 16, end: 19 }),
      frameRate: 8,
      repeat: -1,
    });

    // Créer le sprite animé
    const player = scene.add.sprite(x, y, "alexis-spritesheet");
    player.play("idle-down");
    return player;
  } else {
    // Garder l'image statique pour Vefa
    return scene.add.image(x, y, "vefa-game-sprite");
  }
}

function createPlayerMovement(scene, player, moveSpeed) {
  scene.player = player;
  scene.cursors = scene.input.keyboard.createCursorKeys();
  scene.wasdKeys = scene.input.keyboard.addKeys("Z,Q,S,D");
  scene.moveSpeed = moveSpeed;
  scene.isMoving = false;

  scene.footstepSound = scene.sound.add("footstep", {
    loop: true,
    volume: 0.5,
  });
  scene.wasMoving = false;
}

function updatePlayerMovement(scene) {
  let isMoving = false;

  // Déplacement gauche
  if (scene.cursors.left.isDown || scene.wasdKeys.Q.isDown) {
    scene.player.x -= scene.moveSpeed * (1 / 60);
    if (scene.player.anims) scene.player.anims.play("walk-left", true);
    scene.lastDirection = "left";
    isMoving = true;
  }
  // Déplacement droite
  else if (scene.cursors.right.isDown || scene.wasdKeys.D.isDown) {
    scene.player.x += scene.moveSpeed * (1 / 60);
    if (scene.player.anims) scene.player.anims.play("walk-right", true);
    scene.lastDirection = "right";
    isMoving = true;
  }
  // Déplacement haut
  else if (scene.cursors.up.isDown || scene.wasdKeys.Z.isDown) {
    scene.player.y -= scene.moveSpeed * (1 / 60);
    if (scene.player.anims) scene.player.anims.play("walk-up", true);
    scene.lastDirection = "up";
    isMoving = true;
  }
  // Déplacement bas
  else if (scene.cursors.down.isDown || scene.wasdKeys.S.isDown) {
    scene.player.y += scene.moveSpeed * (1 / 60);
    if (scene.player.anims) scene.player.anims.play("walk-down", true);
    scene.lastDirection = "down";
    isMoving = true;
  }

  // Si pas de mouvement, jouer l'animation idle dans la dernière direction
  if (!isMoving && scene.player.anims) {
    const idleDirection = scene.lastDirection || "down";
    scene.player.anims.play(`idle-${idleDirection}`, true);
  }

  if (isMoving && !scene.wasMoving) {
    if (!scene.footstepSound.isPlaying) {
      scene.footstepSound.play();
    }
  } else if (!isMoving && scene.wasMoving) {
    scene.footstepSound.stop();
  }
  scene.wasMoving = isMoving;
}
