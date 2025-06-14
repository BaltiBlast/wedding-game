const sceneDurationDefault = 2000;

class SceneManager {
  static fadeInScene(scene, duration = sceneDurationDefault, r = 0, g = 0, b = 0) {
    scene.cameras.main.fadeIn(duration, r, g, b);
  }

  static fadeOutScene(scene, duration = sceneDurationDefault, r = 0, g = 0, b = 0) {
    scene.cameras.main.fadeOut(duration, r, g, b);
  }

  static changeSceneWithFade(currentScene, nextSceneKey, fadeOutDuration = sceneDurationDefault) {
    this.fadeOutScene(currentScene, fadeOutDuration);
    currentScene.cameras.main.once("camerafadeoutcomplete", () => {
      currentScene.scene.start(nextSceneKey);
    });
  }

  static restartSceneWithFade(scene, fadeOutDuration = sceneDurationDefault) {
    this.fadeOutScene(scene, fadeOutDuration);
    scene.cameras.main.once("camerafadeoutcomplete", () => {
      scene.scene.restart();
    });
  }

  static showElementWithDelay(scene, element, delay = 0, duration = sceneDurationDefault, targetAlpha = 1) {
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
