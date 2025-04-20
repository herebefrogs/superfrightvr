AFRAME.registerComponent('dynamic-collider', {
  schema: {
    size: { type: 'number', default: 0 },
  },
  events: {
    // TODO I don't remember why I need this event handler, figure it out and document it in a comment
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
