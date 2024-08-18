AFRAME.registerSystem('puppeteer', {
  init: function() {
    this.gameTime = 0;

    this.playerLimbs = document.querySelectorAll('[motion-tracker]');

    // TODO components interested by game time change should register themselves,
    // rather than puppeteer reaching out to them
    this.puppets = document.querySelectorAll('[puppet]');
    this.gameTimer = document.querySelector('[game-time]');
  },
  tick: function(_time, timeDelta) {
    let timeChanged = false;

    for (el of this.playerLimbs) {
      if (el.is('player-moving')) {
        this.gameTime += timeDelta;
        timeChanged = true;
        break;
      }
    }

    if (timeChanged) {
      this.gameTimer.emit('game-tick', { time: this.gameTime, timeDelta }, false);

      for (el of this.puppets) {
        el.emit('game-tick', { time: this.gameTime, timeDelta }, false);
      }
    }
  }
})