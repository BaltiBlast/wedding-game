class AudioManager {
  static playSound(scene, soundKey, volume, loop = false) {
    const sound = scene.sound.add(soundKey, {
      volume: volume,
      loop: loop,
    });

    sound.play();
    return sound;
  }

  static playSoundFadeIn(scene, soundKey, targetVolume = 1, duration = 1000, loop = false) {
    const sound = scene.sound.add(soundKey, {
      volume: 0,
      loop: loop,
    });

    sound.play();

    scene.tweens.add({
      targets: sound,
      volume: targetVolume,
      duration: duration,
      ease: "Linear",
    });

    return sound;
  }

  static stopSoundFadeOut(scene, sound, duration = 1000) {
    scene.tweens.add({
      targets: sound,
      volume: 0,
      duration: duration,
      ease: "Linear",
      onComplete: () => {
        sound.stop();
      },
    });
  }

  static stopAllSounds(scene) {
    scene.sound.stopAll();
  }

  static playMusic(scene, musicKey, volume = 0.5) {
    return this.playSound(scene, musicKey, volume, true);
  }

  static playMusicFadeIn(scene, musicKey, targetVolume = 0.5, duration = 1000) {
    return this.playSoundFadeIn(scene, musicKey, targetVolume, duration, true);
  }
}
