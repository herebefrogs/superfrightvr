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
    const color = this.data.color;
    const depth = this.data.depth;
    const height = this.data.height;
    const width = this.data.width;
    const material = this.el.getAttribute('material');

    const bottomEl = document.createElement('a-plane');
    bottomEl.setAttribute('material', material);
    bottomEl.setAttribute('color', color);
    bottomEl.setAttribute('height', depth); // this is not a mistake
    bottomEl.setAttribute('width', width);
    bottomEl.object3D.rotation.x = Math.PI/2;
    this.el.appendChild(bottomEl);
    
    const backEl = document.createElement('a-triangle');
    backEl.setAttribute('material', material);
    backEl.setAttribute('color', color);
    backEl.setAttribute('vertex-a', `0 ${height} 0`);
    backEl.setAttribute('vertex-b', `${width/2} 0 ${-depth/2}`);
    backEl.setAttribute('vertex-c', `${-width/2} 0 ${-depth/2}`);
    this.el.appendChild(backEl);

    const leftEl = document.createElement('a-triangle');
    leftEl.setAttribute('material', material);
    leftEl.setAttribute('color', color);
    leftEl.setAttribute('vertex-a', `0 ${height} 0`);
    leftEl.setAttribute('vertex-b', `${-width/2} 0 ${-depth/2}`);
    leftEl.setAttribute('vertex-c', `${-width/2} 0 ${depth/2}`);
    this.el.appendChild(leftEl);

    const rightEl = document.createElement('a-triangle');
    rightEl.setAttribute('material', material);
    rightEl.setAttribute('color', color);
    rightEl.setAttribute('vertex-a', `0 ${height} 0`);
    rightEl.setAttribute('vertex-b', `${width/2} 0 ${depth/2}`);
    rightEl.setAttribute('vertex-c', `${width/2} 0 ${-depth/2}`);
    this.el.appendChild(rightEl);

    const frontEl = document.createElement('a-triangle');
    frontEl.setAttribute('material', material);
    frontEl.setAttribute('color', color);
    frontEl.setAttribute('vertex-a', `0 ${height} 0`);
    frontEl.setAttribute('vertex-b', `${-width/2} 0 ${depth/2}`);
    frontEl.setAttribute('vertex-c', `${width/2} 0 ${depth/2}`);
    this.el.appendChild(frontEl);
  }
});