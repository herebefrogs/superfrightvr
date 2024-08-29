AFRAME.registerSystem('gesture-tracker', {
  init: function() {
    this.hands = document.querySelectorAll('[gesture-tracker]');
  },
  tick: function() {
    for (const hand of this.hands) {
      if (hand.is('hovering-portal') && hand.is('grabbing')) {
        hand.removeState('hovering-portal');
        hand.removeState('grabbing')
        this.loadLevel(hand.components['gesture-tracker'].target.getAttribute('portal').to);
      }
      else if (hand.is('hovering-gun') && hand.is('grabbing')) {
        hand.removeState('hovering-gun');
        this.grabGun(hand, hand.components['gesture-tracker'].target);
      }
      else if (hand.is('holding-gun') && !hand.is('grabbing')) {
        hand.removeState('holding-gun');
        this.dropGun(hand, hand.components['gesture-tracker'].target);
      }
    }
  },
  loadLevel: function(levelId) {
    // TODO probably need a dedicated system & component for this
    for (const el of document.querySelectorAll('[visible=true]')) {
      el.setAttribute('visible', false);
      el.pause();
    }
    document.querySelector(levelId).setAttribute('visible', true)
  },
  grabGun: function(hand, gun) {
    hand.addState('holding-gun');
    // FIXME that would be ideal but the gun doesn't get rendered even though it gets attached to the hand!
    // hand.appendChild(gun)

    // instead, actively sync the hand's position/rotation to the gun
    gun.setAttribute('sync-stance', { src: '#' + hand.id });
    gun.setAttribute('gun', { pointDown: true });

    gun.setAttribute('gravity', false);
 },
  dropGun: function(hand, gun) {
    hand.removeState('holding-gun');
    // NOTE: most likely true, otherwise the player won't be able to grab the gun again
    // until the hand & gun exist each other so another obbcollisionstarted event can be emitted
    hand.addState('hovering-gun');

    gun.removeAttribute('sync-stance');
    gun.setAttribute('gravity', true);
  }
});