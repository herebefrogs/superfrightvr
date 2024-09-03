/**
 * System overseeing the game.
 * 
\* Events:
 * - 'level-loaded' emitted on the scene after current active level changed
 */
AFRAME.registerSystem('level', {
  init: function() {
    this.hands = document.querySelectorAll('[gesture-tracker]');

    const sceneEl = this.el;
    sceneEl.addEventListener('load-level', (e) => this.loadLevel(e.detail.levelId));

    this.loadLevel('#title');
    // this.loadLevel('#level_1');
    // DEBUG.grabPortal('#right', '#level_1', 100);

    // DEBUG.loadLevel('#level_1', 0)
    // DEBUG.grabGun('#left', '#level_1', 500);
    // DEBUG.buttonEvent('#left', 'triggerdown', 1000);
    // DEBUG.grabPortal('#right', '#level_1', 1000);
    // DEBUG.drop('#left', 1500);

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
    // remove all objects moved by the puppeteer in this level
    this.el.systems.puppeteer.reset();

    this.el.emit('level-loaded', { level: activeLevel });
  },
  toggleLevel: function(levelEl, active) {
    levelEl.setAttribute('level', { active });
    const sceneEl = this.el;
    sceneEl[active ? 'addState' : 'removeState'](levelEl.id);
    sceneEl[levelEl.getAttribute('level').gameTimeTracked ? 'addState' : 'removeState']('game-time-tracked');
  }
});