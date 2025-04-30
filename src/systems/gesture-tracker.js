AFRAME.registerSystem('gesture-tracker', {
  init: function() {
    this.hands = Array.from(document.querySelectorAll('[gesture-tracker]'));
  },
  tick: function() {
    this.hands.find(hand => {
      // NOTE: for reasons unknown, hand.getAttribute('gesture-tracker') returns {}
      // despite the component existing on this element...
      const gesture = hand.components['gesture-tracker'];

      // NOTE: check that the hand isn't holding something else
      // to prevent it from grabbing a second gun while already holding one
      if (hand.is('hovering') && hand.is('grabbing') && !hand.is('holding')) {
        // we don't know yet what the targets are
        const targets = gesture.getState('hovering');

        // NOTE: use find() instead of forEach() so we can break out of the loop
        const target = targets.find(target => {
          if (target.hasAttribute('portal')) {
            // no need to remove any state, the level will reset the hand's gesture-tracker component
            zzfx(1,.05,166,.07,.11,.15,0,2.8,-3,-186,0,0,.1,0,0,.1,0,.55,.26,0,0);  // portal grabbed
            // NOTE: for reasons unknown, target.getAttribute('portal') returns {}
            // despite the component existing on this element...
            this.el.emit('loadlevel', { levelId: target.components.portal.data.to });
            // do not try to hold any other targets
            return true;
          }
          // NOTE: check that the target isn't held by another hand
          // to prevent 2 hands from holding the same gun
          if (target.hasAttribute('gun') && !target.is('held')) {
            // no need to remove any state, the level will reset the hand's gesture-tracker component
            this.grabGun(target, hand, gesture);
            // do not try to hold any other targets
            return true;
          }
          // continue to next target
        })
        // do not try to process another hand if this one has already grabbed something
        return !!target;
      }
      else if (hand.is('holding') && !hand.is('grabbing')) {
        const target = gesture.getState('holding');

        if (target.hasAttribute('gun')) {
          this.dropGun(target, hand, gesture);
          // NOTE: do not try to process another hand if this one has already dropped a gun.
          // this is because the left hand is processed before the right hand (HTML markup order).
          // If the left hand drops a gun, it will add a copy of the gun to the scene but the gun
          // it originally held no longer has the "held" state for the rest of the tick/for loop
          // and could be a target of the right hand trying to grab it. This would create a 2nd
          // copy of the gun in the right hand, while the 1st copy is free falling, essentially
          // duplicating the gun out of thin air.
          return true;
        }
      }
      else if (hand.is('holding') && hand.is('shooting')) {
        const target = gesture.getState('holding');

        if (target.hasAttribute('gun')) {
          // wouldn't work for a machine gun
          hand.removeState('shooting');
          // TODO this method should be moved to the gun component
          this.shootGun(target);
          return true;
        }
      }
      return false;
    })
  },
  grabGun: function(gun, hand, gesture) {
    zzfx(1,.05,43,0,.44,.03,1,1.8,-18,-58,0,0,.01,.4,0,.1,0,.77,.11,0,0); // drop gun

    // remove orignal gun from scene
    // this will trigger an obbcollisionended event which will remove the hovering state from whichever hand was over this gun
    gun.parentNode.removeChild(gun);

    // make a new gun
    // NOTE: re-parenting isn't supported in AFRAME, the original gun doesn't render when attached to the hand!
    const heldGun = document.createElement('a-gun');
    heldGun.setAttribute('health', gun.getAttribute('health'));
    // position the gun relative to the gimbal as opposed to the global world
    heldGun.setAttribute('position', '0 0 0');
  
    // create a gimbal primitive
    const gimbal = document.createElement('a-gimbal');
    // NOTE: A-FRAME hand models are pointing down, and rotated 90 degrees along the x-axis to componensate.
    // unfortunately, that orientation applies to all its children as well, so the gimbal sits between the hand
    // and the gun to counteract that rotation and leave the gun pointing forward instead of up.
    gimbal.setAttribute('rotation', '-90 0 0');

    // add gun to the gimbal, and the gimble to the hand
    gimbal.appendChild(heldGun);
    // this will trigger an obbcollisionstarted event which will add the hovering state for this gun
    hand.appendChild(gimbal);
    gesture.addState('holding', heldGun);
  },
  dropGun: function(heldGun, hand, gesture) {
    zzfx(1,.05,43,0,.44,.03,1,1.8,-18,-58,0,0,.01,.4,0,.1,0,.77,.11,0,0); // drop gun

    const gimbal = heldGun.parentNode;

    // NOTE: hand is artificially rotated 90 degrees along the x-axis so that would make the gun point up
    // instead of foward. Given the gimbal is what counteracts that rotation, we want to gun rotation to
    // match the gimbal's in world coordinates rather than relative to the hand coordinates.
    // We need to get the gimbal's world rotation before removing it from the hand, or we'll get null readings.
    const gimbalWorldRotation = (new THREE.Euler()).setFromQuaternion(
      gimbal.object3D.getWorldQuaternion(new THREE.Quaternion()),
      'XYZ'
    );

    // remove grabbed grun from hand and hand's targets
    // this will trigger an obbcollisionended event which will remove the hovering state for this gun
    hand.removeChild(gimbal);
    // and the gun from the hand's targets;
    gesture.removeState('holding', heldGun);

    // make a new gun
    // NOTE: re-parenting isn't supported in AFRAME, the original gun doesn't render if attached to the hand!
    const droppedGun = document.createElement('a-gun');
    droppedGun.setAttribute('health', heldGun.getAttribute('health'));
    droppedGun.setAttribute('position', hand.getAttribute('position'));
    droppedGun.object3D.rotation.set(gimbalWorldRotation.x, gimbalWorldRotation.y, gimbalWorldRotation.z);
    droppedGun.setAttribute('gravity', true);

    // add free gun to the scene
    // this will trigger an obbcollisionstarted event which will add the hovering state for this gun
    // so it can be grabbed again without having to leave its collision box
    document.querySelector('a-level').appendChild(droppedGun);
  },
  shootGun: function(gun) {
    zzfx(1,.05,62,.01,.07,.4,2,2.8,6,-8,0,0,0,1.4,28,.4,0,.4,.1,.46,181); // gun shot

    const nozzlePosition = gun.object3D.localToWorld(new THREE.Vector3(0, 0.08, -0.2));
    const gunRotation = gun.object3D.getWorldDirection(new THREE.Vector3());
    const gunDirection = gunRotation.clone().negate();

    const bullet = document.createElement('a-bullet');
    bullet.setAttribute('position', nozzlePosition);
    bullet.object3D.lookAt(gunRotation);
    bullet.setAttribute('linear-motion', { direction: gunDirection });
    bullet.setAttribute('health', { group: gun.getAttribute('health').group });

    document.querySelector('a-level').appendChild(bullet);
  }
});