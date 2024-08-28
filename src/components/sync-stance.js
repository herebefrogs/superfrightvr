/**
 * Copy the position and rotation of a source entity to this component's entity
 */
AFRAME.registerComponent('sync-stance', {
  schema: {
    src: { type: 'string' }
  },
  init: function() {
    this.src = document.querySelector(this.data.src);
  },
  // NOTE: unfortunately, hand-controls does not seem to emit componentchanged events that I could listen on
  // when the player move their hand, so I had to go for the tick function instead (on the plus side, hands
  // move pretty much all the time, even by the slightest amount)
  tick: function() {
    if (this.el.isPlaying && this.src) {
      this.el.object3D.position.x = this.src.object3D.position.x;
      this.el.object3D.position.y = this.src.object3D.position.y;
      this.el.object3D.position.z = this.src.object3D.position.z;
      this.el.object3D.rotation.x = this.src.object3D.rotation.x;
      this.el.object3D.rotation.y = this.src.object3D.rotation.y;
      this.el.object3D.rotation.z = this.src.object3D.rotation.z;
    }
  },
});