import { getAnimation } from './animation';

export const addCollider = function ({ animations: animationNames, respond }) {
  animationNames.map(getAnimation).forEach(function ({ colliders }) {
    colliders.push(respond);
  });
};
