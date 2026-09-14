class ObstacleManager {
  static createObstacle(scene, x, y, texture, options) {
    const { scale = 1, size, offset = { x, y } } = options;
    const { width, height } = size;

    const obj = scene.add.image(x, y, texture);
    obj.setOrigin(0.5, 1);
    obj.setScale(scale);
    obj.setDepth(y);

    scene.physics.add.existing(obj);
    obj.body.setSize(width, height);
    obj.body.setOffset(offset.x, offset.y);
    obj.body.setImmovable(true);
    scene.physics.add.collider(scene.player, obj);

    return obj;
  }

  static createInvisibleWall(scene, x, y, width, height) {
    const wall = scene.add.rectangle(x, y, width, height, 0x000000, 0);
    scene.physics.add.existing(wall);
    wall.body.setImmovable(true);
    scene.physics.add.collider(scene.player, wall);
    return wall;
  }

  static createRoundInvisibleWall(scene, x, y, radius) {
    const wall = scene.add.circle(x, y, radius, 0x000000, 0);
    scene.physics.add.existing(wall);
    wall.body.setCircle(radius);
    wall.body.setImmovable(true);
    scene.physics.add.collider(scene.player, wall);
    return wall;
  }

  static createNPC(scene, x, y, texture, options) {
    return this.createObstacle(scene, x, y, texture, options);
  }

  static createPole(scene, x, y, texture, scale = 1.1, sizeWidth = 15, sizeHeight = 20) {
    return this.createObstacle(scene, x, y, texture, {
      scale: scale,
      size: { width: sizeWidth, height: sizeHeight },
      offset: { x: 10, y: 100 },
    });
  }

  static createTree(scene, x, y, texture, scale = 1) {
    return this.createObstacle(scene, x, y, texture, {
      scale: scale,
      size: { width: 50, height: 30 },
      offset: { x: 50, y: 250 },
    });
  }

  static createHouse(scene, x, y, texture, options = {}) {
    const defaultOptions = {
      scale: 1,
      size: { width: 180, height: 70 },
      offset: { x: 20, y: 130 },
    };
    return this.createObstacle(scene, x, y, texture, { ...defaultOptions, ...options });
  }
}
