import { Box2, Vector2 } from "three";
import { Quadtree } from "./quadtree";

const northWestBox = new Box2(new Vector2(0, 0), new Vector2(2, 2));
const quadtree = new Quadtree(northWestBox);

for (let i = 0; i < 200; i += 1) {
  quadtree.insert(new Vector2(Math.random() * 2, Math.random() * 2));
}

console.log(quadtree);
