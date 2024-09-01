const GRAVITY = 0.98;

AFRAME.registerSystem('puppeteer', {
  init: function() {
    this.el.addEventListener('step', (e) => this.step(e.detail.time, e.detail.timeDelta));

    this.puppets = document.querySelectorAll('[puppet]');
    this.gravitas = document.querySelectorAll('[gravity]');
  },
  step: function(time, timeDelta) {
    // TODO temporary
    for (let el of this.puppets) {
      const delta = Math.sin(time/1000);

      el.object3D.position.x = 2*delta;
      el.object3D.rotation.z = -delta;
    }

    for (let el of this.gravitas) {
      if (el.getAttribute('gravity')) {
        el.object3D.position.y = Math.max(0, el.object3D.position.y - GRAVITY/3*timeDelta/1000);
      }
    }
  }
})