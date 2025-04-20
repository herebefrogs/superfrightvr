AFRAME.registerComponent('sniper', {
  schema: {
    frequency: { type: 'number', default: 1.5 },      // in s
    firstShotDelay: { type: 'number', default: 0.5 }, // in s
  },
  init: function() {
    this.nextShotDelay = this.data.firstShotDelay;
    this.playerHead = document.querySelector('a-camera').object3D

    this.el.sceneEl.addEventListener('tick', (e) => { this._tick(e.detail.time, e.detail.timeDelta) })
  },
  _tick: function(time, timeDelta) {
    if (this.el.isPlaying) {
      this.nextShotDelay -= timeDelta;
  
      if (this.nextShotDelay <= 0) {
        this.nextShotDelay += this.data.frequency;
  
        this.fireBullet();
      }
    }
  },
  fireBullet: function() {
    zzfx(1,.05,62,.01,.07,.4,2,2.8,6,-8,0,0,0,1.4,28,.4,0,.4,.1,.46,181); // gun shot

    const object3D = this.el.object3D;
    const sniperPosition = object3D.localToWorld(object3D.position.clone());
    const playerDirection = this.playerHead.position.clone();
    // head is a bit too high, aim at upper torso
    playerDirection.y -= 0.05;
    // O = origin
    // P = player
    // S = sniper
    // bulletDirection = OP - OS = OP + SO = SO + OP = SP = from sniper to player
    const bulletDirection = (new THREE.Vector3()).subVectors(playerDirection, sniperPosition).normalize();
    const bulletRotation = bulletDirection.clone().negate();

    const bullet = document.createElement('a-bullet');
    bullet.setAttribute('position', sniperPosition);
    // adjust the bullet's geometry so it faces away from the enemy
    bullet.object3D.lookAt(bulletRotation);
    bullet.setAttribute('linear-motion', { direction: bulletDirection })
    bullet.setAttribute('health', { group: this.el.getAttribute('health').group })

    document.querySelector('a-level').appendChild(bullet);
  }
});