/**
 * Keep track of the direction, speed, and distance travelled by an entity
 * along a linear trajectory
 */
AFRAME.registerComponent('linear-motion', {
  schema: {
    direction: { type: 'vec3', default: '0 0 0' },
    speed: { type: 'number', default: 1 },
    distanceTravelled: { type: 'number', default: 0 }
  }
})