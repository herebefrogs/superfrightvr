AFRAME.registerComponent('puppet', {
  events: {
    'game-tick': function(e) {
      const delta = Math.sin(e.detail.time/1000);
    
      this.el.object3D.position.x = 2*delta;
      this.el.object3D.rotation.z = -delta;
    }
  },
})