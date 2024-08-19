AFRAME.registerSystem('puppeteer', {
  init: function() {
    this.el.addEventListener('step', (e) => this.step(e.detail.time, e.detail.timeDelta));

    this.puppets = document.querySelectorAll('[puppet]');
  },
  step: function(time, timeDelta) {
    for (el of this.puppets) {
      const delta = Math.sin(time/1000);

      el.object3D.position.x = 2*delta;
      el.object3D.rotation.z = -delta;
    }
  }
})