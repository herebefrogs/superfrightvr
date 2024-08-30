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

    for (const collider of document.querySelectorAll(`#${this.el.id} a-gun`)) {
      collider.components.gun[this.data.active ? '_play' : '_pause']();
    }
    for (const collider of document.querySelectorAll(`#${this.el.id} [portal]`)) {
      collider.components.portal[this.data.active ? '_play' : '_pause']();
    }
  }
})