AFRAME.registerSystem('game-time', {
  schema: { type: 'number', default: 0 },
  init: function() {
    this.playerLimbs = document.querySelectorAll('[motion-tracker]');

    this.gameTimeEl = document.querySelector('[game-time]');
  },
  tick: function(_time, timeDelta) {
    for (el of this.playerLimbs) {
      if (el.is('player-moving')) {
        this.data += timeDelta;
        this.gameTimeEl.setAttribute('game-time', this.data);
        this.el.emit('step', { time: this.data, timeDelta });
        break;
      }
    }
  }
})