AFRAME.registerComponent('health', {
  schema: { type: 'int', default: 1 },
  events: {
    obbcollisionstarted: function (e) {
      const target = e.detail.withEl;

      if (target.tagName === 'A-BULLET') {
        this.el.setAttribute('health', 0);
      }
    }
  },
  update: function(oldData) {
    if (this.data <= 0) {
      // TODO should animate death
      this.el.parentNode.removeChild(this.el)
      this.el.destroy();
    }
  }
})