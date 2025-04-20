AFRAME.registerPrimitive('a-bullet', {
  defaultComponents: {
    bullet: {},
    'dynamic-collider': {},
    'linear-motion': { speed: 2 },
    'ttl': 15,
  },
  mappings: {
    direction: 'linear-motion.direction',
  }
});

const MAX_BULLET_TRAIL = 2.5;

/**
 * Handle bullet geometry and events
 * 
 * React to events:
 * - componentchanged -> lengthen the trail to match the bullet motion
 * - ttlreached -> garbage collect bullets which didn't hit their mark
 * - obbcollisionstarted -> kill targets with 'health' component
 */
AFRAME.registerComponent('bullet', {
  events: {
    componentchanged: function(e) {
      if (e.detail.name === 'linear-motion') {
        this.updateTrail(this.el.getAttribute('linear-motion').distanceTravelled);
      }
    },
    ttlreached: function(e) {
      this.el.setAttribute('health', { hp: 0 });
    },
    obbcollisionstarted: function (e) {
      const target = e.detail.withEl;
      if (target.components.health && (this.el.components.health.data.group !== target.components.health.data.group)) {
        // hurt target, expend the bullet
        target.setAttribute('health', { hp: target.components.health.data.hp - 1 });
        this.el.setAttribute('health', { hp: 0 });
      }
    },
  },
  init: function() {
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

    // bullet trail
    const trail = document.createElement('a-entity');
    trail.setAttribute('line', {
      color: 'red',
      opacity: 0.45,
      transparent: true,
      start: '0 0 0',
      end: `0 0 0`
    });
    bullet.appendChild(trail);
    this.el.appendChild(bullet);

    this.trail = trail;

    // cylinder is created standing up, so rotate it 90deg clockwise along the x-axis
    // so it points forward in the direction that the bullet will travel towards
    bullet.object3D.rotation.x = -Math.PI/2;
    trail.object3D.rotation.x = -Math.PI/2;

  },
  updateTrail: function(distanceTravelled) {
    if (distanceTravelled <= MAX_BULLET_TRAIL) {
      this.trail.setAttribute('line', { end: `0 0 -${distanceTravelled}` });
    }
  },
})