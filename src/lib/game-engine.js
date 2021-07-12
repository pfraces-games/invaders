import { init, styleModule } from 'snabbdom';
import {
  addKeyBinding,
  applyKeyBindings,
  resetPressedKeys,
  listenKeyboard
} from './keyboard';
import { loadSound, playSound } from './sound';
import {
  runAnimation,
  stopAnimation,
  addAnimation,
  applyAnimations
} from './animation';
import { addCollider } from './collider';

export { h } from 'snabbdom';

const patch = init([styleModule]);

// --------
// Keyboard
// --------

export const keyboard = {
  bind: addKeyBinding,
  reset: resetPressedKeys,
  listen: listenKeyboard
};

// -----
// Sound
// -----

export const sound = {
  load: loadSound,
  play: playSound
};

// ---------
// Animation
// ---------

export const animation = {
  run: runAnimation,
  stop: stopAnimation,
  add: addAnimation
};

// --------
// Collider
// --------

export const collider = {
  add: addCollider
};

// ---------
// Game loop
// ---------

export const mount = function (root, component) {
  let vnode = component();
  let timestamp = 0;

  const gameLoop = function (newTimestamp) {
    const elapsed = newTimestamp - timestamp;

    if (timestamp > 0) {
      applyKeyBindings();
      applyAnimations(elapsed);
    }

    const newVnode = component();
    patch(vnode, newVnode);

    vnode = newVnode;
    timestamp = newTimestamp;
    requestAnimationFrame(gameLoop);
  };

  patch(root, vnode);
  requestAnimationFrame(gameLoop);
};
