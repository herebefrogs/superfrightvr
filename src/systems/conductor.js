/**
 * System overseeing the game.
 * 
 * Side-effects:
 * - game-time-on state on scene to indicate whether the current active level calls for increasing game time when player moves
 * 
 * Events:
 * - 'level-loaded' emitted on the scene after current active level changed
 */
AFRAME.registerSystem('conductor', {
  init: function() {
    this.hands = document.querySelectorAll('[gesture-tracker]');

    const sceneEl = this.el;
    sceneEl.addEventListener('load-level', (e) => this.loadLevel(e.detail.levelId));

    this.loadLevel('#title');

    // DEBUG.loadLevel('#level_1', 0)
    // DEBUG.grabGun('#leftHand', '#level_1', 500);
    // DEBUG.grabPortal('#rightHand', '#level_1', 1000);
    // DEBUG.drop('#leftHand', 1500);

    // DEBUG.log('foo')
  },
  loadLevel: function(levelId) {
    let activeLevel = this.activeLevel;

    if (activeLevel) {
      this.toggleLevel(activeLevel, false)
    }

    activeLevel = document.querySelector(levelId)
    this.toggleLevel(activeLevel, true)
    this.activeLevel = activeLevel;

    // make hand controllers' release their grabbed objects
    this.hands.forEach(hand => { hand.components['gesture-tracker']?.reset() })

    this.el.emit('level-loaded', { level: activeLevel });
  },
  toggleLevel: function(levelEl, active) {
    levelEl.setAttribute('level', { active });
    const sceneEl = this.el;
    sceneEl[active ? 'addState' : 'removeState'](levelEl.id);
    sceneEl[levelEl.getAttribute('level').gameTimeTracked ? 'addState' : 'removeState']('game-time-tracked');
  }
});