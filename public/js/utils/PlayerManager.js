class PlayerManager {
  static createPlayer(scene, x, y, selectedCharacter) {
    const player = this.createAnimatedPlayer(scene, x, y, selectedCharacter);
    player.setScale(0.2);
    player.setOrigin(0.5, 1);

    // Setup physics
    scene.physics.add.existing(player);
    player.body.setSize(250, 75);
    player.body.setOffset(0, 500);

    return player;
  }

  static addBreathingAnimation(scene, player) {
    scene.tweens.add({
      targets: player,
      scaleY: 0.205,
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  static setupPlayerDialogue(scene) {
    createPlayerDialogue(scene);
  }

  static stopPlayer(scene) {
    if (!scene.player || !scene.player.body) return;
    scene.player.body.setVelocity(0);

    if (scene.player.anims) {
      const idleDirection = scene.lastDirection || "down";
      scene.player.anims.play(`idle-${idleDirection}`, true);
    }

    if (scene.footstepSound && scene.footstepSound.isPlaying) {
      scene.footstepSound.stop();
    }

    scene.wasMoving = false;
  }

  static createPlayerMovement(scene, player, moveSpeed, footstepSoundKey) {
    scene.player = player;
    scene.cursors = scene.input.keyboard.createCursorKeys();
    scene.wasdKeys = scene.input.keyboard.addKeys("Z,Q,S,D");
    scene.moveSpeed = moveSpeed;

    scene.footstepSound = scene.sound.add(footstepSoundKey, {
      loop: true,
      volume: 0.2,
    });
    scene.wasMoving = false;
  }

  static createAnimatedPlayer(scene, x, y, selectedCharacter) {
    if (selectedCharacter === "Alexis") {
      // Créer toutes les animations d'Alexis
      scene.anims.create({
        key: "idle-down",
        frames: [{ key: "char_alexis_spritesheet", frame: 0 }],
        frameRate: 1,
        repeat: 0,
      });

      scene.anims.create({
        key: "idle-up",
        frames: [{ key: "char_alexis_spritesheet", frame: 1 }],
        frameRate: 1,
        repeat: 0,
      });

      scene.anims.create({
        key: "idle-left",
        frames: [{ key: "char_alexis_spritesheet", frame: 2 }],
        frameRate: 1,
        repeat: 0,
      });

      scene.anims.create({
        key: "idle-right",
        frames: [{ key: "char_alexis_spritesheet", frame: 3 }],
        frameRate: 1,
        repeat: 0,
      });

      scene.anims.create({
        key: "walk-down",
        frames: scene.anims.generateFrameNumbers("char_alexis_spritesheet", { start: 4, end: 5 }),
        frameRate: 6,
        repeat: -1,
      });

      scene.anims.create({
        key: "walk-up",
        frames: scene.anims.generateFrameNumbers("char_alexis_spritesheet", { start: 8, end: 9 }),
        frameRate: 6,
        repeat: -1,
      });

      scene.anims.create({
        key: "walk-left",
        frames: scene.anims.generateFrameNumbers("char_alexis_spritesheet", { start: 12, end: 15 }),
        frameRate: 8,
        repeat: -1,
      });

      scene.anims.create({
        key: "walk-right",
        frames: scene.anims.generateFrameNumbers("char_alexis_spritesheet", { start: 16, end: 19 }),
        frameRate: 8,
        repeat: -1,
      });

      // Créer le sprite animé
      const player = scene.add.sprite(x, y, "char_alexis_spritesheet");
      player.play("idle-down");
      return player;
    } else {
      // Créer toutes les animations d'Alexis
      scene.anims.create({
        key: "idle-down",
        frames: [{ key: "char_vefa_spritesheet", frame: 0 }],
        frameRate: 1,
        repeat: 0,
      });

      scene.anims.create({
        key: "idle-up",
        frames: [{ key: "char_vefa_spritesheet", frame: 1 }],
        frameRate: 1,
        repeat: 0,
      });

      scene.anims.create({
        key: "idle-left",
        frames: [{ key: "char_vefa_spritesheet", frame: 2 }],
        frameRate: 1,
        repeat: 0,
      });

      scene.anims.create({
        key: "idle-right",
        frames: [{ key: "char_vefa_spritesheet", frame: 3 }],
        frameRate: 1,
        repeat: 0,
      });

      scene.anims.create({
        key: "walk-down",
        frames: scene.anims.generateFrameNumbers("char_vefa_spritesheet", { start: 4, end: 5 }),
        frameRate: 6,
        repeat: -1,
      });

      scene.anims.create({
        key: "walk-up",
        frames: scene.anims.generateFrameNumbers("char_vefa_spritesheet", { start: 8, end: 9 }),
        frameRate: 6,
        repeat: -1,
      });

      scene.anims.create({
        key: "walk-left",
        frames: scene.anims.generateFrameNumbers("char_vefa_spritesheet", { start: 12, end: 13 }),
        frameRate: 8,
        repeat: -1,
      });

      scene.anims.create({
        key: "walk-right",
        frames: scene.anims.generateFrameNumbers("char_vefa_spritesheet", { start: 16, end: 17 }),
        frameRate: 8,
        repeat: -1,
      });

      // Créer le sprite animé
      const player = scene.add.sprite(x, y, "char_vefa_spritesheet");
      player.play("idle-down");
      return player;
    }
  }

  static updatePlayerMovement(scene) {
    let isMoving = false;

    // Reset velocity
    scene.player.body.setVelocity(0);

    // Déplacement avec velocity au lieu de position directe
    if (scene.cursors.left.isDown) {
      scene.player.body.setVelocityX(-scene.moveSpeed);
      if (scene.player.anims) scene.player.anims.play("walk-left", true);
      scene.lastDirection = "left";
      isMoving = true;
    } else if (scene.cursors.right.isDown) {
      scene.player.body.setVelocityX(scene.moveSpeed);
      if (scene.player.anims) scene.player.anims.play("walk-right", true);
      scene.lastDirection = "right";
      isMoving = true;
    }

    if (scene.cursors.up.isDown) {
      scene.player.body.setVelocityY(-scene.moveSpeed);
      if (scene.player.anims) scene.player.anims.play("walk-up", true);
      scene.lastDirection = "up";
      isMoving = true;
    } else if (scene.cursors.down.isDown) {
      scene.player.body.setVelocityY(scene.moveSpeed);
      if (scene.player.anims) scene.player.anims.play("walk-down", true);
      scene.lastDirection = "down";
      isMoving = true;
    }

    // Animation idle
    if (!isMoving && scene.player.anims) {
      const idleDirection = scene.lastDirection || "down";
      scene.player.anims.play(`idle-${idleDirection}`, true);
    }

    // Gestion du son
    if (isMoving && !scene.wasMoving) {
      if (!scene.footstepSound.isPlaying) {
        scene.footstepSound.play();
      }
    } else if (!isMoving && scene.wasMoving) {
      scene.footstepSound.stop();
    }
    scene.wasMoving = isMoving;
  }

  static playerFadeout(scene, currentPlayer) {
    scene.tweens.add({
      targets: currentPlayer,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        currentPlayer.setVisible(false);
      },
    });
  }

  static setupCompletePlayer(scene, x, y, selectedCharacter, speed = 135, footstepSoundKey) {
    const player = this.createPlayer(scene, x, y, selectedCharacter);
    this.addBreathingAnimation(scene, player);
    this.createPlayerMovement(scene, player, speed, footstepSoundKey);
    this.setupPlayerDialogue(scene);
    return player;
  }
}
