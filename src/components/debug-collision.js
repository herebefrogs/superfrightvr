AFRAME.registerComponent('debug-collision', {
  init: function() {
    const targets = document.querySelectorAll('[obb-collider]');
    for (let t of targets) {
      t.addEventListener('obbcollisionstarted', (e) => { console.log(e); this.el.setAttribute('value', e.target.id + ' entered ' + e.detail.withEl.id); })
      t.addEventListener('obbcollisionended', (e) => { this.el.setAttribute('value', e.target.id + ' exited ' + e.detail.withEl.id); })
    }
  },
});