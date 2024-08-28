AFRAME.registerComponent('gesture-tracker', {
  dependencies: ['hand-controls'],
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
    },
    obbcollisionended: function(e) {
      if (this.target?.components.portal) {
        this.el.removeState('hovering-portal');
      }
      this.target = null;
    }
  },
});