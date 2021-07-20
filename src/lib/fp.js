export const constant = function (value) {
  return function () {
    return value;
  };
};

export const partial = function (fn, ...partials) {
  return function (...args) {
    return fn.apply(null, [...partials, ...args]);
  };
};
