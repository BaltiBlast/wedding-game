class GameUtils {
  static delayCall(scene, delay, callback, context = null, args = []) {
    scene.time.delayedCall(delay, callback, args, context);
  }
}
