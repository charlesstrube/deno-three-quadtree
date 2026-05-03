import { Box2, Vector2 } from "three";
import { Quadtree } from "./quadtree";
import { camera, renderer, scene } from "./scene";
import { drawQuadtree } from "./drawer/quad-drawer";
import Stats from "stats.js";
import { drawPoints } from "./drawer/points-drawer";

const box = new Box2(new Vector2(0, 0), new Vector2(2, 2));
const quadtree = new Quadtree(box);
const points: Vector2[] = [];

console.log(quadtree);

for (let i = 0; i < 1000; i += 1) {
  const vector2 = new Vector2(Math.random() * 2, Math.random() * 2);
  quadtree.insert(vector2);
  points.push(vector2);
}

const visualPoint = drawPoints(points);
const visualBoxes = drawQuadtree(quadtree);

for (const visualBox of visualBoxes) {
  scene.add(visualBox);
}
scene.add(visualPoint);

export const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();

  // Build the spatial index once per frame from all entities (birds + predators).
  // Must happen before updateGeometry so flock() queries reflect current positions.

  // Birds and predators have separate geometries but both flock against all of `life`.

  renderer.render(scene, camera);
  stats.end();
}
renderer.setAnimationLoop(animate);
