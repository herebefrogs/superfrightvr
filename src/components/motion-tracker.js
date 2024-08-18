/**
 * Motion-Tracker
 *
 * Purpose: This component keeps track whether the entity it's applied to
 * is changing position or rotation by comparing the previous tick's values
 * to the current values.
 *
 * Use-Case: Typically applied to the a-camera primitive or entities with hand-controls component
 * to detect whether the player is moving their body, head or hands/controllers.
 *
 * Side-effect: add 'player-moving' state on its entity if motion is detected, or removes it if static.
 */

const POSITION_THRESHOLD = 0.001;
const ROTATION_THRESHOLD = 0.0001;

function vector3FromEuler(rot) {
  return new THREE.Vector3(rot.x, rot.y, rot.z);
}

AFRAME.registerComponent('motion-tracker', {
  init: function() {
    // cache initial position and rotation
    this.prevPos = this.el.object3D.position.clone();
    this.prevRot = vector3FromEuler(this.el.object3D.rotation);
  },
  // TODO pause/resume this behaviour on pause/play
  tick: function() {
    const deltaP = this.prevPos.distanceToSquared(this.el.object3D.position);

    if (deltaP > POSITION_THRESHOLD) {
      // only clone vector once it's necessary
      this.prevPos = this.el.object3D.position.clone();
      
      this.el.addState('player-moving');
    } else {
      // perform rotation check when position check fails as it requires
      // the creation of a vector just to perform the test
      const currRot = vector3FromEuler(this.el.object3D.rotation);
      const deltaR = this.prevRot.distanceToSquared(currRot);
      
      if (deltaR > ROTATION_THRESHOLD) {
        this.prevRot = currRot;
        this.el.addState('player-moving');
      } else {
        this.el.removeState('player-moving');
      }
    }
  }
})