AFRAME.registerComponent('gesture-tracker', {
  dependencies: ['hand-controls', 'obb-collider'],
  events: {
    gripdown: function(e) { this.el.addState('grabbing') },
    gripup: function(e) {  this.el.removeState('grabbing') },
    triggerdown: function(e) { this.el.addState('shooting') },
    triggerup: function(e) {   this.el.removeState('shooting') },
    obbcollisionstarted: function (e) {
      // NOTE: unfortunately, there is no 'object' time for target to be defined as a schema property
      this.target = e.detail.withEl;
      if (this.target.components.portal) {
        this.el.addState('hovering-portal');
      }
      else if (this.target.components.gun) {
        this.el.addState('hovering-gun');
      }
    },
    obbcollisionended: function(e) {
      if (this.target?.components.portal) {
        this.el.removeState('hovering-portal');
      }
      else if (this.target?.components.gun) {
        this.el.removeState('hovering-gun');
      }
      this.target = null;
    }
  },
  reset: function() {
    // release the target and any state that could be associated with it
    this.target = null;
    this.el.removeState('holding-gun');
    this.el.removeState('hovering-gun');
    this.el.removeState('hovering-portal');
  }
});