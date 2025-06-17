const audioDurationDefault = 2000;

class AudioManager {
  static playSound(scene, soundKey, volume, loop = false) {
    const sound = scene.sound.add(soundKey, {
      volume: volume,
      loop: loop,
    });

    sound.play();
    return sound;
  }

  static playSoundFadeIn(scene, soundKey, targetVolume = 1, duration = audioDurationDefault, loop = false) {
    const sound = scene.sound.add(soundKey, {
      volume: 0,
      loop: loop,
    });

    sound.play();

    const volume = 0;

    scene.tweens.add({
      targets: sound,
      volume: targetVolume,
      duration: duration,
      ease: "Linear",
      onUpdate: () => {
        sound.setVolume(volume);
      },
    });

    return sound;
  }

  static stopSoundFadeOut(scene, sound, duration = audioDurationDefault) {
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

  static stopCurrentMusic() {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  static playMusic(scene, musicKey, volume = 0.5) {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.currentMusic.stop();
    }

    this.currentMusic = this.playSound(scene, musicKey, volume, true);
    return this.currentMusic;
  }

  static playMusicFadeIn(scene, musicKey, targetVolume = 0.5, duration = audioDurationDefault) {
    return this.playSoundFadeIn(scene, musicKey, targetVolume, duration, true);
  }
}
