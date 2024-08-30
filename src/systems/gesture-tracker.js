AFRAME.registerSystem('gesture-tracker', {
  init: function() {
    this.hands = document.querySelectorAll('[gesture-tracker]');
  },
  tick: function() {
    for (const hand of this.hands) {
      const target = hand.components['gesture-tracker'].target;

      if (hand.is('hovering-portal') && hand.is('grabbing')) {
        hand.removeState('hovering-portal');
        hand.removeState('grabbing')
        this.el.emit('load-level', { levelId: target.getAttribute('portal').to });
      }
      else if (hand.is('hovering-gun') && hand.is('grabbing')) {
        hand.removeState('hovering-gun');
        hand.addState('holding-gun');

        this.grabGun(target, hand);
      }
      else if (hand.is('holding-gun') && !hand.is('grabbing')) {
        hand.removeState('holding-gun');
        // NOTE: most likely true, otherwise the player won't be able to grab the gun again
        // until the hand & gun exist each other so another obbcollisionstarted event can be emitted
        hand.addState('hovering-gun');
        this.dropGun(target);
      }
    }
  },
  grabGun: function(gun, hand) {
    // FIXME that would be ideal but the gun doesn't get rendered even though it gets attached to the hand!
    // hand.appendChild(gun)

    // instead, actively sync the hand's position/rotation to the gun
    gun.setAttribute('sync-stance', { src: '#' + hand.id });
    gun.setAttribute('gun', { pointDown: true });

    gun.setAttribute('gravity', false);
 },
  dropGun: function(gun) {
    gun.removeAttribute('sync-stance');
    gun.setAttribute('gravity', true);
  }
});