import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useCleanup} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default () => {
  const app = useApp();
  app.name = 'Planet';
  
  let planet = undefined;
  const planetRotationPerFrame = new THREE.Quaternion(0.00005, 0, 0.00005, 1);

  const textureLoader = new THREE.TextureLoader();
  const loadTexture = url => {
    return new Promise(resolve => {
      textureLoader.load(url, resolve)
    })
  }

  loadTexture(`https://webaverse.github.io/planets/assets/textures/aruba.jpg`).then(texture => {
    planet = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 64, 64),
      new THREE.MeshStandardMaterial({map: texture})
    );
    app.add(planet);
    planet.updateMatrixWorld();
    app.updateMatrixWorld();
  });

  useFrame(({ timeDiff, timestamp }) => {
    if(typeof planet !== "undefined") {
      planet.quaternion.premultiply(planetRotationPerFrame);
      planet.updateMatrixWorld();
      app.updateMatrixWorld();
    }
  });
  
  useCleanup(() => {
    planet.material.map.dispose();
    planet.material.dispose();
    planet.geometry.dispose();
  }); 

  return app;
};