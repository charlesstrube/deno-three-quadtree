import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  type Vector2,
} from "three";

export function drawPoints(points: Vector2[]) {
  const vertices: number[] = [];
  const colors: number[] = [];

  console.log(points);

  for (const point of points) {
    colors.push(1, 0, 0);
    vertices.push(point.x, point.y, 0);
  }

  const colorAttribute = new Float32BufferAttribute(colors, 3);
  const positionAttribute = new Float32BufferAttribute(vertices, 3);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("color", colorAttribute);

  const material = new PointsMaterial({
    size: 0.01,
    transparent: true,
    sizeAttenuation: true,
    vertexColors: true,
  });

  const visualPoints = new Points(geometry, material);
  return visualPoints;
}
