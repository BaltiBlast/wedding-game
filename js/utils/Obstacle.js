function createObstacle(scene, x, y, key, options = {}) {
  const { scale = 1, size, offset = { x, y } } = options;
  const { width, height } = size;

  const obj = scene.add.image(x, y, key);
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

function createInvisibleWall(scene, x, y, width, height) {
  const wall = scene.add.rectangle(x, y, width, height, 0x000000, 0);
  scene.physics.add.existing(wall);
  wall.body.setImmovable(true);
  scene.physics.add.collider(scene.player, wall);
  return wall;
}

function createRoundInvisibleWall(scene, x, y, radius) {
  const wall = scene.add.circle(x, y, radius, 0x000000, 0);
  scene.physics.add.existing(wall);
  wall.body.setCircle(radius);
  wall.body.setImmovable(true);
  scene.physics.add.collider(scene.player, wall);
  return wall;
}
