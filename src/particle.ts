import { Vector2 } from "three";
import { CONFIG } from "./config";

export class Particle {
  velocity: Vector2 = new Vector2(
    Math.random() / 100 - 0.005,
    Math.random() / 100 - 0.005,
  );
  position: Vector2;
  randomForce = new Vector2();

  constructor(position: Vector2) {
    this.position = position;
  }

  setEdge(axis: "x" | "y") {
    const max = CONFIG.boundingBoxSize / 2;
    const min = 0 - max;
    const position = this.position[axis];
    const setter = `set${axis.toUpperCase()}` as "setX" | "setY";

    if (position > max) {
      this.position[setter](min);
    }
    if (position < min) {
      this.position[setter](max);
    }
  }

  /**
   * this limit the area to have boundaries
   */
  edges() {
    this.setEdge("x");
    this.setEdge("y");
  }

  update() {
    this.edges();
    this.randomForce.setX(Math.random() / 100 - 0.005);
    this.randomForce.setY(Math.random() / 100 - 0.005).clampLength(0, 0.0001);
    this.velocity.add(this.randomForce).clampLength(0, 0.002);
    this.position.add(this.velocity);

    return this.position;
  }
}
