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
// AudioManager.setBackgroundMusic(this, key, volume, loop, fadeInDuration);
// explains : this = scene // key = "music_lvl" // volume = level musique // loop = music loopable // fadeInDuration = fade in if > 0
//
// -- use for stop audio (music)
// AudioManager.stopBackgroundMusic(this, key, fadeOutDuration);
// explains this = scene // key = "music_lvl" // fadeInDuration = fade out if > 0
//
// -- use for play sound (sfx - sound effect)
// AudioManager.playSoundEffects(this, key, fadeOutDuration);
// explains this = scene // key = "sfx_sound" // volume = level sound // loop = sound loopable
// ======================================================================== //

class AudioManager {
  //-------------------------------------------------------------------------------------------- //
  static sounds = {};

  //-------------------------------------------------------------------------------------------- //
  static setBackgroundMusic(scene, key, volume = 1, loop = true, fadeInDuration = 0) {
    const duration = fadeInDuration > 0 ? 0 : volume;

    const sound = scene.sound.add(key, {
      volume: duration,
      loop: loop,
    });

    if (fadeInDuration > 0) {
      scene.tweens.add({
        targets: sound,
        volume: volume,
        duration: fadeInDuration,
        ease: "Linear",
      });
    }

    sound.play();
    this.sounds[key] = sound;
  }

  //-------------------------------------------------------------------------------------------- //
  static stopBackgroundMusic(scene, key, fadeOutDuration = 0) {
    const sound = this.sounds[key];

    if (fadeOutDuration > 0) {
      scene.tweens.add({
        targets: sound,
        volume: 0,
        duration: fadeOutDuration,
        ease: "Linear",
        onComplete: () => {
          sound.stop();
          delete this.sounds[key];
        },
      });
    }
  }

  //-------------------------------------------------------------------------------------------- //
  static playSoundEffects(scene, key, volume = 1, loop = false) {
    const sound = scene.sound.add(key, {
      volume: volume,
      loop: loop,
    });
    sound.play();
  }
}
