GRAVITY = 0.98 / SLOWMO_RATIO;
// we don't want objects to fall too close to the floor or they'll be hard to grab again
FLOOR_HEIGHT = 0.1;

AFRAME.registerSystem('puppeteer', {
  init: function() {
    this.playerLimbs = [...document.querySelectorAll('[motion-tracker]')];
    this.retry = document.querySelector('#retry');

    this.el.addEventListener('tick', (e) => this._tick(e.detail.time, e.detail.timeDelta));

    this.el.addEventListener('child-attached', (e) => { this.trackEntity(e.detail.el) })
    this.el.addEventListener('child-detached', (e) => { this.untrackEntity(e.detail.el) })
  },
  _tick: function(time, timeDelta) {
    for (let el of this.gravitas) {
      if (el.getAttribute('gravity') && el.object3D.position.y > FLOOR_HEIGHT) {
        el.object3D.position.y = Math.max(FLOOR_HEIGHT, el.object3D.position.y - GRAVITY*timeDelta);
      }
    }

    for (let el of this.walkers) {
      const linearMotion = el.components['linear-motion']
      const { speed, direction, distanceTravelled } = linearMotion.data;
      const delta = speed * timeDelta;

      const deltaX = direction.x * delta;
      const deltaY = direction.y * delta;
      const deltaZ = direction.z * delta;
      el.object3D.position.x += deltaX;
      el.object3D.position.y += deltaY;
      el.object3D.position.z += deltaZ;

      const deltaD = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);
      el.setAttribute('linear-motion', { distanceTravelled: distanceTravelled + deltaD })
    }

    for (let el of this.sinWalkers) {
      const sinLinearMotion = el.components['sinlinear-motion']
      let { speed, direction, alpha } = sinLinearMotion.data;
      alpha += Math.PI * timeDelta;
      const delta = speed * timeDelta * Math.sin(alpha);

      const deltaX = direction.x * delta;
      const deltaY = direction.y * delta;
      const deltaZ = direction.z * delta;
      el.object3D.position.x += deltaX;
      el.object3D.position.y += deltaY;
      el.object3D.position.z += deltaZ;
      el.setAttribute('sinlinear-motion', { alpha });
    }

    for (let el of this.spinners) {
      const spinMotion = el.components['spin-motion'];
      const { speed, direction } = spinMotion.data;
      const delta = speed * timeDelta;
      el.object3D.rotation.x += direction.x * delta;
      el.object3D.rotation.y += direction.y * delta;
      el.object3D.rotation.z += direction.z * delta;

    }

    for (let el of this.puppets) {
      if (!el.components.health.data.hp) {
        zzfx(2.1,.05,315,.02,.02,.25,3,2.2,0,0,0,0,.02,0,32,.1,.17,.7,.07,.42,-1696);  // enemy death
        this.puppets = this.puppets.filter(p => p !== el);
      }
    }

    if (!this.puppets.length) {
      // level beaten
      this.showNextLevelPortal();
    } else if (!this.retry.getAttribute('visible')) {
      for (limb of this.playerLimbs) {
        if (!limb.getAttribute('health')?.hp) {
          // player beaten
          this.showRetry();
          break;
        }
      }
    }
  },
  showNextLevelPortal: function() {
    if (!this.el.is('level-cleared')) {
      this.el.addState('level-cleared');
      this.el.removeState('game-time-tracked');

      // give some time for the 'enemy hit' sound to play & complete
      setTimeout(() => {
        zzfx(1.7,.05,281,.04,.13,.35,0,1.7,0,-22,227,.09,.09,.3,0,0,.17,.6,.21,.28,-1463);  // portal appear
        this.portal.setAttribute('visible', true);
      }, 1000);
    }
  },
  showRetry: function() {
    if (!this.el.is('game-over')) {
      this.el.addState('game-over')
      zzfx(1,.05,148,.02,.01,.18,3,.2,.1,.8,0,-0.05,0,.1,-4,.3,0,.68,.08,.01,103); 

      // give some time for the 'player hit' sound to play & complete
      setTimeout(() => {
        zzfx(1.7,.05,507,.07,.23,.17,0,2.5,0,7,-85,.07,.02,0,0,0,.15,.72,.15,0,0);
        this.retry.setAttribute('portal', { to: '#' + document.querySelector('a-level').id })
        this.retry.setAttribute('visible', true);
      }, 1000)
    }
  },
  reset: function() {
    this.walkers = [...document.querySelectorAll('a-level [linear-motion]')];
    this.sinWalkers = [...document.querySelectorAll('a-level [sinlinear-motion]')];
    this.spinners = [...document.querySelectorAll('a-level [spin-motion]')];
    this.gravitas = [...document.querySelectorAll('a-level [gravity]')];
    this.puppets = [...document.querySelectorAll('a-level [puppet]')];
    this.portal = document.querySelector('a-level a-portal')
    this.retry.setAttribute('visible', false);
    this.playerLimbs.forEach(limb => limb.setAttribute('health', { hp: 1 }))
  },
  trackEntity: function(el) {
    if (el.components['linear-motion']) {
      this.walkers.push(el);
    }
    if (el.components['spin-motion']) {
      this.spinners.push(el);
    }
    if (el.components['sinlinear-motion']) {
      this.sinWalkers.push(el);
    }
    if (el.components['gravity']) {
      this.gravitas.push(el);
    }
  },
  untrackEntity: function(el) {
    if (el.components['linear-motion']) {
      this.walkers = this.walkers.filter(e => e !== el);
    }
    if (el.components['spin-motion']) {
      this.spinners = this.spinners.filter(e => e !== el);
    }
    if (el.components['sinlinear-motion']) {
      this.sinWalkers = this.sinWalkers.filter(e => e !== el);
    }
    if (el.components['gravity']) {
      this.gravitas = this.gravitas.filter(e => e !== el);
    }
  },
})