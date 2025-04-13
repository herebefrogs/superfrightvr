/**
 * Container for all entities composing a level.
 * gameTimeTracked - whether this level is affected by slow motion or not
 */
AFRAME.registerComponent('level', {
  schema: {
    gameTimeTracked: { type: 'boolean', default: false }
  },
});