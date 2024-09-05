GRAVITY = 0.98 / SLOWMO_RATIO;
// we don't want objects to fall too close to the floor or they'll be hard to grab again
FLOOR_HEIGHT = 0.1;

AFRAME.registerSystem('puppeteer', {
  init: function() {
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
        this.puppets = this.puppets.filter(p => p !== el);
      }
    }
    if (!this.puppets.length) {
      // // stop game time
      // this.el.removeState('game-time-tracked');
      this.portal.setAttribute('visible', true);
    }
  },
  reset: function() {
    this.walkers = [...document.querySelectorAll(`#${this.el.systems.level.activeLevel?.id} [linear-motion]`)];
    this.spinners = [...document.querySelectorAll(`#${this.el.systems.level.activeLevel?.id} [spin-motion]`)];
    this.gravitas = [...document.querySelectorAll(`#${this.el.systems.level.activeLevel?.id} [gravity]`)];
    this.puppets = [...document.querySelectorAll(`#${this.el.systems.level.activeLevel?.id} [puppet]`)];
    this.portal = document.querySelector(`#${this.el.systems.level.activeLevel?.id} a-portal`)
  },
  trackEntity: function(el) {
    if (el.components['linear-motion']) {
      this.walkers.push(el);
    }
    if (el.components['spin-motion']) {
      this.spinners.push(el);
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
    if (el.components['gravity']) {
      this.gravitas = this.gravitas.filter(e => e !== el);
    }
  },
})