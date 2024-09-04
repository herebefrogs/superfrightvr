/**
 * Manages show/hide and play/pause for this component's entity's children
 * (so obb-colliders aren't active despite their entity being hidden from view)
 */
AFRAME.registerComponent('level', {
  dependencies: ['visible'],
  schema: {
    active: { type: 'boolean', default: false },
    gameTimeTracked: { type: 'boolean', default: false }
  },
  update: function() {
    this.el.object3D.visible = this.data.active;
    this.el[this.data.active ? 'play' : 'pause']();

    for (const el of document.querySelectorAll(`#${this.el.id} [dynamic-collider]`)) {
      if (el.getAttribute('visible')) {
        console.log('level.update', el.tagName, el.id, el.getAttribute('visible'))
        el.components['dynamic-collider'][this.data.active ? '_play' : '_pause']();
      }
    }
  }
})