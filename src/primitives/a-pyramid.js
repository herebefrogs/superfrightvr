AFRAME.registerPrimitive('a-pyramid', {
  defaultComponents: {
    geometry: {
      primitive: 'cone',
      thetaStart: 45,
      segmentsRadial: 4,
      segmentsHeight: 1,
      radiusTop: 0,
    },
    material: {
      flatShading: true,
    }
  },
  mappings: {
    color: 'material.color',
    height: 'geometry.height',
    width: 'geometry.radiusBottom',
  }
});