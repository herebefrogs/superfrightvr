const grabEntity = (handId, delay, entityType, callback) => {
  setTimeout(() => {
    const hand = document.querySelector(handId);
    // this should be
    // 1. move hand to position of entity
    // 2. emit grip
    // hand.components['gesture-tracker'].targets[`hovering-${entityType}`] = [document.querySelector(`a-level a-${entityType}`)]
    hand.components['gesture-tracker'].setTarget(document.querySelector(`a-level a-${entityType}`), `hovering-${entityType}`);
//    hand.addState(`hovering-${entityType}`);
    hand.addState('grabbing');
    if (callback) {
      callback();
    }
  }, delay)
}

window.DEBUG = {
  ...window.DEBUG,
  grabGun: (handId, delay) => {
    grabEntity(handId, delay, 'gun');
  },
  grabPortal: (handId, delay) => {
    grabEntity(handId, delay, 'portal');
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
  rotate: (handId, rotation, delay) => {
    setTimeout(() => {
      const hand = document.querySelector(handId);
      hand.setAttribute('rotation', rotation);
    }, delay);
  },
  grip: (handId, delay) => {
    setTimeout(() => {
      const hand = document.querySelector(handId);
      hand.emit('gripdown');
    }, delay);
  },
  ungrip: (handId, delay) => {
    setTimeout(() => {
      const hand = document.querySelector(handId);
      hand.emit('gripup');
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
      hand.removeState('grabbing'); // why?
      // punch is grip & shoot
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