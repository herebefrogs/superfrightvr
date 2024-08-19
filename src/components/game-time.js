AFRAME.registerComponent('game-time', {
  schema: { type: 'number', default: 0 },
  init: function() {
    this.format = (new Intl.NumberFormat(navigator.language, {minimumFractionDigits: 2, maximumFractionDigits: 2})).format;
  },
  update: function(oldData) {
    this.el.setAttribute('value', this.format(this.data/1000) + 's');
  }
});