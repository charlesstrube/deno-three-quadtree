import {
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";
import type { Quadtree } from "../quadtree";
import { CONFIG } from "../config";

let quadtreeLines: LineSegments;
const MAX_QUADTREE_NODES = CONFIG.pointCount;
export function initQuadtreeVisualizer() {
  // 8 sommets par boîte (4 segments de 2 points pour faire un carré)
  const geometry = new BufferGeometry();
  const positions = new Float32Array(MAX_QUADTREE_NODES * 8 * 3);
  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  const material = new LineBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.5,
  });
  quadtreeLines = new LineSegments(geometry, material);
  return quadtreeLines;
}

export function updateQuadtreeVisualizer<T>(quadtree: Quadtree<T>) {
  const positions = quadtreeLines.geometry.attributes.position.array;
  let index = 0;

  // Fonction récursive pour remplir le tableau de positions
  function fillPositions(node: Quadtree<T>) {
    if (index / 24 >= MAX_QUADTREE_NODES) return;

    const { min, max } = node.bounding;

    // Segment 1: Bas
    positions[index++] = min.x;
    positions[index++] = min.y;
    positions[index++] = 0;
    positions[index++] = max.x;
    positions[index++] = min.y;
    positions[index++] = 0;
    // Segment 2: Droite
    positions[index++] = max.x;
    positions[index++] = min.y;
    positions[index++] = 0;
    positions[index++] = max.x;
    positions[index++] = max.y;
    positions[index++] = 0;
    // Segment 3: Haut
    positions[index++] = max.x;
    positions[index++] = max.y;
    positions[index++] = 0;
    positions[index++] = min.x;
    positions[index++] = max.y;
    positions[index++] = 0;
    // Segment 4: Gauche
    positions[index++] = min.x;
    positions[index++] = max.y;
    positions[index++] = 0;
    positions[index++] = min.x;
    positions[index++] = min.y;
    positions[index++] = 0;

    const children = node.getChildren();
    for (const child of children) {
      fillPositions(child);
    }
  }

  fillPositions(quadtree);

  // On indique à Three.js de mettre à jour le GPU
  quadtreeLines.geometry.attributes.position.needsUpdate = true;
  // On cache les segments inutilisés en limitant le rendu
  quadtreeLines.geometry.setDrawRange(0, index / 3);
}
