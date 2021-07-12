import { getAnimation } from './animation';

export const addCollider = function ({ animations: animationNames, response }) {
  animationNames.map(getAnimation).forEach(function ({ colliders }) {
    colliders.push(response);
  });
};
