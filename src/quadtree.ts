import { Box2, Vector2 } from "three";

interface Element<T> {
  point: Vector2;
  data: T;
}

export class Quadtree<T> {
  bounding: Box2;
  depth: number;

  maxObjects: number;
  list: Element<T>[] = [];
  subdivived: boolean = false;

  northWest?: Quadtree<T>;
  northEast?: Quadtree<T>;
  southWest?: Quadtree<T>;
  southEast?: Quadtree<T>;

  constructor(bounding: Box2, depth: number = 0, maxObjects: number = 4) {
    this.bounding = bounding;
    this.depth = depth;
    this.maxObjects = maxObjects;
  }

  clear() {
    this.list = [];
    this.subdivived = false;
    this.northWest = undefined;
    this.northEast = undefined;
    this.southWest = undefined;
    this.southEast = undefined;
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

  insert(point: Vector2, data: T) {
    if (!this.isInside(point)) {
      return;
    }

    if (this.list.length < this.maxObjects) {
      const element = { point, data };
      this.list.push(element);
      return;
    }

    this.subdivide();

    this.northWest?.insert(point, data);
    this.northEast?.insert(point, data);
    this.southWest?.insert(point, data);
    this.southEast?.insert(point, data);
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

  queryRange(range: Box2): Element<T>[] {
    if (
      !(this.bounding.intersectsBox(range) || this.bounding.containsBox(range))
    ) {
      return [];
    }

    const points = this.list.filter((element) =>
      range.containsPoint(element.point),
    );

    if (this.northWest) {
      points.push(...this.northWest.queryRange(range));
    }

    if (this.northEast) {
      points.push(...this.northEast.queryRange(range));
    }

    if (this.southWest) {
      points.push(...this.southWest.queryRange(range));
    }

    if (this.southEast) {
      points.push(...this.southEast.queryRange(range));
    }

    return points;
  }
}
