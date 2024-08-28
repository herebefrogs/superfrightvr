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
    }
  },
  loadLevel: function(levelId) {
    // TODO probably need a dedicated system & component for this
    for (const el of document.querySelectorAll('[visible=true]')) {
      el.setAttribute('visible', false);
      el.pause();
    }
    document.querySelector(levelId).setAttribute('visible', true)
  }
});