AFRAME.registerComponent('health', {
  schema: {
    hp: { type: 'int', default: 1 },
    group: { type: 'string', default: 'foe' }
  },
  update: function(oldData) {
    if (this.data.hp <= 0) {
      // TODO should animate death
      this.el.parentNode.removeChild(this.el)
    }
  }
})