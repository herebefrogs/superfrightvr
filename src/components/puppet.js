AFRAME.registerComponent('puppet', {
  events: {
    ttlreached: function(e) {
      const el = e.detail.el
      el.parentNode.removeChild(el);
      el.setAttribute('health', { hp: 0 })
    }
  }
})