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
    this.loadLevel('#title');

    const sceneEl = this.el;
    sceneEl.addEventListener('load-level', (e) => this.loadLevel(e.detail.levelId));

    // DEBUG
    // setTimeout(() => {
    //   sceneEl.emit('load-level', { levelId: '#level_1' })
    // }, 1500)
    // setTimeout(() => {
    //   sceneEl.emit('load-level', { levelId: '#level_2' })
    // }, 3000)
  },
  loadLevel: function(levelId) {
    let activeLevel = this.activeLevel;

    if (activeLevel) {
      this.toggleLevel(activeLevel, false)
    }

    activeLevel = document.querySelector(levelId)
    this.toggleLevel(activeLevel, true)
    this.activeLevel = activeLevel;

    this.el.emit('level-loaded', { level: activeLevel });
  },
  toggleLevel: function(levelEl, active) {
    levelEl.setAttribute('level', { active });
    const sceneEl = this.el;
    sceneEl[active ? 'addState' : 'removeState'](levelEl.id);
    sceneEl[levelEl.getAttribute('level').gameTimeTracked ? 'addState' : 'removeState']('game-time-tracked');
  }
});