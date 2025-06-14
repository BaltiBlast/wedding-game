const durationDefault = 2000;

class SceneManager {
  static fadeInScene(scene, duration = durationDefault, r = 0, g = 0, b = 0) {
    scene.cameras.main.fadeIn(duration, r, g, b);
  }

  static fadeOutScene(scene, duration = durationDefault, r = 0, g = 0, b = 0) {
    scene.cameras.main.fadeOut(duration, r, g, b);
  }

  static changeSceneWithFade(currentScene, nextSceneKey, fadeOutDuration = durationDefault) {
    this.fadeOutScene(currentScene, fadeOutDuration);
    currentScene.cameras.main.once("camerafadeoutcomplete", () => {
      currentScene.scene.start(nextSceneKey);
    });
  }

  static restartSceneWithFade(scene, fadeOutDuration = durationDefault) {
    this.fadeOutScene(scene, fadeOutDuration);
    scene.cameras.main.once("camerafadeoutcomplete", () => {
      scene.scene.restart();
    });
  }

  static showElementWithDelay(scene, element, delay = 0, duration = durationDefault, targetAlpha = 1) {
    scene.time.delayedCall(delay, () => {
      scene.tweens.add({
        targets: element,
        alpha: targetAlpha,
        duration: duration,
        ease: "Sine.easeOut",
      });
    });
  }
}
