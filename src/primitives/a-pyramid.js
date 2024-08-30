AFRAME.registerPrimitive('a-pyramid', {
  defaultComponents: {
    geometry: {
      primitive: 'cone',
      thetaStart: 45,
      segmentsRadial: 4,
      segmentsHeight: 1,
      radiusTop: 0,
    },
  },
  mappings: {
    color: 'material.color',
    height: 'geometry.height',
    width: 'geometry.radiusBottom',
  }
});