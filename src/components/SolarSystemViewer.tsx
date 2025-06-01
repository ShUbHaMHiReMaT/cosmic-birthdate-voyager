
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BirthData } from './CosmicVoyager';

interface SolarSystemViewerProps {
  birthData: BirthData;
}

export const SolarSystemViewer: React.FC<SolarSystemViewerProps> = ({ birthData }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    planets: THREE.Mesh[];
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 2, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Create Sun
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.3
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planet data (simplified)
    const planetData = [
      { name: 'Mercury', distance: 5, size: 0.2, color: 0x8c7853, speed: 0.02 },
      { name: 'Venus', distance: 7, size: 0.4, color: 0xffc649, speed: 0.015 },
      { name: 'Earth', distance: 10, size: 0.5, color: 0x6b93d6, speed: 0.01 },
      { name: 'Mars', distance: 13, size: 0.3, color: 0xcd5c5c, speed: 0.008 },
      { name: 'Jupiter', distance: 20, size: 1.2, color: 0xd8ca9d, speed: 0.005 },
      { name: 'Saturn', distance: 25, size: 1.0, color: 0xfad5a5, speed: 0.004 },
      { name: 'Uranus', distance: 30, size: 0.8, color: 0x4fd0e4, speed: 0.003 },
      { name: 'Neptune', distance: 35, size: 0.8, color: 0x4b70dd, speed: 0.002 }
    ];

    const planets: THREE.Mesh[] = [];

    // Create planets and orbits
    planetData.forEach((planet, index) => {
      // Create orbit ring
      const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x444444, 
        side: THREE.DoubleSide,
        opacity: 0.3,
        transparent: true
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = -Math.PI / 2;
      scene.add(orbit);

      // Create planet
      const planetGeometry = new THREE.SphereGeometry(planet.size, 16, 16);
      const planetMaterial = new THREE.MeshPhongMaterial({ color: planet.color });
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      
      // Position based on birthdate (simplified calculation)
      const birthDate = new Date(birthData.date);
      const dayOfYear = Math.floor((birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const angle = (dayOfYear / 365) * 2 * Math.PI + index * 0.5;
      
      planetMesh.position.x = Math.cos(angle) * planet.distance;
      planetMesh.position.z = Math.sin(angle) * planet.distance;
      planetMesh.userData = { ...planet, initialAngle: angle };
      
      scene.add(planetMesh);
      planets.push(planetMesh);
    });

    // Camera position
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);

    // Mouse controls
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;

    const handleMouseDown = () => {
      isMouseDown = true;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleWheel = (event: WheelEvent) => {
      const scaleFactor = 1 + event.deltaY * 0.001;
      camera.position.multiplyScalar(scaleFactor);
      camera.position.clampLength(10, 100);
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Rotate sun
      sun.rotation.y += 0.005;
      
      // Animate planets
      planets.forEach((planet) => {
        const userData = planet.userData;
        planet.rotation.y += 0.01;
        
        // Orbital motion
        const time = Date.now() * 0.001;
        const angle = userData.initialAngle + time * userData.speed;
        planet.position.x = Math.cos(angle) * userData.distance;
        planet.position.z = Math.sin(angle) * userData.distance;
      });
      
      renderer.render(scene, camera);
      
      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store scene reference
    sceneRef.current = {
      scene,
      camera,
      renderer,
      planets,
      animationId: 0
    };

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        mountRef.current?.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [birthData]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mountRef} 
        className="w-full h-full rounded-lg border border-blue-500/30 glass-effect"
        style={{ minHeight: '400px' }}
      />
      
      <div className="absolute top-4 right-4 glass-effect p-4 rounded-lg border border-blue-500/30">
        <h3 className="text-white font-semibold mb-2">Your Cosmic Moment</h3>
        <p className="text-blue-200 text-sm">Solar System on {birthData.date}</p>
        <p className="text-blue-300 text-xs mt-1">
          Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
};
