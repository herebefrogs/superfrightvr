AFRAME.registerPrimitive('a-bullet', {
  defaultComponents: {
    bullet: {},
    'dynamic-collider': { on: true },
    'linear-motion': { speed: 1.5 },
    'ttl': 5,
  },
  mappings: {
    direction: 'linear-motion.direction'
  }
});

const MAX_BULLET_TRAIL = 2;

AFRAME.registerComponent('bullet', {
  events: {
    componentchanged: function(e) {
      if (e.detail.name === 'linear-motion') {
        this.updateTrail(this.el.getAttribute('linear-motion').distanceTravelled);
      }
    },
    ttlreached: function(e) {
      this.removeBullet(e.detail.el);
    },
    obbcollisionstarted: function (e) {
      const target = e.detail.withEl;
      if (target.components.health) {
        if (this.el.components.health.data.group !== target.components.health.data.group) {
          target.setAttribute('health', { hp: 0 });
          this.el.setAttribute('health', { hp: 0 })
        }
      }
    },
  },
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

    // bullet trail
    const trail = document.createElement('a-entity');
    trail.setAttribute('line', {
      color: 'black',
      opacity: 0.15,
      start: '0 0 0',
      end: `0 0 0`
    });
    trail.setAttribute('rotation', {
      // NOTE for reason I don't understand yet, the line is draw downward without this extra rotation
      x: -90
    });
    bullet.appendChild(trail);

    this.trail = trail;
    this.el.appendChild(bullet);
  },
  updateTrail: function(distanceTravelled) {
    if (distanceTravelled <= MAX_BULLET_TRAIL) {
      this.trail.setAttribute('line', { end: `0 0 ${distanceTravelled}` });
    }
  },
  removeBullet: function(el) {
    el.parentNode.removeChild(el);
    el.destroy();
  }
})