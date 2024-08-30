AFRAME.registerComponent('portal', {
  schema: {
    to: { type: 'string' },
  },
  _play: function() { this.el.setAttribute('obb-collider', { size: 0.15 }) },
  _pause: function() { this.el.removeAttribute('obb-collider') }
});