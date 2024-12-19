import React, { useEffect } from "react";
import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky";

const SkyComponent = ({ scene, renderer }) => {
  useEffect(() => {
    const sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    const sun = new THREE.Vector3();

    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 2,
      azimuth: 180,
      exposure: renderer.toneMappingExposure,
    };

    function updateSky() {
      const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
      const theta = THREE.MathUtils.degToRad(effectController.azimuth);

      sun.setFromSphericalCoords(1, phi, theta);

      sky.material.uniforms["turbidity"].value = effectController.turbidity;
      sky.material.uniforms["rayleigh"].value = effectController.rayleigh;
      sky.material.uniforms["mieCoefficient"].value = effectController.mieCoefficient;
      sky.material.uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;
      sky.material.uniforms["sunPosition"].value.copy(sun);

      renderer.toneMappingExposure = effectController.exposure;
    }

    updateSky();

    return () => {
      scene.remove(sky);
    };
  }, [scene, renderer]);

  return null;
};

export default SkyComponent;

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import SkyComponent from './Sky';
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky';

// Mock THREE and Sky
vi.mock('three');
vi.mock('three/examples/jsm/objects/Sky');

describe('SkyComponent', () => {
  let mockScene;
  let mockRenderer;

  beforeEach(() => {
    mockScene = {
      add: vi.fn()
    };
    mockRenderer = {};
    
    // Reset mocks
    vi.clearAllMocks();
  });

  it('should add sky to scene with correct scale', () => {
    render(<SkyComponent scene={mockScene} renderer={mockRenderer} />);

    // Check if Sky was instantiated
    expect(Sky).toHaveBeenCalled();
    
    // Check if sky was added to scene
    expect(mockScene.add).toHaveBeenCalled();
    
    // Check if scale was set to 450000
    const skyInstance = Sky.mock.instances[0];
    expect(skyInstance.scale.setScalar).toHaveBeenCalledWith(450000);
  });
});
