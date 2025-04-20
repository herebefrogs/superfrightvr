/**
 * Whether an entity is subject to gravity or not (during game-time)
 */
AFRAME.registerComponent('gravity', {
  schema: { type: 'boolean', default: false },
  events: {
    componentchanged: function(e) {
      if (e.detail.name === 'gravity') {
        this.el.sceneEl.emit('gravity-changed', {
          el: this.el,
          gravity: this.data
        });
      }
    }
  },
});