// TODO could also be a primitive wrapping <a-text>
AFRAME.registerComponent('game-time', {
  events: {
    'game-tick': function(e) {
      this.el.setAttribute('value', this.format(e.detail.time/1000) + 's');
    }
  },
  init: function() {
    this.format = (new Intl.NumberFormat(navigator.language, {minimumFractionDigits: 2, maximumFractionDigits: 2})).format;
  },
});