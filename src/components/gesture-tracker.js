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
        this.setTarget(target, 'hovering-portal');
      }
      else if (target.components.gun) {
        this.setTarget(target, 'hovering-gun');
      }
    },
    obbcollisionended: function(e) {
      const target = e.detail.withEl;

      if (target.components['gesture-tracker']) {
        // a hand cannot grab another hand
        return;
      }

      if (target.components.portal) {
        this.deleteTarget('hovering-portal');
      }
      else if (target.components.gun) {
        this.deleteTarget('hovering-gun');
      }
    }
  },
  init: function() {
    this.targets = {}
  },
  setTarget: function(target, state) {
    this.el.addState(state);
    this.targets[state] = target;
  },
  getTarget: function(state) {
    return this.targets[state]
  },
  deleteTarget: function(state) {
    this.el.removeState(state)
    delete this.targets[state];
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
    const gun = document.querySelector(`#${this.el.id} a-gun`)
    if (gun) {
      this.el.removeChild(gun);
    }
  }
});