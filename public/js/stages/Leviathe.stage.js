class Leviathe extends Phaser.Scene {
  constructor() {
    super({ key: "Leviathe" });
  }

  // ------------------------------------------------------------------------------------------ //
  // PRELOAD SCENE
  // ------------------------------------------------------------------------------------------ //
  preload() {
    // Images
    this.load.image("bg_level3", "../assets/images/level3/bg_level3.png");
    this.load.image("prop_palm1", "../assets/images/level3/prop_palm1.png");
    this.load.image("prop_palm2", "../assets/images/level3/prop_palm2.png");
    this.load.image("prop_palm3", "../assets/images/level3/prop_palm3.png");
    this.load.image("prop_crashed_spaceship", "../assets/images/level3/prop_crashed_spaceship.png");
    this.load.image("prop_spaceship", "../assets/images/level2/prop_spaceship.png");
    this.load.image("char_alexis", "../assets/images/characters/char_alexis_game.png");
    this.load.image("char_vefa", "../assets/images/characters/char_vefa_game.png");
    this.load.image("prop_heart", "../assets/images/level3/prop_heart.png");
    this.load.image("char_alexis_portrait", "../assets/images/characters/char_alexis_portrait.png");
    this.load.image("char_vefa_portrait", "../assets/images/characters/char_vefa_portrait.png");

    // Spritesheets
    this.load.spritesheet("char_alexis_spritesheet", "../assets/images/characters/char_alexis_spritesheet.png", {
      frameWidth: 270,
      frameHeight: 600,
    });

    this.load.spritesheet("char_vefa_spritesheet", "../assets/images/characters/char_vefa_spritesheet.png", {
      frameWidth: 270,
      frameHeight: 600,
    });

    this.load.spritesheet("fx_fire_animation", "../assets/images/title_screen/fx_fire_animation.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    // Audio
    this.load.audio("mus_level3", "../assets/sounds/level3/mus_level3.mp3");
    this.load.audio("sfx_landing_starchip", "../assets/sounds/level3/sfx_landing_starship.wav");
    this.load.audio("sfx_landing_reactor", "../assets/sounds/level3/sfx_starship_reactor.wav");
    this.load.audio("fx_enter_door", "../assets/sounds/level2/fx_enter_door.wav");
    this.load.audio("sfx_footstep_grass", "../assets/sounds/step_walk/sfx_footstep_grass.mp3");
    this.load.audio("sfx_surprised", "../assets/sounds/level3/sfx_surprised.wav");
    this.load.audio("sfx_kiss", "../assets/sounds/level3/sfx_kiss.wav");
  }

  // ------------------------------------------------------------------------------------------ //
  // CREATE SCENE
  // ------------------------------------------------------------------------------------------ //
  create() {
    this.currentPlayer = this.registry.get("selectedCharacter");

    // Scene transition
    this.setupTransition();

    AudioManager.setBackgroundMusic(this, "mus_level3", 0.15, true);

    // Background
    this.add.image(512, 512, "bg_level3");

    // Show stage banner
    StageBanner.showStageBanner(this, "Léviathe", 2600);

    this.createObstacles();

    this.landingStarShipAnimation();

    this.createPlayerDialogue();
  }

  // ------------------------------------------------------------------------------------------ //
  // SCENE TRANSITION SETUP
  // ------------------------------------------------------------------------------------------ //
  setupTransition() {
    SceneManager.fadeInScene(this);
  }

  // ------------------------------------------------------------------------------------------ //
  // OBSTACLES SETUP
  // ------------------------------------------------------------------------------------------ //
  createObstacles() {
    // Trees
    this.add.image(650, 700, "prop_crashed_spaceship").setOrigin(0.5, 1).setScale(1);
    // this.add.image(220, 720, "prop_spaceship").setOrigin(0.5, 1).setScale(0.26).setFlipX(true);
    this.add.image(230, 515, "prop_palm1").setOrigin(0.5, 1).setScale(1);
    this.add.image(380, 320, "prop_palm2").setOrigin(0.5, 1).setScale(1);
    this.add.image(510, 690, "prop_palm3").setOrigin(0.5, 1).setScale(1);

    if (this.currentPlayer === "Alexis") {
      this.add.image(400, 620, "char_vefa").setOrigin(0.5, 1).setScale(0.15);
    } else {
      this.add.image(400, 620, "char_alexis").setOrigin(0.5, 1).setScale(0.55);
    }
  }

  landingStarShipAnimation() {
    this.anims.create({
      key: "flame_burn",
      frames: this.anims.generateFrameNumbers("fx_fire_animation", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    const flameBack = this.add.sprite(-100, -117, "fx_fire_animation").setScale(2.5).play("flame_burn").setFlipY(true);
    const ship = this.add.image(-150, -100, "prop_spaceship").setOrigin(0.5, 1).setScale(0.26).setFlipX(true);
    const flameFront = this.add.sprite(-207, -117, "fx_fire_animation").setScale(2.5).play("flame_burn").setFlipY(true);

    this.shipContainer = this.add.container(400, -100, [flameBack, ship, flameFront]);
    this.shipContainer.setDepth(1000);

    // Démarre le son de réacteur
    AudioManager.setBackgroundMusic(this, "sfx_landing_reactor", 0.05, false);

    // Descente rapide
    this.tweens.add({
      targets: this.shipContainer,
      y: 700,
      duration: 3000,
      ease: "Sine.easeOut",
      onComplete: () => {
        const floatY = this.shipContainer.y;

        // Flottement stationnaire prolongé
        this.tweens.add({
          targets: this.shipContainer,
          y: floatY + 5,
          yoyo: true,
          repeat: 6, // plus long qu'avant
          duration: 220,
          ease: "Sine.easeInOut",
          onComplete: () => {
            // Descente douce au sol
            this.tweens.add({
              targets: this.shipContainer,
              y: 820,
              duration: 500,
              ease: "Sine.easeIn",
              onComplete: () => {
                // Début du fade-out du son des réacteurs
                AudioManager.stopBackgroundMusic(this, "sfx_landing_reactor", 500);

                // 💥 ➤ C'est ici que tu peux jouer le son d'impact de l'atterrissage
                AudioManager.playSoundEffects(this, "sfx_landing_starchip", 0.3, false);

                // Rebond après impact
                this.tweens.add({
                  targets: this.shipContainer,
                  y: 805,
                  duration: 160,
                  ease: "Quad.easeOut",
                  onComplete: () => {
                    this.tweens.add({
                      targets: this.shipContainer,
                      y: 820,
                      duration: 160,
                      ease: "Quad.easeIn",
                      onComplete: () => {
                        flameBack.destroy();
                        flameFront.destroy();
                        this.spawnPlayerFromShip();
                      },
                    });
                  },
                });
              },
            });
          },
        });
      },
    });
  }

  spawnPlayerFromShip() {
    this.time.delayedCall(1000, () => {
      AudioManager.playSoundEffects(this, "fx_enter_door", 0.3, false);

      // Création du joueur via le manager
      this.player = PlayerManager.createPlayer(this, 300, 700, this.currentPlayer).setScale(0.15);
      this.player.setAlpha(0);

      AudioManager.playSoundEffects(this, "sfx_footstep_grass", 0.15, false);

      this.tweens.add({
        targets: this.player,
        alpha: 1,
        duration: 300,
        onComplete: () => {
          // Une fois apparu, on le fait marcher vers le bas
          this.player.play("walk-up");

          this.tweens.add({
            targets: this.player,
            y: 650,
            x: 400,
            duration: 1000,
            ease: "Linear",
            onUpdate: () => {
              this.player.setDepth(this.player.y);
            },
            onComplete: () => {
              PlayerManager.stopPlayer(this); // Arrête le mouvement + animation idle-down
              this.player.setFrame(1);
              this.NPCDialogue();
            },
          });
        },
      });
    });
  }

  NPCDialogue() {
    // 1. Attendre 1.5 seconde avant d’afficher le dialogue complet
    this.time.delayedCall(500, () => {
      this.playerDialogueBox.setVisible(true);
      this.playerPortraitFrame.setVisible(true);
      this.playerPortrait.setVisible(true);
      this.playerCharacterName.setVisible(true);
      this.playerDialogueText.setVisible(true);

      this.playerPortrait.setTexture(this.currentPlayer === "Vefa" ? "char_alexis_portrait" : "char_vefa_portrait");
      this.playerCharacterName.setText(this.currentPlayer === "Vefa" ? "Alexis" : "Jenovefa");

      this.playerDialogueText.setText(
        "Tu es enfin là...\nMon vaisseau s’est écrasé à l’atterrissage… J’ai cru que je n’allais jamais pouvoir rentrer.\nHeureusement que t’es venu me chercher.\nOn a un mariage à préparer, non ?"
      );

      // 2. Après 5 secondes : fade out + animation + son + coeur animé
      this.time.delayedCall(6000, () => {
        this.tweens.add({
          targets: [
            this.playerDialogueBox,
            this.playerPortraitFrame,
            this.playerPortrait,
            this.playerCharacterName,
            this.playerDialogueText,
          ],
          alpha: 0,
          duration: 400,
          onComplete: () => {
            this.playerDialogueBox.setVisible(false);
            this.playerPortraitFrame.setVisible(false);
            this.playerPortrait.setVisible(false);
            this.playerCharacterName.setVisible(false);
            this.playerDialogueText.setVisible(false);
            this.playerDialogueBox.setAlpha(1);
            this.playerPortraitFrame.setAlpha(1);
            this.playerPortrait.setAlpha(1);
            this.playerCharacterName.setAlpha(1);
            this.playerDialogueText.setAlpha(1);

            // Shake des deux personnages
            this.tweens.add({
              targets: [this.player, this.rescueChar],
              x: "+=5",
              yoyo: true,
              repeat: 3,
              duration: 50,
            });

            // Son de bisou
            AudioManager.playSoundEffects(this, "sfx_kiss", 0.5, false);

            // Ajout d'un petit coeur animé
            const heart = this.add.image(400, 620, "prop_heart").setScale(0.03).setDepth(2000);
            this.tweens.add({
              targets: heart,
              y: heart.y - 50,
              alpha: 0,
              duration: 1500,
              ease: "Sine.easeOut",
              onComplete: () => {
                heart.destroy();
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.scene.start("Ending");
              },
            });
          },
        });
      });
    });
  }

  createPlayerDialogue() {
    this.playerDialogueBox = this.add
      .rectangle(512, 850, 900, 180, 0x1a1a2e, 0.8)
      .setStrokeStyle(4, 0x64ffda)
      .setDepth(1000)
      .setVisible(false);

    this.playerPortraitFrame = this.add
      .rectangle(244, 850, 120, 120, 0x2d4a22, 1)
      .setStrokeStyle(3, 0x64ffda)
      .setDepth(1000)
      .setVisible(false);

    this.playerPortrait = this.add.image(250, 855, "").setScale(0.5).setDepth(1000).setVisible(false);

    this.playerCharacterName = this.add
      .text(244, 930, "", {
        fontSize: "16px",
        fill: "#64FFDA",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setVisible(false);

    this.playerDialogueText = this.add
      .text(750, 850, "", {
        fontSize: "18px",
        fill: "#ffffff",
        align: "left",
        wordWrap: { width: 400 },
      })
      .setOrigin(1, 0.5)
      .setDepth(1000)
      .setVisible(false);
  }
}
