import { h } from '../lib/engine/engine';
import { constant } from '../lib/fp';
import { menuType } from '../types';
import { settings } from '../settings';

const menuTitleComponent = function () {
  return h(
    'pre.menu-title',
    {
      style: {
        fontSize: `calc(${settings.theme.fontSize} * 0.75)`
      }
    },
    [
      '    ____                     __              ',
      '   /  _/___ _   ______ _____/ /__  __________',
      '   / // __ \\ | / / __ `/ __  / _ \\/ ___/ ___/',
      ' _/ // / / / |/ / /_/ / /_/ /  __/ /  (__  ) ',
      '/___/_/ /_/|___/\\__,_/\\__,_/\\___/_/  /____/  '
    ].join('\n')
  );
};

const menuContentControlsComponent = function () {
  return h('div.menu-content', [
    h('p', 'CONTROLS'),
    h('ul', [
      h('li', 'LEFT / RIGHT: Move defender'),
      h('li', 'SPACEBAR: Fire'),
      h('li', 'ESCAPE: Pause')
    ]),
    h('p', 'Press SPACEBAR to start')
  ]);
};

const menuContentPauseComponent = function () {
  return h('div.menu-content', [
    h('p', 'PAUSED'),
    h('p', 'Press SPACEBAR to resume')
  ]);
};

const menuContentYouWinComponent = function () {
  return h('div.menu-content', [
    h('p', 'YOU WIN!'),
    h('p', 'Press SPACEBAR to restart')
  ]);
};

const menuContentGameOverComponent = function () {
  return h('div.menu-content', [
    h('p', 'GAME OVER'),
    h('p', 'Press SPACEBAR to restart')
  ]);
};

export const menuLayerComponent = function ({ menu }) {
  if (menu === menuType.none) {
    return null;
  }

  let menuContentComponent = constant(null);

  if (menu === menuType.controls) {
    menuContentComponent = menuContentControlsComponent;
  }

  if (menu === menuType.pause) {
    menuContentComponent = menuContentPauseComponent;
  }

  if (menu === menuType.youwin) {
    menuContentComponent = menuContentYouWinComponent;
  }

  if (menu === menuType.gameover) {
    menuContentComponent = menuContentGameOverComponent;
  }

  return h('div.menu-layer', [menuTitleComponent(), menuContentComponent()]);
};
