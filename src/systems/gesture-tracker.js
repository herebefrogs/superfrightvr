AFRAME.registerSystem('gesture-tracker', {
  init: function() {
    this.hands = document.querySelectorAll('[gesture-tracker]');
  },
  tick: function() {
    for (const hand of this.hands) {
      const gesture = hand.components['gesture-tracker'];

      if (hand.is('hovering-portal') && hand.is('grabbing')) {
        hand.removeState('hovering-portal');
        hand.removeState('grabbing')
        const portal = gesture.getTarget('hovering-portal');
        zzfx(1,.05,166,.07,.11,.15,0,2.8,-3,-186,0,0,.1,0,0,.1,0,.55,.26,0,0);  // portal grabbed
        this.el.emit('loadlevel', { levelId: portal.components.portal.data.to });
      }
      else if (hand.is('hovering-gun') && hand.is('grabbing')) {
        const gun = gesture.getTarget('hovering-gun');
        // make sure the gun is not already grabbed by another hand before grabbing it
        if (!gun.is('grabbed')) {
          this.grabGun(gun, hand, gesture);
        }
      }
      else if (hand.is('holding-gun') && !hand.is('grabbing')) {
        this.dropGun(gesture.getTarget('holding-gun'), hand, gesture);
      }
      else if (hand.is('holding-gun') && hand.is('shooting')) {
        // wouldn't work for a machine gun
        hand.removeState('shooting');
        this.shootGun(gesture.getTarget('holding-gun'));
      }
    }
  },
  grabGun: function(gun, hand, gesture) {
    zzfx(1,.05,43,0,.44,.03,1,1.8,-18,-58,0,0,.01,.4,0,.1,0,.77,.11,0,0); // drop gun

    // remove orignal gun from scene and hand's targets
    document.querySelector('a-level').removeChild(gun);
    gesture.deleteTarget('hovering-gun');

    // make a new gun
    // NOTE: re-parenting isn't supported in AFRAME, the original gun doesn't render if attached to the hand!
    const heldGun = document.createElement('a-gun');
    heldGun.setAttribute('health', gun.getAttribute('health'));
    // configure the gun correctly
    heldGun.addState('grabbed');
    heldGun.setAttribute('raycaster', { enabled: true });
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
    hand.appendChild(gimbal);
    // set the cloned gun as the hand's targets
    gesture.setTarget(heldGun, 'holding-gun');


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
    hand.removeChild(gimbal);
    // and the gun from the hand's targets;
    gesture.deleteTarget('holding-gun');

    // make a new gun
    // NOTE: re-parenting isn't supported in AFRAME, the original gun doesn't render if attached to the hand!
    const droppedGun = document.createElement('a-gun');
    droppedGun.setAttribute('health', heldGun.getAttribute('health'));
    droppedGun.setAttribute('position', hand.getAttribute('position'));
    droppedGun.object3D.rotation.set(gimbalWorldRotation.x, gimbalWorldRotation.y, gimbalWorldRotation.z);
    droppedGun.setAttribute('raycaster', { enabled: false });
    droppedGun.setAttribute('gravity', true);

    // add free to the scene and hand's targets
    document.querySelector('a-level').appendChild(droppedGun);
    // NOTE: most likely true, otherwise the player won't be able to grab the gun again
    // until the hand & gun exist each other so another obbcollisionstarted event can be emitted
    gesture.setTarget(droppedGun, 'hovering-gun');

  },
  shootGun: function(gun) {
    // NOTE we should only call shootGun when it's true, but it's safer to check
    if (gun.components.raycaster.data.enabled) {
      zzfx(1,.05,62,.01,.07,.4,2,2.8,6,-8,0,0,0,1.4,28,.4,0,.4,.1,.46,181); // gun shot
      const world = document.querySelector('#world');

      const intersection = gun.components.raycaster.getIntersection(world)
      const normal = intersection.normal;
      const direction = { x: -normal.x, y: -normal.y, z: -normal.z };

      const bullet = document.createElement('a-bullet');
      // NOTE: hand rotation cannot be trusted due to the extra 90deg counterclockwise to display its model straight
      // so work from the gun which is pointing in the direction we want to bullet to follow
      const gunWorldRotation = (new THREE.Euler()).setFromQuaternion(
        gun.object3D.getWorldQuaternion(new THREE.Quaternion()),
        'XYZ'
      );
      bullet.object3D.rotation.set(gunWorldRotation.x, gunWorldRotation.y, gunWorldRotation.z);

      const origin = gun.getAttribute('raycaster').origin;
      const nozzlePosition = gun.object3D.localToWorld(new THREE.Vector3(origin.x, origin.y, origin.z));

      bullet.setAttribute('position', nozzlePosition);
      bullet.setAttribute('linear-motion', { direction });
      bullet.setAttribute('health', { group: gun.getAttribute('health').group });

      document.querySelector('a-level').appendChild(bullet);
    }
  }
});