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
        const targetGroup = target.components.health.data.group
        const elGroup = this.el.components.health.data.group;
        if (
            // we don't care about collision within the same group (e.g. player hands)
            (elGroup !== targetGroup)
            && (
              // player is punching without a gun in hand
              (elGroup === 'friend' && this.el.is('shooting') && !this.el.is('holding-gun'))
              // enemy is punching player who isn't punching back
              || (elGroup === 'foe' && target.components['motion-tracker'] && !target.is('shooting'))
            )
          ) {
          // kill target
          target.setAttribute('health', { hp: 0 });
        }
      }
    },
  },
  update: function(oldData) {
    if (this.data.hp <= 0) {

      if (!this.el.components['motion-tracker'] && !this.el.parentNode.components['motion-tracker']) {
        // TODO should animate death
        this.el.parentNode.removeChild(this.el)
        if (this.el.components['sniper']) {
          this.el.setAttribute('sniper', { enabled: false });
        }
      }
    }
  }
})