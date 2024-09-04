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
    gun.addState('grabbed');
    // FIXME that would be ideal but the gun doesn't get rendered even though it gets attached to the hand!
    // hand.appendChild(gun)

    // instead, actively sync the hand's position/rotation to the gun
    gun.setAttribute('sync-stance', { src: '#' + hand.id });
    gun.setAttribute('gun', { pointDown: this.el.is('vr-mode') });
    gun.setAttribute('raycaster', { enabled: true });
    gun.setAttribute('gravity', false);
 },
  dropGun: function(gun) {
    gun.removeState('grabbed');
    gun.removeAttribute('sync-stance');
    gun.setAttribute('raycaster', { enabled: false });
    gun.setAttribute('gravity', true);
  },
  shootGun: function(gun) {
    // NOTE we should only call shootGun when it's true, but it's safer to check
    if (gun.components.raycaster.data.enabled) {
      const world = document.querySelector('#world');

      // FIXME this is wrong: the normal is going to be the same if the gun still points at the same face (e.g. if the sphere was a box it would be very apparent)
      // so the bullet isn't going to come out of the gun straight most of the time, breaking the illusion and being frustrating to aim
      const intersection = gun.components.raycaster.getIntersection(world)
      const normal = intersection.normal;
      const direction = { x: -normal.x, y: -normal.y, z: -normal.z };

      const bullet = document.createElement('a-bullet');
      const origin = gun.getAttribute('position');
      const rotation = gun.getAttribute('rotation');

      // TODO add the raycaster's origin to the gun position, currently hard coded (and wrong)
      bullet.setAttribute('position', `${origin.x} ${origin.y + 0.08} ${origin.z - 0.22}`);
      bullet.setAttribute('rotation', `${rotation.x} ${rotation.y} ${rotation.z}`);
      bullet.setAttribute('linear-motion', { direction: `${direction.x} ${direction.y} ${direction.z}` })
      bullet.setAttribute('health', { group: gun.components.health.data.group });

      this.el.systems.level.activeLevel.appendChild(bullet);
    }
  }
});