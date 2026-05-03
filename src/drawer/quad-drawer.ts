import {
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector2,
  type Box2,
} from "three";
import type { Quadtree } from "../quadtree";

function drawBox2(box: Box2, depth: number) {
  // Récupérer la taille
  const size = new Vector2();
  box.getSize(size);

  // Créer la représentation visuelle (un plan horizontal)
  const geometry = new PlaneGeometry(size.x, size.y);
  const material = new MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    opacity: 1 / (depth + 1),
    transparent: true,
  });

  const visualBox = new Mesh(geometry, material);

  // Positionner le mesh au centre de la Box2
  const center = new Vector2();
  box.getCenter(center);
  visualBox.position.set(center.x, center.y, 0);

  return visualBox;
}

export function drawQuadtree(quadTree: Quadtree) {
  const parentVisualBox = drawBox2(quadTree.bounding, quadTree.depth);

  const childVisualBoxes = quadTree
    .getChildren()
    .reduce<ReturnType<typeof drawBox2>[]>((acc, quadTree) => {
      acc.push(
        drawBox2(quadTree.bounding, quadTree.depth),
        ...drawQuadtree(quadTree),
      );
      return acc;
    }, []);

  childVisualBoxes.unshift(parentVisualBox);

  return childVisualBoxes;
}
