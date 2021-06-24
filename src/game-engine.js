const engine = (function () {
  const noop = function () {};

  const status = {
    notInitialized: 'notInitialized',
    running: 'running',
    stopped: 'stopped'
  };

  let engineStatus = status.notInitialized;

  const isRunning = function () {
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

  const task = function (taskName) {
    const taskFn = tasks[taskName];

    if (!taskFn) {
      console.error(`Task not defined: ${taskName}`);
      return;
    }

    taskFn();
  };

  let currentState = null;
  let prevState = null;
  let rafId = null;

  const setState = function (transform) {
    currentState = transform(currentState);
  };

  const init = function ({
    root,
    initialState,
    render,
    onStart = noop,
    onStop = noop
  }) {
    const renderFrame = function () {
      root.innerHTML = '';
      root.appendChild(render(currentState));
    };

    const gameLoop = function () {
      rafId = requestAnimationFrame(gameLoop);

      if (currentState === prevState) {
        return;
      }

      prevState = currentState;
      renderFrame();
    };

    tasks.start = function () {
      if (isRunning()) {
        return;
      }

      engineStatus = status.running;
      onStart();
      gameLoop();
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

      prevState = null;
      currentState = initialState();
      renderFrame();
    };

    currentState = initialState();
    renderFrame();
  };

  return { init, task, isRunning, setState };
})();
