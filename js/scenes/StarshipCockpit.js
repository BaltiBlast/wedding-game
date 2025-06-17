class StartshipCockpit extends Phaser.Scene {
  constructor() {
    super({ key: "StartshipCockpit" });
  }

  // ------------------------------------------------------------------------------------------ //
  // PRELOAD SCENE
  // ------------------------------------------------------------------------------------------ //
  preload() {
    // Image
    this.load.image("bg_cockpit", "assets/images/cockpit/bg_cockpit.png");

    // Spritesheets
    this.load.spritesheet("bg_cockpit_danger_spritsheet", "assets/images/cockpit/bg_cockpit_danger_spritsheet.png", {
      frameWidth: 1024,
      frameHeight: 761,
    });

    this.load.spritesheet("light1_spritesheet", "assets/images/cockpit/light1_spritesheet.png", {
      frameWidth: 55,
      frameHeight: 50,
    });

    this.load.spritesheet("light2_spritesheet", "assets/images/cockpit/light2_spritesheet.png", {
      frameWidth: 64,
      frameHeight: 55,
    });

    this.load.spritesheet("holo_planet_spritesheet", "assets/images/cockpit/holo_planet_spritesheet.png", {
      frameWidth: 118,
      frameHeight: 142,
    });
    // Audio
    this.load.audio("mus_cockpit_theme", "assets/sounds/cockpit/mus_cockpit_theme.mp3");
    this.load.audio("sfx_alarm", "assets/sounds/cockpit/sfx_alarm.mp3");
    this.load.audio("mus_launch_starship", "assets/sounds/cockpit/mus_launch_starship.mp3");
    this.load.audio("sfx_impact", "assets/sounds/cockpit/sfx_impact.wav");
  }

  // ------------------------------------------------------------------------------------------ //
  // CREATE SCENE
  // ------------------------------------------------------------------------------------------ //
  create() {
    // Scene transition
    this.setupTransition();

    // Background
    this.add.image(512, 512, "bg_cockpit");

    // Audio setup
    this.setupAudio();

    // Submit form listener / intercepter
    window.addEventListener("formSubmitted", this.onFormSubmitted.bind(this));
  }

  // ------------------------------------------------------------------------------------------ //
  // SCENE TRANSITION SETUP
  // ------------------------------------------------------------------------------------------ //
  setupTransition() {
    SceneManager.fadeInScene(this);
    this.cameras.main.once("camerafadeincomplete", () => {
      this.fadeInForm();
    });
  }

  // ------------------------------------------------------------------------------------------ //
  // AUDIO SETUP
  // ------------------------------------------------------------------------------------------ //
  setupAudio() {
    this.musicLevel = AudioManager.playMusic(this, "mus_cockpit_theme", 0.05);
  }

  // ------------------------------------------------------------------------------------------ //
  // DECORATIVE ELEMENTS SETUP
  // ------------------------------------------------------------------------------------------ //
  createDecorativeElements() {
    // Cockpit animation
    this.anims.create({
      key: "bg_cockpit_danger_spritsheet",
      frames: this.anims.generateFrameNumbers("bg_cockpit_danger_spritsheet", { start: 0, end: 1 }),
      frameRate: 0.6,
      repeat: -1,
    });

    this.cockpitDanger = this.add.sprite(512, 381, "bg_cockpit_danger_spritsheet");
    this.cockpitDanger.play("bg_cockpit_danger_spritsheet");

    // Light 1 animation
    this.anims.create({
      key: "light1_spritesheet",
      frames: this.anims.generateFrameNumbers("light1_spritesheet", { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1,
    });

    this.light1 = this.add.sprite(857, 730, "light1_spritesheet");
    this.light1.play("light1_spritesheet");

    // Light 2 animation
    this.anims.create({
      key: "light2_spritesheet",
      frames: this.anims.generateFrameNumbers("light2_spritesheet", { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });

    this.light2 = this.add.sprite(942, 748, "light2_spritesheet");
    this.light2.play("light2_spritesheet");

    // Hologram planet
    this.anims.create({
      key: "holo_planet_spritesheet",
      frames: this.anims.generateFrameNumbers("holo_planet_spritesheet", { start: 0, end: 1 }),
      frameRate: 1.2,
      repeat: -1,
    });

    this.light2 = this.add.sprite(75, 785, "holo_planet_spritesheet");
    this.light2.play("holo_planet_spritesheet");
  }

  // ------------------------------------------------------------------------------------------ //
  // MISSION DISPLAY - PHASER TEXT + CURSOR + MESSAGES
  // ------------------------------------------------------------------------------------------ //
  displayMissionMessages() {
    this.missionMessages = [
      { text: "> Données reçues.", delay: 1000 },
      { text: "> Calculs en cours...", delay: 3000 },
      { text: "> Anomalie détectée.", delay: 500 },
      { text: "> Instabilité gravitationnelle.", delay: 800 },
    ];

    this.messageStartX = 325;
    this.messageStartY = 627;
    this.messageLineHeight = 25;
    this.messageTexts = [];

    // Curseur
    this.cursorVisible = true;
    this.cursor = this.add.text(this.messageStartX, this.messageStartY, "|", {
      font: "20px monospace",
      fill: "#00ff88",
    });

    this.cursorTimer = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.cursorVisible = !this.cursorVisible;
        this.cursor.setVisible(this.cursorVisible);
      },
    });

    this.printLine(0);
  }

  displayLaunchCountdown() {
    this.missionMessages = [
      { text: "> Contournement du protocole...", delay: 500 },
      { text: "> Décollage forcé imminent.", delay: 1000 },
      { text: "> 10", delay: 2750 },
      { text: "> 9", delay: 2750 },
      { text: "> 8", delay: 2500 },
      { text: "> 7", delay: 2500 },
      { text: "> 6", delay: 2500 },
      { text: "> 5", delay: 0 },
      { text: "> Moteur principal allumé", delay: 1350 },
      { text: "> 4", delay: 1600 },
      { text: "> 3", delay: 1600 },
      { text: "> 2", delay: 1600 },
      { text: "> 1", delay: 1000 },
    ];

    this.messageStartX = 325;
    this.messageStartY = 627;
    this.messageLineHeight = 25;
    this.messageTexts = [];

    this.cursorVisible = true;
    this.cursor = this.add.text(this.messageStartX, this.messageStartY, "|", {
      font: "20px monospace",
      fill: "#00ff88",
    });

    this.cursorTimer = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.cursorVisible = !this.cursorVisible;
        this.cursor.setVisible(this.cursorVisible);
      },
    });

    this.printLine(0);
  }

  printLine(lineIndex) {
    const messages = this.missionMessages;
    if (lineIndex >= messages.length) return;

    const { text: message, delay } = messages[lineIndex];
    const x = this.messageStartX;
    const visibleIndex = Math.min(this.messageTexts.length, 6);
    const y = this.messageStartY + visibleIndex * this.messageLineHeight;

    let currentText = "";
    const textObject = this.add.text(x, y, "", {
      font: "20px monospace",
      fill: "#00ff88",
    });

    this.messageTexts.push(textObject);

    if (this.messageTexts.length > 6) {
      const oldText = this.messageTexts.shift();
      this.tweens.add({
        targets: oldText,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          oldText.destroy();
        },
      });

      this.messageTexts.forEach((text, i) => {
        this.tweens.add({
          targets: text,
          y: this.messageStartY + i * this.messageLineHeight,
          duration: 200,
          ease: "Linear",
        });
      });

      this.tweens.add({
        targets: this.cursor,
        y: this.messageStartY + this.messageTexts.length * this.messageLineHeight,
        duration: 200,
        ease: "Linear",
      });
    }

    let charIndex = 0;

    const charTimer = this.time.addEvent({
      delay: 30,
      loop: true,
      callback: () => {
        currentText += message[charIndex];
        textObject.setText(currentText);
        this.cursor.setY(textObject.y + this.messageLineHeight);

        charIndex++;

        if (charIndex >= message.length) {
          charTimer.remove(false);
          this.time.delayedCall(delay, () => {
            this.printLine(lineIndex + 1);
          });
        }
      },
    });
  }

  clearMissionDisplay() {
    const fadeDuration = 400;

    // Fade out progressif des textes
    this.messageTexts.forEach((text) => {
      this.tweens.add({
        targets: text,
        alpha: 0,
        duration: fadeDuration,
        onComplete: () => {
          text.destroy();
        },
      });
    });

    this.messageTexts = [];

    // Curseur
    if (this.cursor) {
      this.tweens.add({
        targets: this.cursor,
        alpha: 0,
        duration: fadeDuration,
        onComplete: () => {
          this.cursor.destroy();
          this.cursor = null;
        },
      });
    }

    // Timer du curseur
    if (this.cursorTimer) {
      this.cursorTimer.remove();
      this.cursorTimer = null;
    }
  }

  // ------------------------------------------------------------------------------------------ //
  // FORM SUBMISSION HANDLER
  // ------------------------------------------------------------------------------------------ //

  onFormSubmitted(e) {
    // const data = e.detail.data;
    // WIP / TODO -> send data object to back
    this.registry.set("fromCockpit", true);

    this.cameras.main.shake(250, 0.02);
    AudioManager.playSound(this, "sfx_impact", 0.5);
    AudioManager.stopCurrentMusic();
    this.fadeOutForm();

    this.createDecorativeElements();

    // Animation
    GameUtils.delayCall(this, 800, this.displayMissionMessages, this);
    GameUtils.delayCall(this, 4000, () => AudioManager.playSound(this, "mus_launch_starship", 0.2), this);
    GameUtils.delayCall(this, 12000, this.clearMissionDisplay, this);
    GameUtils.delayCall(this, 13000, this.displayLaunchCountdown, this);
    GameUtils.delayCall(this, 25000, () => {
      this.loopedLaunchSound = this.sound.add("sfx_alarm", {
        loop: true,
        volume: 0.2,
      });
      this.loopedLaunchSound.play();
    });

    GameUtils.delayCall(
      this,
      38700,
      () => {
        if (this.loopedLaunchSound && this.loopedLaunchSound.isPlaying) {
          this.loopedLaunchSound.stop();
        }
      },
      this
    );

    GameUtils.delayCall(this, 38750, () => this.scene.stop("StartshipCockpit"), this);
    GameUtils.delayCall(this, 38750, () => this.scene.wake("Level2"), this);
  }

  fadeOutForm() {
    const form = document.getElementById("form_starship");
    const display = document.getElementById("cockpit-display");

    this.tweens.add({
      targets: { alpha: 1 },
      alpha: 0,
      duration: 100,
      onUpdate: (tween) => {
        const val = tween.getValue();
        form.style.opacity = val;
        display.style.opacity = val;
      },
      onComplete: () => {
        form.style.display = "none";
        display.style.display = "none";
      },
    });
  }

  fadeInForm() {
    const form = document.getElementById("form_starship");
    const display = document.getElementById("cockpit-display");

    if (!form || !display) {
      this.time.delayedCall(50, () => this.fadeInForm());
      return;
    }

    form.style.display = "block";
    display.style.display = "block";
    form.style.opacity = 0;
    display.style.opacity = 0;

    this.tweens.add({
      targets: { alpha: 0 },
      alpha: 1,
      duration: 800,
      onUpdate: (tween) => {
        const val = tween.getValue();
        form.style.opacity = val;
        display.style.opacity = val;
      },
    });
  }
}
