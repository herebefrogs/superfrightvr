AFRAME.registerComponent('portal', {
  dependencies: ['dynamic-collider'],
  schema: {
    to: { type: 'string' },
  },
  init: function() {
    this.el.setAttribute('dynamic-collider', { size: 0.15 })
  }
});