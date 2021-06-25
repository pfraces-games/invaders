import { noop, constant } from './fp';

const status = {
  notInitialized: 'notInitialized',
  running: 'running',
  stopped: 'stopped'
};

let engineStatus = status.notInitialized;

export const isRunning = function () {
  return engineStatus === status.running;
};

const errNotInitialized = function () {
  console.error('Not initialized');
};

const tasks = {
  start: errNotInitialized,
  stop: errNotInitialized,
  reset: errNotInitialized
};

export const task = function (taskName) {
  const taskFn = tasks[taskName];

  if (!taskFn) {
    console.error(`Task not defined: ${taskName}`);
    return;
  }

  taskFn();
};

let state = null;

export const setState = function (transform) {
  state = transform(state);
};

const animations = [];

export const addAnimation = function (animation) {
  const velocity =
    typeof animation.velocity === 'function'
      ? animation.velocity
      : constant(animation.velocity);

  animations.push({
    update: animation.update,
    velocity,
    timeLeft: velocity(state)
  });

  animations.sort(function (a, b) {
    const va = a.velocity(state);
    const vb = b.velocity(state);

    if (va === vb) {
      return 0;
    }

    return va < vb ? -1 : 1;
  });

  console.log(animations);
};

const applyAnimations = function (elapsed) {
  animations.forEach(function (animation) {
    animation.timeLeft -= elapsed;

    if (animation.timeLeft <= 0) {
      animation.update();
      animation.timeLeft += animation.velocity(state);
    }
  });
};

const colliders = [];

export const addCollider = function (collider) {
  colliders.push(collider);
};

const applyColliders = function () {
  colliders.forEach(function (collider) {
    setState(collider);
  });
};

const effects = [];

export const addEffect = function (effect) {
  effects.push(effect);
};

const applyEffects = function () {
  effects.forEach(function (effect) {
    effect(state);
  });
};

export const init = function ({
  root,
  initialState,
  render,
  onStart = noop,
  onStop = noop
}) {
  let rafId = null;
  let prevTimestamp = 0;
  let tickCount = 0;

  const renderFrame = function () {
    root.innerHTML = '';
    root.appendChild(render(state));
  };

  const gameLoop = function (timestamp) {
    const elapsedMiliseconds = timestamp - prevTimestamp;
    const fps = 1000 / elapsedMiliseconds;
    const tick = tickCount;

    rafId = requestAnimationFrame(gameLoop);
    prevTimestamp = timestamp;
    tickCount++;

    if (tick <= 0) {
      return;
    }

    console.log({ tick, fps, elapsedMiliseconds });

    applyAnimations(elapsedMiliseconds);
    applyColliders();
    renderFrame();
    applyEffects();
  };

  tasks.start = function () {
    if (isRunning()) {
      return;
    }

    engineStatus = status.running;
    onStart();
    rafId = requestAnimationFrame(gameLoop);
    renderFrame();
  };

  tasks.stop = function () {
    engineStatus = status.stopped;
    onStop();
    cancelAnimationFrame(rafId);
    renderFrame();
  };

  tasks.reset = function () {
    if (isRunning()) {
      tasks.stop();
    }

    state = initialState();
    renderFrame();
  };

  state = initialState();
  renderFrame();
};
