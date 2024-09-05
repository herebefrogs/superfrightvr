const grabEntity = (handId, levelId, delay, entityType) => {
  setTimeout(() => {
    const hand = document.querySelector(handId);
    hand.components['gesture-tracker'].targets[`hovering-${entityType}`] = document.querySelector(`${levelId} a-${entityType}`)
    hand.addState(`hovering-${entityType}`);
    hand.addState('grabbing');
  }, delay)
}

window.DEBUG = {
  ...window.DEBUG,
  grabGun: (handId, levelId, delay) => {
    grabEntity(handId, levelId, delay, 'gun');
  },
  grabPortal: (handId, levelId, delay) => {
    grabEntity(handId, levelId, delay, 'portal');
  },
  drop: (handId, delay) => {
    setTimeout(() => {
      const hand = document.querySelector(handId);
      hand.removeState('grabbing');
    }, delay);
  },
  move: (handId, position, delay) => {
    setTimeout(() => {
      const hand = document.querySelector(handId);
      hand.setAttribute('position', position);
    }, delay);
  },
  shoot: (handId, delay) => {
    setTimeout(() => {
      const hand = document.querySelector(handId);
      hand.emit('triggerdown');
    }, delay);
  },
  punch: (handId, delay) => {
    setTimeout(() => {
      const hand = document.querySelector(handId);
      hand.removeState('grabbing');
      hand.emit('triggerdown');
    }, delay);
  },
  loadLevel: (levelId, delay) => {
    setTimeout(() => {
      const sceneEl = document.querySelector('a-scene');
      sceneEl.emit('loadlevel', { levelId })
    }, delay)
  }
}