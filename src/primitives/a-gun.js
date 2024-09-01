AFRAME.registerPrimitive('a-gun', {
  defaultComponents: {
    gun: {},
    'dynamic-collider': { size: 0.1 },
    raycaster: {
      enabled: false,
      objects: '#world',
    }
  },
  mapping: {
    pointDown: 'gun.pointDown'
  }
});

AFRAME.registerComponent('gun', {
  schema: {
    pointDown: { type: 'boolean', default: false }
  },
  init: function() {
    this.gimbal = document.createElement('a-entity');
    // when hand-controls's rotation is applied to this component/primitive via sync-stance
    // the gun is facing upward because the hand model is facing downward by default and
    // magically adjusted by hand-controls, so we need a way to correct the orientation
    // of the gun once it is grabbed.
    this.gimbal.object3D.rotation.x = this.data.pointDown ? -Math.PI/2 : 0;

    const barrel = document.createElement('a-box');
    barrel.setAttribute('color', '#000');
    barrel.setAttribute('depth', 0.2);
    barrel.setAttribute('height', 0.08);
    barrel.setAttribute('width', 0.04);
    barrel.object3D.position.y = 0.06;
    barrel.object3D.position.z = -0.08;
    this.gimbal.appendChild(barrel);

    const grip = document.createElement('a-box');
    grip.setAttribute('color', '#000');
    grip.setAttribute('depth', 0.08);
    grip.setAttribute('height', 0.16);
    grip.setAttribute('width', 0.04);
    grip.object3D.rotation.x = -Math.PI/8
    this.gimbal.appendChild(grip);

    // TODO there could also be a front sight, a hammer and a trigger...

    this.el.appendChild(this.gimbal);
  },
  update: function() {
    this.gimbal.object3D.rotation.x = this.data.pointDown ? -Math.PI/2 : 0;
    this.el.setAttribute('raycaster',
      this.data.pointDown
        // correct the raycaster line direction if needed, and move the origin in front of the gun's nozzle
        ? { direction: '0 -1 0', origin: '0 -0.2 -0.08' }
        : { direction: '0 0 -1', origin: '0 0.09 -0.2' }
    );
  },
});