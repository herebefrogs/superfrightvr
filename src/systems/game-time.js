/**
 * Keep track of game time. Increases it when the player moves and the current active level calls for it. (e.g. game time isn't tracked on title screen)
 *
 * Property: game-time in sec
 *
 * Events: 'tick' emitted on the scene. Params: time and timeDelta both in sec.
 */
AFRAME.registerSystem('game-time', {
  schema: { type: 'number', default: 0 },
  init: function() {
    this.playerLimbs = document.querySelectorAll('[motion-tracker]');

    this.gameTimeHUD = document.querySelector('[game-time]');

    const sceneEl = this.el;
    sceneEl.addEventListener('level-loaded', () => { this.toggleGameTimeHUDVisibility(sceneEl.is('game-time-tracked')); })
  },
  tick: function(_time, timeDelta) {
    const sceneEl = this.el;

    if (sceneEl.is('game-time-tracked')) {
      timeDelta /= 1000;
      for (limb of this.playerLimbs) {
        if (limb.is('player-moving')) {
          this.data += timeDelta;

          this.gameTimeHUD.setAttribute('game-time', this.data);

          sceneEl.emit('tick', { time: this.data, timeDelta });
          break;
        }
      }
    }
  },
  toggleGameTimeHUDVisibility: function(visible) {
    this.gameTimeHUD.object3D.visible = visible;
  }
})