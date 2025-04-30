AFRAME.registerComponent('gesture-tracker', {
  events: {
    gripdown: function(e) { this.el.addState('grabbing') },
    gripup: function(e) {  this.el.removeState('grabbing') },
    triggerdown: function(e) { this.el.addState('shooting') },
    triggerup: function(e) {   this.el.removeState('shooting') },
    obbcollisionstarted: function (e) {
      const target = e.detail.withEl;

      if (target.hasAttribute('gesture-tracker')) {
        // a hand cannot grab another hand
        return;
      }

      if (target.hasAttribute('portal') || target.hasAttribute('gun')) {
        this.addState('hovering', target);
      }
    },
    obbcollisionended: function(e) {
      const target = e.detail.withEl;

      if (target.hasAttribute('gesture-tracker')) {
        // a hand cannot drop another hand
        return;
      }

      if (target.hasAttribute('portal') || target.hasAttribute('gun')) {
        this.removeState('hovering', target);
      }
    }
  },
  init: function() {
    this.state2targets = {
      'hovering': [],
      'holding': [],
    }
  },
  addState: function(state, target) {
    // guarantee uniqueness of targets
    this.state2targets[state] = this.state2targets[state].filter(t => t !== target);
    this.state2targets[state].push(target);
    if (state === 'holding') {
      target.addState('held');
    }
    this.el.addState(state);
  },
  getState: function(state) {
    if (state === 'holding') {
      // can only hold 1 target at a time
      return this.state2targets[state][0];
    }
    // can hover multiple targets at a time
    return this.state2targets[state];
  },
  removeState: function(state, target) {
    // saveguard other targets associated with this state
    this.state2targets[state] = this.state2targets[state].filter(t => t !== target);
    if (state === 'holding') {
      target.removeState('held');
    }
    if (!this.state2targets[state].length) {
        // we should only remove the element's state if there is no more targets associated
        this.el.removeState(state);
    }
  },
  reset: function() {
    // NOTE: this is necessary to avoid that a gun held in hand while changing levels
    // is brought into the next level.
    // release targets and any state that could be associated with it
    for (state in this.state2targets) {
      this.state2targets[state].forEach(t => this.removeState(state, t));
    }
    // remove any gun that could be attached to the hand
    const gun = document.querySelector(`#${this.el.id} a-gimbal`)
    if (gun) {
      this.el.removeChild(gun);
    }
  }
});