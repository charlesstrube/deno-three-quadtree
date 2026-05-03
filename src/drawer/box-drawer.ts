import {
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector2,
  type Box2,
} from "three";

export function drawBox2(box: Box2, color: number, opacity: number = 1) {
  // Récupérer la taille
  const size = new Vector2();
  box.getSize(size);

  // Créer la représentation visuelle (un plan horizontal)
  const geometry = new PlaneGeometry(size.x, size.y);
  const material = new MeshBasicMaterial({
    color,
    wireframe: true,
    opacity,
    transparent: true,
  });

  const visualBox = new Mesh(geometry, material);

  // Positionner le mesh au centre de la Box2
  const center = new Vector2();
  box.getCenter(center);
  visualBox.position.set(center.x, center.y, 0);

  return visualBox;
}

export function updateBox2(visualBox: ReturnType<typeof drawBox2>, box: Box2) {
  const size = new Vector2();
  box.getSize(size);
  const center = new Vector2();
  box.getCenter(center);
  visualBox.position.set(center.x, center.y, 0);
  visualBox.scale.set(size.x * 2, size.y * 2, 0);

  return visualBox;
}
