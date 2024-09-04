const GRAVITY = 0.98 / 3;
// we don't want objects to fall too close to the floor or they'll be hard to grab again
const FLOOR_HEIGHT = 0.25;

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

    for (let el of this.linearMovers) {
      const linearMotion = el.components['linear-motion']
      const delta = linearMotion.data.speed * timeDelta;

      const deltaX = linearMotion.data.direction.x * delta;
      const deltaY = linearMotion.data.direction.y * delta;
      const deltaZ = linearMotion.data.direction.z * delta;
      el.object3D.position.x += deltaX;
      el.object3D.position.y += deltaY;
      el.object3D.position.z += deltaZ;

      const deltaD = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);
      el.setAttribute('linear-motion', { distanceTravelled: linearMotion.data.distanceTravelled + deltaD })
    }
  },
  reset: function() {
    this.linearMovers = [...document.querySelectorAll(`#${this.el.systems.level.activeLevel?.id} [linear-motion]`)];
    this.gravitas = [...document.querySelectorAll(`#${this.el.systems.level.activeLevel?.id} [gravity]`)];
  },
  trackEntity: function(el) {
    if (el.components['linear-motion']) {
      this.linearMovers.push(el);
    }
    if (el.components['gravity']) {
      this.gravitas.push(el);
    }
  },
  untrackEntity: function(el) {
    if (el.components['linear-motion']) {
      this.linearMovers = this.linearMovers.filter(e => e !== el);
    }
    if (el.components['gravity']) {
      this.gravitas = this.gravitas.filter(e => e !== el);
    }
  },
})