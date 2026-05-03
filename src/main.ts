import { Box2, Vector2 } from "three";
import { Quadtree } from "./quadtree";
import { drawScene, prepareScene } from "./scene";
import { drawQuadtree } from "./drawer/quad-drawer";
import { drawPoints, updatePoints } from "./drawer/points-drawer";
import { drawBox2, updateBox2 } from "./drawer/box-drawer";
import { prepareRaycaster } from "./mouse";

const CONFIG = {
  boundingBoxSize: 2, // La boîte fera de -1 à 1
  selectionSize: 0.5, // La largeur/hauteur de la boîte de sélection
  pointCount: 2000,
};

const { camera, renderer, scene } = prepareScene();
const raycast = prepareRaycaster(camera);

const halfBoundingBox = CONFIG.boundingBoxSize / 2;
const boundingBox = new Box2(
  new Vector2(-halfBoundingBox, -halfBoundingBox),
  new Vector2(halfBoundingBox, halfBoundingBox),
);
const visualBoundingBox = drawBox2(boundingBox, 0x0000ff);

const quadtree = new Quadtree(boundingBox);

const x = Math.random() * 1.25;
const y = Math.random() * 1.25;
const selectionBox = new Box2(
  new Vector2(-x, -y),
  new Vector2(0.5 - x, 0.5 - y),
);
const visualSelectionBox = drawBox2(selectionBox, 0xff0000);
scene.add(visualSelectionBox);

const points: Vector2[] = [];
for (let i = 0; i < CONFIG.pointCount; i += 1) {
  const vector2 = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
  quadtree.insert(vector2);
  points.push(vector2);
}

// draw de quadtree
const visualQuadtreeBoxes = drawQuadtree(quadtree);
for (const visualBox of visualQuadtreeBoxes) {
  scene.add(visualBox);
}

/**
 * points
 */
const visualSelectedPoints = drawPoints(points, 0xff0000);
scene.add(visualSelectedPoints);
const unselectedVisualPoints = drawPoints(points, 0xffffff);
scene.add(unselectedVisualPoints);

drawScene(renderer, () => {
  const position = raycast([visualBoundingBox]);
  if (position) {
    selectionBox.set(
      new Vector2(position.x - 0.25, position.y - 0.25),
      new Vector2(0.25 + position.x, 0.25 + position.y),
    );
    updateBox2(visualSelectionBox, selectionBox);
  }

  const selectedPoints = quadtree.queryRange(selectionBox);
  const unselectedPoints = points.filter(
    (point) => !selectedPoints.includes(point),
  );

  updatePoints(visualSelectedPoints, selectedPoints);
  updatePoints(unselectedVisualPoints, unselectedPoints);
  renderer.render(scene, camera);
});
