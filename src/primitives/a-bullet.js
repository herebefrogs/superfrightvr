AFRAME.registerPrimitive('a-bullet', {
  defaultComponents: {
    bullet: {},
    'linear-motion': {
      speed: 1,
    },
  },
  mappings: {
    direction: 'linear-motion.direction'
  }
});

const MAX_BULLET_TRAIL = 2;

AFRAME.registerComponent('bullet', {
  init: function() {
    const vrMode = this.el.sceneEl.is('vr-mode');

    const bullet = document.createElement('a-entity');
    bullet.setAttribute('geometry', {
      primitive: 'cylinder',
      radius: 0.01,
      height: 0.04,
      segmentsRadial: 6,
      segmentsHeight: 1,
      openEnded: false,
    });
    bullet.setAttribute('material', {
      color: 'black',
    });
    bullet.setAttribute('rotation', {
      // NOTE because the gun model is pointing down in VR, the bullet cylinder normally stand up will be rendered flat
      // however on desktop, the gun model isn't rotated so the bullet must be
      x: vrMode ? 0 : 90,
    });
    this.el.appendChild(bullet);

    this.trajectory = document.createElement('a-entity');
    this.trajectory.setAttribute('line', {
      color: 'black',
      opacity: 0.15,
      start: '0 0 0',
      end: `0 0 0`
    });
    this.trajectory.setAttribute('rotation', {
      // NOTE for reason I don't understand yet, the line is draw downward without this extra rotation
      x: -90
    });
    bullet.appendChild(this.trajectory);
  },
  events: {
    componentchanged: function(e) {
      if (e.detail.name === 'linear-motion') {
        const distanceTravelled = this.el.getAttribute('linear-motion').distanceTravelled;

        if (distanceTravelled <= MAX_BULLET_TRAIL) {
          this.trajectory.setAttribute('line', { end: `0 0 ${distanceTravelled}` });
        }
      }
    }
  },
})