/**
 * Handle entities' hit points, and hand punches
 *
 * Schema:
 * - hp: hit point. Default 1. Right now 1 hit equal immediate death
 * - group: collision group so that player hands don't kill each other, for example.
 *
 * React to events:
 * - obbcollisionstarted: player hands punching targets with 'health' components
 */
AFRAME.registerComponent('health', {
  schema: {
    hp: { type: 'int', default: 1 },
    group: { type: 'string', default: 'foe' }
  },
  events: {
    obbcollisionstarted: function(e) {
      const target = e.detail.withEl;
      if (target.components.health) {
        if ((this.el.components.health.data.group !== target.components.health.data.group)
            // player is punching without a gun in hand
            && this.el.is('shooting') && !this.el.is('holding-gun')) {
          // kill target
          target.setAttribute('health', { hp: 0 });
        }
      }
    },
  },
  update: function(oldData) {
    if (this.data.hp <= 0) {
      // TODO should animate death
      this.el.parentNode.removeChild(this.el)
    }
  }
})