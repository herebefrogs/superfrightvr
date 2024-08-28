AFRAME.registerComponent('portal', {
  dependencies: ['obb-collider'],
  schema: {
    to: { type: 'string' },
  },
  play: function() { this.el.setAttribute('obb-collider', { size: '0.1 0.1 0.1' }) },
  pause: function() { this.el.removeAttribute('obb-collider') }
});