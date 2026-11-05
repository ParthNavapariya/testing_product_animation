import * as THREE from 'three';

/**
 * Dynamic 3D Hotspot & Screen-Space Annotation Manager
 * Supports dynamic product switching with animated pins and depth calculation.
 */

export function createAnnotationManager(camera, container) {
  const overlayContainer = document.createElement('div');
  overlayContainer.className = 'hotspot-overlay-container';
  container.appendChild(overlayContainer);

  let currentElements = [];
  let visible = false;

  function loadAnnotations(annotationsList, productModel) {
    // Clear old elements
    overlayContainer.innerHTML = '';
    currentElements = [];

    if (!annotationsList || !productModel) return;

    annotationsList.forEach(item => {
      const el = document.createElement('div');
      el.className = 'hotspot-pin';
      el.setAttribute('data-id', item.id);
      el.innerHTML = `
        <div class="pin-marker">
          <span class="pin-pulse"></span>
          <span class="pin-dot"></span>
        </div>
        <div class="pin-card">
          <span class="pin-tag">${item.category}</span>
          <h4>${item.title}</h4>
          <p>${item.subtitle}</p>
        </div>
      `;
      overlayContainer.appendChild(el);

      currentElements.push({
        def: item,
        el,
        getWorldPos: () => {
          const v = new THREE.Vector3(...item.offset);
          productModel.bracketBody.localToWorld(v);
          return v;
        }
      });
    });
  }

  function setVisible(val) {
    visible = val;
    overlayContainer.style.opacity = visible ? '1' : '0';
    overlayContainer.style.pointerEvents = visible ? 'auto' : 'none';
  }

  function update() {
    if (!visible || currentElements.length === 0) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const tempV = new THREE.Vector3();

    currentElements.forEach(({ getWorldPos, el }) => {
      const worldPos = getWorldPos();
      tempV.copy(worldPos);
      tempV.project(camera);

      // Check if behind camera
      if (tempV.z > 1) {
        el.style.display = 'none';
        return;
      }

      el.style.display = 'block';
      const x = (tempV.x * 0.5 + 0.5) * width;
      const y = (-tempV.y * 0.5 + 0.5) * height;

      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }

  return {
    update,
    setVisible,
    loadAnnotations,
    container: overlayContainer
  };
}
