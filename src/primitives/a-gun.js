AFRAME.registerPrimitive('a-gun', {
  defaultComponents: {
    gun: {},
  },
});

AFRAME.registerComponent('gun', {
  init: function() {
    const barrel = document.createElement('a-box');
    barrel.setAttribute('color', '#000');
    barrel.setAttribute('depth', 0.2);
    barrel.setAttribute('height', 0.08);
    barrel.setAttribute('width', 0.04);
    barrel.object3D.position.y = 0.06;
    barrel.object3D.position.z = -0.08;
    this.el.appendChild(barrel);

    const grip = document.createElement('a-box');
    grip.setAttribute('color', '#000');
    grip.setAttribute('depth', 0.08);
    grip.setAttribute('height', 0.16);
    grip.setAttribute('width', 0.04);
    grip.object3D.rotation.x = -Math.PI/8
    this.el.appendChild(grip);
    // TODO there could also be a front sight, a hammer and a trigger
  },
  play: function() { this.el.setAttribute('obb-collider', { size: '0.1 0.1 0.1' }); },
  // pause: function() { this.el.removeAttribute('obb-collider'); }
});