AFRAME.registerComponent('gesture-tracker', {
  events: {
    gripdown: function(e) { this.el.addState('grabbing') },
    gripup: function(e) {  this.el.removeState('grabbing') },
    triggerdown: function(e) { this.el.addState('shooting') },
    triggerup: function(e) {   this.el.removeState('shooting') },
    obbcollisionstarted: function (e) {
      const target = e.detail.withEl;

      if (target.components['gesture-tracker']) {
        // a hand cannot grab another hand
        return;
      }

      if (target.components.portal) {
        this.el.addState('hovering-portal');
        this.targets['hovering-portal'] = target;
      }
      else if (target.components.gun) {
        this.el.addState('hovering-gun');
        this.targets['hovering-gun'] = target;
      }
    },
    obbcollisionended: function(e) {
      const target = e.detail.withEl;

      if (target.components['gesture-tracker']) {
        // a hand cannot grab another hand
        return;
      }

      if (target.components.portal) {
        this.el.removeState('hovering-portal');
        delete this.targets['hovering-portal'];
      }
      else if (target.components.gun) {
        this.el.removeState('hovering-gun');
        delete this.targets['hovering-gun'];
      }
    }
  },
  init: function() {
    this.targets = {}
  },
  getTarget: function(state) {
    return this.targets[state]
  },
  updateTarget: function(oldState, newState) {
    this.targets[newState] = this.targets[oldState];
    delete this.targets[oldState];
    return this.targets[newState];
  },
  reset: function() {
    // release the target and any state that could be associated with it
    for (state in this.targets) {
      this.targets[state].removeState('grabbed');
    }
    this.targets = {};
    this.el.removeState('holding-gun');
    this.el.removeState('hovering-gun');
    this.el.removeState('hovering-portal');
  }
});