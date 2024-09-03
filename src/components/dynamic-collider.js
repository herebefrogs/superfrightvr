AFRAME.registerComponent('dynamic-collider', {
  schema: {
    size: { type: 'number', default: 0 }
  },
  _play: function() { this.el.setAttribute('obb-collider', { size: this.data.size }) },
  _pause: function() { this.el.removeAttribute('obb-collider') }
});