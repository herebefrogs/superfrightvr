AFRAME.registerSystem('gesture-tracker', {
  init: function() {
    this.hands = document.querySelectorAll('[gesture-tracker]');
  },
  tick: function() {
    for (const hand of this.hands) {
      const gesture = hand.components['gesture-tracker'];

      if (hand.is('hovering-portal') && hand.is('grabbing')) {
        hand.removeState('hovering-portal');
        hand.removeState('grabbing')
        zzfx(1,.05,166,.07,.11,.15,0,2.8,-3,-186,0,0,.1,0,0,.1,0,.55,.26,0,0);  // portal grabbed
        this.el.emit('loadlevel', { levelId: gesture.getTarget('hovering-portal').components.portal.data.to });
      }
      else if (hand.is('hovering-gun') && hand.is('grabbing') && !gesture.getTarget('hovering-gun').is('grabbed')) {
        hand.removeState('hovering-gun');
        hand.addState('holding-gun');

        this.grabGun(gesture.updateTarget('hovering-gun', 'holding-gun'), hand);
      }
      else if (hand.is('holding-gun') && !hand.is('grabbing')) {
        hand.removeState('holding-gun');
        // NOTE: most likely true, otherwise the player won't be able to grab the gun again
        // until the hand & gun exist each other so another obbcollisionstarted event can be emitted
        hand.addState('hovering-gun');
        this.dropGun(gesture.updateTarget('holding-gun', 'hovering-gun'));
      }
      else if (hand.is('holding-gun') && hand.is('shooting')) {
        hand.removeState('shooting');
        this.shootGun(gesture.getTarget('holding-gun'));
      }
    }
  },
  grabGun: function(gun, hand) {
    zzfx(1,.05,43,0,.44,.03,1,1.8,-18,-58,0,0,.01,.4,0,.1,0,.77,.11,0,0); // drop gun
    gun.addState('grabbed');
    // FIXME that would be ideal but the gun doesn't get rendered even though it gets attached to the hand!
    // REASON: re-parenting isn't supported in AFRAME, advised to sync position/rotation from hand to gun
    // hand.appendChild(gun)

    // instead, actively sync the hand's position/rotation to the gun
    gun.setAttribute('sync-stance', { src: '#' + hand.id });
    gun.setAttribute('gun', { pointDown: this.el.is('vr-mode') });
    gun.setAttribute('raycaster', { enabled: true });
    gun.setAttribute('gravity', false);
 },
  dropGun: function(gun) {
    zzfx(1,.05,43,0,.44,.03,1,1.8,-18,-58,0,0,.01,.4,0,.1,0,.77,.11,0,0); // drop gun
    gun.removeState('grabbed');
    gun.removeAttribute('sync-stance');
    gun.setAttribute('raycaster', { enabled: false });
    gun.setAttribute('gravity', true);
  },
  shootGun: function(gun) {
    // NOTE we should only call shootGun when it's true, but it's safer to check
    if (gun.components.raycaster.data.enabled) {
      zzfx(1,.05,62,.01,.07,.4,2,2.8,6,-8,0,0,0,1.4,28,.4,0,.4,.1,.46,181); // gun shot
      const world = document.querySelector('#world');

      const intersection = gun.components.raycaster.getIntersection(world)
      const normal = intersection.normal;
      const direction = { x: -normal.x, y: -normal.y, z: -normal.z };

      const bullet = document.createElement('a-bullet');
      const rotation = gun.getAttribute('rotation');

      // NOTE y and z should be swapped, but given the gun model is pointing downward to account
      // for hand model orientation that AFRAME autocorrects, it works as is
      const nozzlePosition = new THREE.Vector3(0, -0.22, -0.08);
      const origin = gun.object3D.localToWorld(nozzlePosition);

      bullet.setAttribute('position', `${origin.x} ${origin.y} ${origin.z}`);
      bullet.setAttribute('rotation', `${rotation.x} ${rotation.y} ${rotation.z}`);
      bullet.setAttribute('linear-motion', { direction: `${direction.x} ${direction.y} ${direction.z}` })
      bullet.setAttribute('health', { group: gun.components.health.data.group });

      this.el.systems.level.activeLevel.appendChild(bullet);
    }
  }
});