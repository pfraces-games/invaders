import {
  addKeyBinding,
  applyKeyBindings,
  resetPressedKeys,
  listenKeyboard
} from './keyboard';
import { loadSound, playSound, pauseSound } from './sound';
import {
  runAnimation,
  stopAnimation,
  addAnimation,
  applyAnimations,
  resetAnimations
} from './animation';
import { addCollider } from './collider';
import { patch } from './vdom';

export { h } from './vdom';

export const keyboard = {
  bind: addKeyBinding,
  reset: resetPressedKeys,
  listen: listenKeyboard
};

export const sound = {
  load: loadSound,
  play: playSound,
  stop: pauseSound
};

export const animation = {
  run: runAnimation,
  stop: stopAnimation,
  add: addAnimation,
  reset: resetAnimations
};

export const collider = {
  add: addCollider
};

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
