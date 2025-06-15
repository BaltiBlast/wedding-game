class StartshipCockpit extends Phaser.Scene {
  constructor() {
    super({ key: "StartshipCockpit" });
  }

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
  }

  create() {
    // Scene transition
    this.setupTransition();

    // Background
    this.add.image(512, 512, "bg_cockpit");

    // Audio setup
    this.setupAudio();

    // 4. Écouter la soumission du formulaire (IMPORTANT)
    window.addEventListener("formSubmitted", this.onFormSubmitted.bind(this));
  }

  update() {}

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
    // this.musicLevel = AudioManager.playMusic(this, "mus_cockpit_theme", 0.05);
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
  // FORM GESTION SETUP
  // ------------------------------------------------------------------------------------------ //
  fadeOutForm(callback) {
    const form = document.getElementById("form_starship");
    const display = document.getElementById("cockpit-display");

    if (!form || !display) {
      if (callback) callback();
      return;
    }

    this.tweens.add({
      targets: { alpha: 1 },
      alpha: 0,
      duration: 600,
      onUpdate: (tween) => {
        const val = tween.getValue();
        form.style.opacity = val;
        display.style.opacity = val;
      },
      onComplete: () => {
        form.style.display = "none";
        display.style.display = "none";
        if (callback) callback();
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
      duration: 600,
      onUpdate: (tween) => {
        const val = tween.getValue();
        form.style.opacity = val;
        display.style.opacity = val;
      },
    });
  }

  onFormSubmitted(e) {
    const data = e.detail.data;
    console.log("Phaser a reçu le formulaire :", data);

    this.createDecorativeElements();
    this.musicLevel = AudioManager.playMusic(this, "sfx_alarm", 0.05);

    this.time.delayedCall(5000, () => {
      this.fadeOutForm(() => {
        this.scene.resume("Level2");
        this.scene.stop("StartshipCockpit");
      });
    });
  }
}
