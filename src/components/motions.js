/**
 * Keep track of the direction, speed, and distance travelled by an entity moving along a linear trajectory
 */
AFRAME.registerComponent('linear-motion', {
  schema: {
    direction: { type: 'vec3', default: '0 0 0' },
    speed: { type: 'number', default: 1 },
    distanceTravelled: { type: 'number', default: 0 }
  }
})

/**
 * Keep track of the direction, and speed of an entity spinning along one or more of its axes
 */
AFRAME.registerComponent('spin-motion', {
  schema: {
    direction: { type: 'vec3', default: '0 0 0' },
    speed: { type: 'number', default: 1 },
  }
})

/**
 * Keep track of the direction, and speed of an entity spinning along one or more of its axes
 */
AFRAME.registerComponent('sinlinear-motion', {
  schema: {
    direction: { type: 'vec3', default: '0 0 0' },
    speed: { type: 'number', default: 1 },
    alpha: { type: 'number', default: 0 }
  }
})