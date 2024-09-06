/**
 * Time To Live keeps track of game time left to live.
 * 
 * Events
 * - 'ttlreached' event when ttl reached
 */
AFRAME.registerComponent('ttl', {
  schema: { type: 'number', default: 10 },
  init: function() {
    this.timeLeft = this.data;
    let parent = this.el.parentNode;
    while (parent) {
      if (parent.getAttribute('level')) {
        this.levelId = parent.id;
        break;
      }
      parent = parent.parentNode;
    }
    this.el.sceneEl.addEventListener('tick', (e) => this._tick(e.detail.time, e.detail.timeDelta));
  },
  _tick: function(time, timeDelta) {
    if (this.el.sceneEl.systems.level.activeLevel.id === this.levelId) {
      this.timeLeft -= timeDelta;

      if (this.timeLeft < 0) {
        this.el.removeAttribute('ttl')
        this.el.emit('ttlreached', { el: this.el });
      }
    }
  }
});