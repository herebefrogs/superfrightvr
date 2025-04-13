AFRAME.registerComponent('dynamic-collider', {
  schema: {
    size: { type: 'number', default: 0 },
  },
  events: {
    componentchanged: function(e) {
      if (e.detail.name === 'visible') {
        this.init();
      }
    },
  },
  init: function() {
    if (this.el.getAttribute('visible')) {
      this.el.setAttribute('obb-collider', { size: this.data.size });
    } else {
      this.el.removeAttribute('obb-collider');
    }
  },
});
