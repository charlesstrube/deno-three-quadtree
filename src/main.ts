import { Box2, Vector2 } from "three";
import { Quadtree } from "./quadtree";
import { drawScene, prepareScene } from "./scene";
import { drawQuadtree } from "./drawer/quad-drawer";
import { drawPoints, updatePoints } from "./drawer/points-drawer";
import { drawBox2, updateBox2 } from "./drawer/box-drawer";
import { prepareRaycaster } from "./mouse";
import { Particle } from "./particle";
import "./style.css";
import { CONFIG } from "./config";

const { camera, renderer, scene } = prepareScene();
const raycast = prepareRaycaster(camera);

// bounding box
const halfBoundingBox = CONFIG.boundingBoxSize / 2;
const boundingBoxMin = new Vector2(-halfBoundingBox, -halfBoundingBox);
const boundingBoxMax = new Vector2(halfBoundingBox, halfBoundingBox);
const boundingBox = new Box2(boundingBoxMin, boundingBoxMax);
const visualBoundingBox = drawBox2(boundingBox, 0x0000ff);

// selection box
const selectionBox = new Box2(
  new Vector2(0, 0),
  new Vector2(CONFIG.selectionSize / 2, CONFIG.selectionSize / 2),
);
const visualSelectionBox = drawBox2(selectionBox, 0xff0000);
scene.add(visualSelectionBox);

// build quadtree
const quadtree = new Quadtree<Particle>(boundingBox);
const particles: Particle[] = [];
for (let i = 0; i < CONFIG.pointCount; i += 1) {
  const position = new Vector2(
    Math.random() * CONFIG.boundingBoxSize - CONFIG.boundingBoxSize / 2,
    Math.random() * CONFIG.boundingBoxSize - CONFIG.boundingBoxSize / 2,
  );
  const particle = new Particle(position);
  quadtree.insert(position, particle);
  particles.push(particle);
}

// draw de quadtree
const visualQuadtreeBoxes = drawQuadtree(quadtree);
for (const visualBox of visualQuadtreeBoxes) {
  scene.add(visualBox);
}

// draw points
const selectedVisualPoints = drawPoints(
  particles.map((particle) => particle.position),
  0xff0000,
);
scene.add(selectedVisualPoints);
const unselectedVisualPoints = drawPoints(
  particles.map((particle) => particle.position),
  0xffffff,
);
scene.add(unselectedVisualPoints);

drawScene(renderer, () => {
  quadtree.clear();
  for (const particle of particles) {
    const position = particle.update();
    quadtree.insert(position, particle);
  }
  const position = raycast([visualBoundingBox]);
  if (position) {
    const h = CONFIG.selectionSize / 2;
    boundingBoxMin.set(position.x - h, position.y - h);
    boundingBoxMax.set(position.x + h, position.y + h);
    selectionBox.set(boundingBoxMin, boundingBoxMax);
    updateBox2(visualSelectionBox, selectionBox);
  }

  const selectedParticles = quadtree
    .queryRange(selectionBox)
    .map((quadTreeElement) => quadTreeElement.data);

  const unselectedPoints = particles.filter(
    (particle) => !selectedParticles.includes(particle),
  );

  updatePoints(
    selectedVisualPoints,
    selectedParticles.map((particle) => particle.position),
  );
  updatePoints(
    unselectedVisualPoints,
    unselectedPoints.map((particle) => particle.position),
  );
  renderer.render(scene, camera);
});
