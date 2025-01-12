export function getParticleSystem({ camera, emitter, parent, rate, texture }) {
  const particles = [];
  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load(texture);
  
  function createParticle() {
    const particle = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: particleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending
      })
    );
    particle.scale.set(0.5, 0.5, 0.5);
    particle.position.copy(emitter.position);
    particle.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      Math.random() * 0.2,
      (Math.random() - 0.5) * 0.1
    );
    particle.userData.life = 2.0;
    parent.add(particle);
    particles.push(particle);
  }

  return {
    update(dt) {
      if (Math.random() < rate * dt) {
        createParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.position.add(particle.userData.velocity);
        particle.userData.life -= dt;
        particle.material.opacity = particle.userData.life / 2.0;

        if (particle.userData.life <= 0) {
          parent.remove(particle);
          particles.splice(i, 1);
        }
      }
    }
  };
}