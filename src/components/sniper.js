AFRAME.registerComponent('sniper', {
  schema: {
    frequency: { type: 'number', default: 1.5 },      // in s
    firstShotDelay: { type: 'number', default: 0.5 }, // in s
    enabled: { type: 'boolean', default: false }
  },
  init: function() {
    this.nextShotDelay = this.data.firstShotDelay;
    this.playerHead = document.querySelector('a-camera').object3D

    this.el.sceneEl.addEventListener('tick', (e) => { this._tick(e.detail.time, e.detail.timeDelta) })
  },
  _tick: function(time, timeDelta) {
    if (this.data.enabled) {
      this.nextShotDelay -= timeDelta;
  
      if (this.nextShotDelay <= 0) {
        this.nextShotDelay += this.data.frequency;
  
        this.fireBullet();
    }
    }
  },
  fireBullet: function() {
    const object3D = this.el.object3D
    const sniperPosition = object3D.localToWorld(object3D.position.clone());
    const playerDirection = this.playerHead.position.clone()
    // head is a bit too high, aim at upper torso
    playerDirection.y -= 0.2;
    playerDirection.sub(sniperPosition).normalize();

    const bullet = document.createElement('a-bullet');
    // adjust the geometry rotation for the bullet to face away from the enemy
    bullet.setAttribute('bullet', { fromPlayer: false })
    bullet.setAttribute('position', sniperPosition);
    bullet.object3D.lookAt(playerDirection);
    bullet.setAttribute('linear-motion', { direction: playerDirection })
    bullet.setAttribute('health', { group: this.el.components.health.data.group })

    this.el.sceneEl.systems.level.activeLevel.appendChild(bullet);
  }
});