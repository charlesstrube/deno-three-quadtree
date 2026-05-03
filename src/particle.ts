import { Vector2 } from "three";

export class Particle {
  velocity: Vector2 = new Vector2(Math.random() / 10, Math.random() / 10);
  position: Vector2;

  constructor(position: Vector2) {
    this.position = position;
  }

  update() {}
}
