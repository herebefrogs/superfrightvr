/**
 * System overseeing the game.
 * 
 * Events:
 * - 'levelloaded' emitted on the scene after current active level changed
 */
AFRAME.registerSystem('level', {
  init: function() {
    this.hands = document.querySelectorAll('[gesture-tracker]');

    const sceneEl = this.el;
    sceneEl.addEventListener('loadlevel', (e) => this.loadLevel(e.detail.levelId));

    // the true "main()"
    sceneEl.addEventListener('loaded', () => {
      this.loadLevel('#title');

      // hack to avoid "next portal appears" sound
      this.el.addState('level-cleared');
  
      // this.loadLevel('#level_1');
      // DEBUG.move('#right', '0 1 -0.65', 100);
      // DEBUG.grip('#right', 200);
      // DEBUG.grabPortal('#right', 1);
      // DEBUG.grabGun('#left', 500);
      // DEBUG.move('#left', '-1 1.5 -0.5', 550);
      // DEBUG.shoot('#left', 600);
      // DEBUG.move('#left', '0 1.5 -0.5', 750);
      // DEBUG.punch('#left', 1000);
      // DEBUG.drop('#left', 1500);
      // DEBUG.grabPortal('#right', '#level_1', 2000);
    })
  },
  loadLevel: function(levelId) {
    const oldLevel = document.querySelector('a-level');
    if (oldLevel) {
      document.querySelector('a-scene').removeChild(oldLevel)
    }

    // clone the level templates
    // NOTE: given the #level_templates script tag is of type text/html,
    // its children aren't parsed as HTML elements but just 1 DOM text node.
    // we need a temporary div to parse these levels, so we can pick the one we need
    const levelTemplates = document.createElement('div');
    levelTemplates.innerHTML = document.querySelector(`#level_templates`).innerHTML;
    // pick the level we need
    const newLevel = levelTemplates.querySelector(`${levelId}`)

    document.querySelector('a-scene').appendChild(newLevel)

    // some scene state cleanups
    this.el[newLevel.getAttribute('gameTimeTracked') ? 'addState' : 'removeState']('game-time-tracked');
    this.el.removeState('level-cleared');
    this.el.removeState('game-over')

    // notify other systems and components to reset for the new level
    this.el.emit('levelloaded', { level: newLevel });
  },
});