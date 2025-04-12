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
    this.el.sceneEl.addEventListener('tick', (e) => this._tick(e.detail.time, e.detail.timeDelta));
  },
  _tick: function(time, timeDelta) {
    this.timeLeft -= timeDelta;

    if (this.timeLeft < 0) {
      this.el.removeAttribute('ttl')
      this.el.emit('ttlreached', { el: this.el });
    }
  }
});