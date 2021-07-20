const sounds = {};

export const addSound = function ({ id, url, ...options }) {
  const defaults = { volume: 1, loop: false };
  const settings = { ...defaults, ...options };

  const sound = new Audio(url);
  sound.volume = settings.volume;
  sound.loop = settings.loop;

  sounds[id] = sound;
};

export const playSound = function (id) {
  const sound = sounds[id];
  sound.currentTime = 0;
  sound.play();
};

export const pauseSound = function (...args) {
  const ids = args.length ? args : Object.keys(sounds);

  ids.forEach(function (id) {
    const sound = sounds[id];
    sound.pause();
  });
};

export const resumeSound = function (...args) {
  const ids = args.length ? args : Object.keys(sounds);

  ids.forEach(function (id) {
    const sound = sounds[id];
    console.log({ id, currentTime: sound.currentTime });

    if (sound.currentTime > 0 && !sound.ended) {
      sound.play();
    }
  });
};

export const resetSound = function () {
  Object.keys(sounds).forEach(function (id) {
    const sound = sounds[id];
    sound.currentTime = 0;
    sound.pause();
  });
};
