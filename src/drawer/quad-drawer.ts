import type { Quadtree } from "../quadtree";
import { drawBox2 } from "./box-drawer";

export function drawQuadtree(quadTree: Quadtree) {
  const color = 0x00ff00;
  const parentVisualBox = drawBox2(
    quadTree.bounding,
    color,
    1 / (quadTree.depth + 1),
  );

  const childVisualBoxes = quadTree
    .getChildren()
    .reduce<ReturnType<typeof drawBox2>[]>((acc, quadTree) => {
      acc.push(
        drawBox2(quadTree.bounding, color, 1 / (quadTree.depth + 1)),
        ...drawQuadtree(quadTree),
      );
      return acc;
    }, []);

  childVisualBoxes.unshift(parentVisualBox);

  return childVisualBoxes;
}
