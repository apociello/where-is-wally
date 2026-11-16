// Radius of the targeting circle, in pixels of the original image
export const TARGET_RADIUS = 50;

// Does the circle around the click touch the character's box? Everything in image pixels.
export function circleTouchesBox(click, radius, box) {
  // Point of the box closest to the click (the click itself if it's inside)
  const closestX = Math.min(Math.max(click.x, box.xMin), box.xMax);
  const closestY = Math.min(Math.max(click.y, box.yMin), box.yMax);

  const dx = click.x - closestX;
  const dy = click.y - closestY;

  // Pythagoras, compared squared to avoid the square root
  return dx * dx + dy * dy <= radius * radius;
}
