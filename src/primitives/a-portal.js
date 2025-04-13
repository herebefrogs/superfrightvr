AFRAME.registerPrimitive('a-portal', {
  defaultComponents: {
    portal: {},
    // // NOTE: it's less code and less nested entities to borrow <a-pyramid>'s geometry
    // // than to add <a-pyramid> as a child
    geometry: {
      primitive: 'cone',
      thetaStart: 45,
      segmentsRadial: 4,
      segmentsHeight: 1,
      radiusTop: 0,
      radiusBottom: 0.2,
      height: 0.175
    },
    material: {
      color: 'black',
      opacity: 0.45,
      transparent: true,
      flatShading: true
    },
    'dynamic-collider': { size: 0.15 },
  },
  mappings: {
    to: 'portal.to',
    'text-value': 'portal.textValue',
    'text-width': 'portal.textWidth',
  }
})

AFRAME.registerComponent('portal', {
  schema: {
    to: { type: 'string' },
    textValue: { type: 'string' },
    textWidth: { type: 'number' }
  },
  init: function() {
    const data = this.data;
    const text = document.createElement('a-entity');
    text.setAttribute('text', {
      value: data.textValue,
      align: 'center',
      font: 'monoid',
      width: data.textWidth,
    });
    text.setAttribute('position', { x: 0, y: -0.04, z: 0.05 });
    this.el.appendChild(text);
  }
});