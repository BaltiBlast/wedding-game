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
// AudioManager.setBackgroundMusic(this, key, volume, loop);
// explains : this = scene // key = "music_lvl" // volume = level musique // loop = music loopable
//
// -- use for play sound (sfx - sound effect)
// AudioManager.playSoundEffects(this, key, volume, loop);
// explains this = scene // key = "sfx_sound" // volume = level sound // loop = sound loopable
//
// -- use for stop audio (music)
// AudioManager.stopBackgroundMusic(this, key);
// explains this = scene // key = "music_lvl"
// ======================================================================== //

class AudioManager {
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
  static playSoundEffects(scene, key, volume = 1, loop = false) {
    const sound = scene.sound.add(key, {
      volume: volume,
      loop: loop,
    });
    sound.play();
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
