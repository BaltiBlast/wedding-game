class ScreenEnding extends Phaser.Scene {
  constructor() {
    super({ key: "ScreenEnding" });
  }

  preload() {
    this.load.image("bg_starship_traveling", "assets/images/traveling/bg_starship_traveling.png");
    this.load.image("prop_spaceship", "assets/images/level2/prop_spaceship.png");
  }

  create() {
    // Scene transition
    this.setupTransition();

    // Animated background
    this.bg = this.add.tileSprite(0, 0, 1024, 1024, "bg_starship_traveling").setOrigin(0).setScrollFactor(0);
    this.bgScrollSpeed = 1;

    // Starship deplacement + animation
    this.starshipInit();
    this.createInvisibleWalls();

    // Lancer les crédits après 5 secondes (5000 ms)
    this.time.delayedCall(2000, () => {
      this.startCredits();
    });
  }
  update() {
    this.bg.tilePositionX += this.bgScrollSpeed;
    StarshipManager.updateMovement();
  }

  // ------------------------------------------------------------------------------------------ //
  // SCENE TRANSITION SETUP
  // ------------------------------------------------------------------------------------------ //
  setupTransition() {
    SceneManager.fadeInScene(this);
  }

  // ------------------------------------------------------------------------------------------ //
  // STARSHIP SETUP
  // ------------------------------------------------------------------------------------------ //
  starshipInit() {
    StarshipManager.createStarshipControls(this);
    this.player = StarshipManager.getSpaceship();

    // Position de départ : hors écran à gauche
    this.player.setPosition(-100, this.scale.height / 2);
    this.player.setScale(0.3);
    this.player.setFlipX(true);

    // Animation d’entrée : le vaisseau vole jusqu'à x = 150
    this.tweens.add({
      targets: this.player,
      x: 130,
      duration: 4000,
      ease: "Sine.easeInOut",
      onComplete: () => {
        // Optionnel : activer les contrôles ou déclencher autre chose une fois arrivé
      },
    });
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

  startCredits() {
    // Liste de lignes de crédits (placeholder)
    const creditLines = [
      "Un jeu réalisé par :",
      "Alexis & Vefa",
      "",
      "Scénario, level design & pixel props :",
      "Alexis",
      "",
      "Direction artistique & conseils :",
      "Vefa",
      "",
      "Programmation & intégration :",
      "Florian Fougeray (alias Balti)",
      "",
      "Remerciements :",
      "À toutes les personnes invitées à notre mariage.",
      "",
      "Merci de faire partie de cette aventure avec nous.",
      "",
      "Chaque réponse à ce jeu nous rapproche du grand jour.",
      "",
      "Encore merci à Balti pour le temps consacré à ce projet.",
      "",
      "Soutien moral :",
      "Nos chats, notre chien, et beaucoup d’amour 🐾💖",
      "",
      "Musique par scène :",
      "🎵 Écran titre : *Main Title* – Outer Wilds - Remastered by Balti",
      "🎵 Le Grand Départ : *Pelican Town* – Stardew Valley OST",
      "🎵 Transition Ascenseur : *Sawayakana Asa* – Cardcaptor Sakura OST",
      "🎵 La Tour : *Theme Song* – Kerbal Space Program",
      "🎵 Le Vaisseau : *Bubblegum K.K.* – Animal Crossing: New Horizons",
      "🎵 Décollage (cinématique) : Interstellar Blast off scene + Bip McDonald's",
      "🎵 Voyage dans l’espace : *Summer Morning Gaming*",
      "🎵 L’île + Crédits : A little pain - Remastered by Alexis",
    ];

    // Créer le conteneur
    this.creditsContainer = this.add.container(630, 1100); // positionné sous l'écran

    const lineHeight = 50;
    creditLines.forEach((text, index) => {
      const line = this.add
        .text(0, index * lineHeight, text, {
          font: "21px Arial",
          color: "#ffffff",
          align: "center",
        })
        .setOrigin(0.5);
      this.creditsContainer.add(line);
    });

    const totalHeight = creditLines.length * lineHeight;

    // Tweener pour déplacer tout le conteneur vers le haut
    this.tweens.add({
      targets: this.creditsContainer,
      y: -totalHeight,
      duration: 40000, // durée du scroll (en ms)
      ease: "Linear",
    });

    // Met à jour les alpha (opacité) pendant le scroll
    this.events.on("update", () => {
      this.creditsContainer.iterate((child) => {
        const screenY = child.getWorldTransformMatrix().ty;

        // Zone de fondu : entre 200 (bas) et 824 (haut)
        const fadeInStart = 200;
        const fadeOutStart = 824;
        const fadeRange = 100;

        if (screenY < fadeInStart) {
          child.alpha = 0;
        } else if (screenY < fadeInStart + fadeRange) {
          child.alpha = (screenY - fadeInStart) / fadeRange;
        } else if (screenY > fadeOutStart) {
          child.alpha = 0;
        } else if (screenY > fadeOutStart - fadeRange) {
          child.alpha = 1 - (screenY - (fadeOutStart - fadeRange)) / fadeRange;
        } else {
          child.alpha = 1;
        }
      });
    });

    // Afficher un message final après la fin des crédits
    // Affichage du message final après que le scroll est terminé
    this.time.delayedCall(40000, () => {
      const finalMessage = this.add
        .text(
          this.creditsContainer.x,
          this.scale.height / 2,
          "Merci d’être là le 27 septembre 2025\nà la salle des fêtes de Chieulles vers 16h\n\nLes faire-parts vous seront envoyés avec les précisions 🙂",
          {
            font: "24px Arial",
            color: "#ffffff",
            align: "center",
            wordWrap: { width: 800 },
          }
        )
        .setOrigin(0.5)
        .setAlpha(0);

      this.tweens.add({
        targets: finalMessage,
        alpha: 1,
        duration: 2000,
        ease: "Sine.easeInOut",
      });

      // (Facultatif) Fade out après 10s
      this.time.delayedCall(120000, () => {
        this.tweens.add({
          targets: finalMessage,
          alpha: 0,
          duration: 500,
          ease: "Sine.easeInOut",
        });
      });

      // Retour à l'écran titre après 2 minutes
      this.time.delayedCall(120000, () => {
        this.cameras.main.fadeOut(2000, 0, 0, 0); // 2s, noir
        this.time.delayedCall(2000, () => {
          this.registry.destroy();
          this.scene.start("ScreenTitle");
        });
      });
    });
  }
}
