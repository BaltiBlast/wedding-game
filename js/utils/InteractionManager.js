class InteractionManager {
  static checkProximity(scene, object, nearProperty, distance, onEnter, onExit) {
    if (!scene.player || !object) return;

    const playerX = scene.player.x;
    const playerY = scene.player.y;
    const objectX = object.x;
    const objectY = object.y;

    const actualDistance = Math.sqrt(Math.pow(playerX - objectX, 2) + Math.pow(playerY - objectY, 2));

    const wasNear = scene[nearProperty];
    const isNear = actualDistance <= distance;

    if (isNear && !wasNear) {
      // Just entered proximity
      scene[nearProperty] = true;
      if (onEnter) onEnter();
    } else if (!isNear && wasNear) {
      // Just exited proximity
      scene[nearProperty] = false;
      if (onExit) onExit();
    }
  }

  static checkButtonHover(scene, button, hoverProperty, onHover, onOut) {
    if (!button || !button.input) return;

    const wasHovering = scene[hoverProperty];
    const isHovering =
      button.input.enabled &&
      scene.input.activePointer.x >= button.x - button.width / 2 &&
      scene.input.activePointer.x <= button.x + button.width / 2 &&
      scene.input.activePointer.y >= button.y - button.height / 2 &&
      scene.input.activePointer.y <= button.y + button.height / 2;

    if (isHovering && !wasHovering) {
      scene[hoverProperty] = true;
      if (onHover) onHover();
    } else if (!isHovering && wasHovering) {
      scene[hoverProperty] = false;
      if (onOut) onOut();
    }
  }
}

// Fonctions globales pour compatibilité (si tu préfères)
function checkProximity(scene, object, nearProperty, distance, onEnter, onExit) {
  InteractionManager.checkProximity(scene, object, nearProperty, distance, onEnter, onExit);
}

function checkButtonHover(scene, button, hoverProperty, onHover, onOut) {
  InteractionManager.checkButtonHover(scene, button, hoverProperty, onHover, onOut);
}
