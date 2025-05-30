AFRAME.registerPrimitive('a-level', {
  defaultComponents: {
    level: {},
  },
  mapping: {
    'game-time-tracked': 'level.gameTimeTracked'
  }
});

/**
 * Container for all entities composing a level.
 * gameTimeTracked - whether this level is affected by slow motion or not
 */
AFRAME.registerComponent('level', {
  schema: {
    gameTimeTracked: { type: 'boolean', default: false }
  },
});