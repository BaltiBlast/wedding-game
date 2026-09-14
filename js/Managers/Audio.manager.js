// ======================================================================== //
// USAGE
//
// 1. Add in scene's create
// Audio setup
// this.setupAudio();
//
// 2. Add the method you need where you need it
//
// -- use for audio (music)
// AudioManager.playMusic(this, key, volume, loop);
// explains : this = scene // key = "music_lvl" // volume = level musique // loop = music loopable
//
// -- use for play sound (sfx - sound effect)
// AudioManager.playSound(this, key, volume);
// explains this = scene // key = "sfx_sound" // volume = level sound
//
// -- use for stop audio (music)
// AudioManager.stopMusic(key);
// explains this = scene // key = "music_lvl"
// ======================================================================== //

class AudioManager {
  static musicFadeDuration = 1500;
  static music = {};

  static playMusic(scene, key, volume = 1, loop = true) {
    if (this.music[key]) return this.music[key].sound;

    const sound = scene.sound.add(key, { volume: 0, loop });
    const entry = { sound, events: scene.game.events, cancelFade: null };
    this.music[key] = entry;
    const cleanup = () => {
      if (entry.cancelFade) entry.cancelFade();
      entry.events.off("destroy", destroy);
      if (this.music[key] === entry) delete this.music[key];
    };
    const destroy = () => sound.destroy();
    sound.once("destroy", cleanup);
    sound.once("complete", destroy);
    entry.events.once("destroy", destroy);
    sound.play();
    this.fadeMusic(entry, volume);
    return sound;
  }

  static stopMusic(key, onComplete) {
    const entry = this.music[key];
    if (!entry) {
      if (onComplete) onComplete();
      return;
    }
    this.fadeMusic(entry, 0, () => {
      entry.sound.stop();
      entry.sound.destroy();
      if (onComplete) onComplete();
    });
  }

  static fadeMusic(entry, volume, onComplete) {
    if (entry.cancelFade) entry.cancelFade();
    const startVolume = entry.sound.volume;
    let elapsed = 0;
    const update = (time, delta) => {
      elapsed += delta;
      const progress = Math.min(elapsed / this.musicFadeDuration, 1);
      entry.sound.setVolume(startVolume + (volume - startVolume) * progress);
      if (progress === 1) {
        entry.cancelFade();
        if (onComplete) onComplete();
      }
    };
    entry.cancelFade = () => {
      entry.events.off("step", update);
      entry.cancelFade = null;
    };
    entry.events.on("step", update);
  }

  //-------------------------------------------------------------------------------------------- //
  static sounds = {};

  //-------------------------------------------------------------------------------------------- //
  static setBackgroundMusic(scene, key, volume = 1) {
    const fadeInDuration = 1500;
    const loop = true;

    const sound = scene.sound.add(key, {
      volume: 0,
      loop,
    });

    sound.play();
    sound.loop = loop;
    const volumeProxy = { value: 0 };

    scene.tweens.add({
      targets: volumeProxy,
      value: volume,
      duration: fadeInDuration,
      ease: "Linear",
      onUpdate: () => {
        sound.setVolume(volumeProxy.value);
      },
    });

    this.sounds[key] = sound;
  }

  //-------------------------------------------------------------------------------------------- //
  static playSound(scene, key, volume = 1) {
    return scene.sound.play(key, { volume, loop: false });
  }

  //-------------------------------------------------------------------------------------------- //
  static stopBackgroundMusic(scene, key) {
    const fadeOutDuration = 500;
    const sound = this.sounds[key];

    if (!sound) return;
    const volumeProxy = { value: sound.volume ?? 1 };

    scene.tweens.add({
      targets: volumeProxy,
      value: 0,
      duration: fadeOutDuration,
      ease: "Linear",
      onUpdate: () => {
        sound.setVolume(volumeProxy.value);
      },
      onComplete: () => {
        sound.stop();

        delete this.sounds[key];
      },
    });
  }
}
