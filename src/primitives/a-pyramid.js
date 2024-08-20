AFRAME.registerPrimitive('a-pyramid', {
  defaultComponents: {
    pyramid: {},
  },
  mappings: {
    color: 'pyramid.color',
    depth: 'pyramid.depth',
    height: 'pyramid.height',
    width: 'pyramid.width',
  }
});

AFRAME.registerComponent('pyramid', {
  schema: {
    color: { type: 'string', default: '#f0f' },
    depth: { type: 'number', default: 1 },
    width: { type: 'number', default: 1 },
    height: { type: 'number', default: 0.75 },
  },
  init: function() {
    const material = this.el.getAttribute('material');
    this.bottomEl = document.createElement('a-plane');
    this.bottomEl.setAttribute('material', material);
    this.bottomEl.setAttribute('color', this.data.color);
    this.bottomEl.setAttribute('height', this.data.depth); // this is not a mistake
    this.bottomEl.setAttribute('width', this.data.width);
    this.bottomEl.object3D.rotation.x = Math.PI/2;
    this.el.appendChild(this.bottomEl);
    
    this.backEl = document.createElement('a-triangle');
    this.backEl.setAttribute('material', material);
    this.backEl.setAttribute('color', this.data.color);
    this.backEl.setAttribute('vertex-a', `0 ${this.data.height} 0`);
    this.backEl.setAttribute('vertex-b', `${this.data.width/2} 0 ${-this.data.depth/2}`);
    this.backEl.setAttribute('vertex-c', `${-this.data.width/2} 0 ${-this.data.depth/2}`);
    this.el.appendChild(this.backEl);

    this.leftEl = document.createElement('a-triangle');
    this.leftEl.setAttribute('material', material);
    this.leftEl.setAttribute('color', this.data.color);
    this.leftEl.setAttribute('vertex-a', `0 ${this.data.height} 0`);
    this.leftEl.setAttribute('vertex-b', `${-this.data.width/2} 0 ${-this.data.depth/2}`);
    this.leftEl.setAttribute('vertex-c', `${-this.data.width/2} 0 ${this.data.depth/2}`);
    this.el.appendChild(this.leftEl);

    this.rightEl = document.createElement('a-triangle');
    this.rightEl.setAttribute('material', material);
    this.rightEl.setAttribute('color', this.data.color);
    this.rightEl.setAttribute('vertex-a', `0 ${this.data.height} 0`);
    this.rightEl.setAttribute('vertex-b', `${this.data.width/2} 0 ${this.data.depth/2}`);
    this.rightEl.setAttribute('vertex-c', `${this.data.width/2} 0 ${-this.data.depth/2}`);
    this.el.appendChild(this.rightEl);

    this.frontEl = document.createElement('a-triangle');
    this.frontEl.setAttribute('material', material);
    this.frontEl.setAttribute('color', this.data.color);
    this.frontEl.setAttribute('vertex-a', `0 ${this.data.height} 0`);
    this.frontEl.setAttribute('vertex-b', `${-this.data.width/2} 0 ${this.data.depth/2}`);
    this.frontEl.setAttribute('vertex-c', `${this.data.width/2} 0 ${this.data.depth/2}`);
    this.el.appendChild(this.frontEl);
  }
});

/* Works but the mesh isn't affected by lightning and appears all flat
AFRAME.registerPrimitive('a-pyramid',
  AFRAME.utils.extendDeep(
    {},
    AFRAME.primitives.getMeshMixin(),
    {
      // Preset default components. These components and component properties will be attached to the entity out-of-the-box.
      defaultComponents: {
        geometry: { primitive: 'pyramid' },
        material: { color: '#09a', shader: 'standard' }
      },
      mappings: {
        depth: 'geometry.depth',
        height: 'geometry.height',
        width: 'geometry.width',
      }
    },
  )
);

AFRAME.registerGeometry('pyramid', {
  schema: {
    depth: { default: 1, min: 0, type: 'number' },
    height: { default: 0.75, min: 0, type: 'number' },
    width: { default: 1, min: 0, type: 'number' },
  },
  init: function (data) {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setIndex([
      0, 1, 2,  // north face
      0, 2, 3,  // east face
      0, 3, 4,  // south face
      0, 4, 1,  // west face
      1, 2, 3,  // half bottom face
      3, 4, 1,  // other half bottom face
    ]);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array([
        0.0, data.height, 0.0,            // summit vertex
        -data.width/2, 0, data.depth/2,   // near left corner
        data.width/2, 0, data.depth/2,    // near right corner
        data.width/2, 0, -data.depth/2,   // far right corner
        -data.width/2, 0, -data.depth/2,  // far left corner
      ]),
      3
    ));
  }
});
*/