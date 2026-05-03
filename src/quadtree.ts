import { Box2, Vector2 } from "three";

export class Quadtree {
  bounding: Box2;
  depth: number;

  maxObjects: number;
  points: Vector2[] = [];
  subdivived: boolean = false;

  northWest?: Quadtree;
  northEast?: Quadtree;
  southWest?: Quadtree;
  southEast?: Quadtree;

  constructor(bounding: Box2, depth: number = 0, maxObjects: number = 4) {
    this.bounding = bounding;
    this.depth = depth;
    this.maxObjects = maxObjects;
  }

  isInside(point: Vector2) {
    return this.bounding.containsPoint(point);
  }

  getChildren() {
    return [
      this.northEast,
      this.northWest,
      this.southEast,
      this.southWest,
    ].filter((element) => element != undefined);
  }

  insert(point: Vector2) {
    if (!this.isInside(point)) {
      return;
    }

    if (this.points.length < this.maxObjects) {
      this.points.push(point);
      return;
    }

    this.subdivide();

    this.northWest?.insert(point);
    this.northEast?.insert(point);
    this.southWest?.insert(point);
    this.southEast?.insert(point);
  }

  subdivide() {
    if (this.subdivived) {
      return;
    }

    const size = new Vector2();
    const center = new Vector2();
    this.bounding.getSize(size);
    this.bounding.getCenter(center);

    const width = size.x / 2;
    const height = size.y / 2;

    /**
     * ---------------
     * |  nw  |  ne  |
     * |      |      |
     * -------c-------
     * |      |      |
     * |  sw  |  se  |
     * ---------------
     */

    const northWestBox = new Box2(
      new Vector2(center.x - width, center.y - height),
      new Vector2(center.x, center.y),
    );

    const northEastBox = new Box2(
      new Vector2(center.x, center.y - height),
      new Vector2(center.x + width, center.y),
    );

    const southWestBox = new Box2(
      new Vector2(center.x - width, center.y),
      new Vector2(center.x, center.y + height),
    );

    const southEastBox = new Box2(
      new Vector2(center.x, center.y),
      new Vector2(center.x + width, center.y + height),
    );

    const newDepth = this.depth + 1;

    this.northWest = new Quadtree(northWestBox, newDepth, this.maxObjects);
    this.northEast = new Quadtree(northEastBox, newDepth, this.maxObjects);
    this.southWest = new Quadtree(southWestBox, newDepth, this.maxObjects);
    this.southEast = new Quadtree(southEastBox, newDepth, this.maxObjects);

    this.subdivived = true;
  }

  queryRange(range: Box2): Vector2[] {
    if (!this.bounding.intersectsBox(range)) {
      return [];
    }

    const points = this.points.filter(this.bounding.containsPoint);

    if (this.northWest) {
      points.push(...this.northWest.queryRange(range));
    }

    if (this.northEast) {
      points.push(...this.northEast.queryRange(range));
    }

    if (this.southWest) {
      points.push(...this.southWest.queryRange(range));
    }

    if (this.southWest) {
      points.push(...this.southWest.queryRange(range));
    }

    return points;
  }
}
