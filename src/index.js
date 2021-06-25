import {
  isRunning,
  task,
  setState,
  addAnimation,
  addCollider,
  addEffect,
  init
} from './game-engine';

import { element, text } from './hyperscript';

const noop = function () {};

// --------
// Settings
// --------

const settings = {
  gridCols: 15,
  gridRows: 15,
  cellWidth: '20px',
  cellHeight: '20px',
  invaderCols: 10,
  invaderRows: 3,
  invadersMinVelocity: 50,
  invadersIncrementVelocity: 15,
  projectilesVelocity: 100,
  minDistanceBetweenProjectiles: 2
};

// ------------
// Key Bindings
// ------------

const keyBindings = (function () {
  const moveDefenderLeft = function () {
    const rowStart = 0;

    setState(function (state) {
      if (state.defender.x === rowStart) {
        return state;
      }

      return {
        ...state,
        defender: {
          ...state.defender,
          x: state.defender.x - 1
        }
      };
    });
  };

  const moveDefenderRight = function () {
    setState(function (state) {
      const { gridCols } = settings;
      const rowEnd = gridCols - 1;

      if (state.defender.x === rowEnd) {
        return state;
      }

      return {
        ...state,
        defender: {
          ...state.defender,
          x: state.defender.x + 1
        }
      };
    });
  };

  const fire = function () {
    setState(function (state) {
      const newProjectile = {
        x: state.defender.x,
        y: state.defender.y - 1
      };

      const projectileOverlap = state.projectiles.find(function (projectile) {
        return (
          newProjectile.y - projectile.y <=
          settings.minDistanceBetweenProjectiles
        );
      });

      if (projectileOverlap) {
        return state;
      }

      return {
        ...state,
        projectiles: [...state.projectiles, newProjectile]
      };
    });
  };

  return {
    ArrowLeft: moveDefenderLeft,
    ArrowRight: moveDefenderRight,
    ArrowUp: fire
  };
})();

const onKeyDown = function (event) {
  (keyBindings[event.key] || noop)();
};

// ----------
// Animations
// ----------

const invadersAnimation = function () {
  setState(function (state) {
    return {
      ...state,
      invaders: state.invaders.map(function (invader) {
        return {
          ...invader,
          x: invader.x + state.invadersDirection
        };
      })
    };
  });
};

const invadersVelocity = function (state) {
  const {
    invaderCols,
    invaderRows,
    invadersMinVelocity,
    invadersIncrementVelocity
  } = settings;

  const invadersLength = state
    ? state.invaders.length
    : invaderCols * invaderRows;

  return invadersMinVelocity + invadersLength * invadersIncrementVelocity;
};

const projectilesAnimation = function () {
  setState(function (state) {
    return {
      ...state,
      projectiles: state.projectiles.map(function (projectile) {
        return {
          ...projectile,
          y: projectile.y - 1
        };
      })
    };
  });
};

const { projectilesVelocity } = settings;

addAnimation({ update: invadersAnimation, velocity: invadersVelocity });
addAnimation({ update: projectilesAnimation, velocity: projectilesVelocity });

// ---------
// Colliders
// ---------

const invadersOutOfBounds = function (state) {
  const { gridCols } = settings;
  const rowStart = 0;
  const rowEnd = gridCols - 1;

  if (!state.invaders.length) {
    return state;
  }

  const leftMostInvader = state.invaders.reduce(function (acc, invader) {
    return invader.x < acc.x ? invader : acc;
  });

  const rightMostInvader = state.invaders.reduce(function (acc, invader) {
    return invader.x > acc.x ? invader : acc;
  });

  let invadersDirection = state.invadersDirection;
  let invaders = state.invaders;

  if (rightMostInvader.x > rowEnd || leftMostInvader.x < rowStart) {
    invadersDirection *= -1;

    invaders = invaders.map(function (invader) {
      return {
        x: invader.x + invadersDirection,
        y: invader.y + 1
      };
    });
  }

  return {
    ...state,
    invadersDirection,
    invaders
  };
};

const invadersLandingCollider = function (state) {
  const { gridRows } = settings;
  const colEnd = gridRows - 1;

  const invaderLanded = state.invaders.some(function (invader) {
    return invader.y === colEnd;
  });

  return {
    ...state,
    isGameOver: state.isGameOver || invaderLanded
  };
};

const projectileLostCollider = function (state) {
  return {
    ...state,
    projectiles: state.projectiles.filter(function (projectile) {
      return projectile.y >= 0;
    })
  };
};

const projectileHitCollider = function (state) {
  const collisions = [];

  state.projectiles.forEach(function (projectile) {
    const collidedInvader = state.invaders.find(function (invader) {
      return invader.x === projectile.x && invader.y === projectile.y;
    });

    if (collidedInvader) {
      collisions.push({
        x: collidedInvader.x,
        y: collidedInvader.y
      });
    }
  });

  const projectiles = state.projectiles.filter(function (projectile) {
    return !collisions.find(function (collision) {
      return projectile.x === collision.x && projectile.y === collision.y;
    });
  });

  const invaders = state.invaders.filter(function (invader) {
    return !collisions.find(function (collision) {
      return invader.x === collision.x && invader.y === collision.y;
    });
  });

  return {
    ...state,
    score: state.score + collisions.length,
    isGameOver: state.isGameOver || !invaders.length,
    projectiles,
    invaders
  };
};

addCollider(invadersOutOfBounds);
addCollider(invadersLandingCollider);
addCollider(projectileLostCollider);
addCollider(projectileHitCollider);

// -------
// Effects
// -------

addEffect(function (state) {
  if (state.isGameOver) {
    task('stop');
  }
});

// ----------
// Life Cycle
// ----------

const onStart = function () {
  document.addEventListener('keydown', onKeyDown);
};

const onStop = function () {
  document.removeEventListener('keydown', onKeyDown);
};

// ----------------
// Render Functions
// ----------------

const startButton = function () {
  const onClick = function () {
    task('start');
  };

  return element('button', {
    eventListeners: { click: onClick },
    childNodes: [text('Start')]
  });
};

const pauseButton = function () {
  const onClick = function () {
    task('stop');
  };

  return element('button', {
    eventListeners: { click: onClick },
    childNodes: [text('Pause')]
  });
};

const resetButton = function () {
  const onClick = function () {
    task('reset');
  };

  return element('button', {
    eventListeners: { click: onClick },
    childNodes: [text('Reset')]
  });
};

const score = function (state) {
  return element('div', {
    classList: ['score'],
    childNodes: [text(`Score: ${state.score}`)]
  });
};

const statusBar = function (state) {
  return element('div', {
    classList: ['status-bar'],
    childNodes: [
      isRunning() ? pauseButton() : startButton(),
      resetButton(),
      score(state)
    ]
  });
};

const cell = function () {
  return element('div', {
    classList: ['cell']
  });
};

const gridLayer = function () {
  const { gridCols, gridRows } = settings;

  return element('div', {
    classList: ['grid-layer'],
    childNodes: [...Array(gridCols * gridRows)].map(cell)
  });
};

const invader = function (invaderState) {
  return function () {
    const { cellWidth, cellHeight } = settings;

    return element('div', {
      classList: ['invader'],
      styles: {
        left: `calc(${invaderState.x} * ${cellWidth})`,
        top: `calc(${invaderState.y} * ${cellHeight})`
      }
    });
  };
};

const projectile = function (projectileState) {
  return function () {
    const { cellWidth, cellHeight } = settings;

    return element('div', {
      classList: ['projectile'],
      styles: {
        left: `calc(${projectileState.x} * ${cellWidth})`,
        top: `calc(${projectileState.y} * ${cellHeight})`
      }
    });
  };
};

const defender = function (state) {
  const { cellWidth, cellHeight } = settings;

  return element('div', {
    classList: ['defender'],
    styles: {
      left: `calc(${state.defender.x} * ${cellWidth})`,
      top: `calc(${state.defender.y} * ${cellHeight})`
    }
  });
};

const actionLayer = function (state) {
  const invaders = state.invaders.map(function (invaderState) {
    return invader(invaderState)();
  });

  const projectiles = state.projectiles.map(function (projectileState) {
    return projectile(projectileState)();
  });

  return element('div', {
    classList: ['action-layer'],
    childNodes: [...invaders, ...projectiles, defender(state)]
  });
};

const gameOverLayer = function (state) {
  return element('div', {
    classList: ['game-over-layer'],
    childNodes: [text(state.invaders.length ? 'Game Over' : 'You Win')]
  });
};

const board = function (state) {
  return element('div', {
    classList: ['board'],
    childNodes: [
      gridLayer(state),
      actionLayer(state),
      state.isGameOver && gameOverLayer(state)
    ]
  });
};

const canvas = function (state) {
  return element('div', {
    classList: ['canvas'],
    childNodes: [statusBar(state), board(state)]
  });
};

// --------------
// Initialization
// --------------

const initialState = function () {
  const { gridCols, gridRows, invaderRows, invaderCols } = settings;
  const colEnd = gridRows - 1;

  return {
    score: 0,
    isGameOver: false,
    defender: {
      x: Math.ceil(gridCols / 2) - 1,
      y: colEnd
    },
    projectiles: [],
    invadersDirection: 1,
    invaders: [...Array(invaderRows)]
      .map(function (row, rowIndex) {
        return [...Array(invaderCols)].map(function (col, colIndex) {
          return { x: colIndex, y: rowIndex };
        });
      })
      .flat()
  };
};

init({
  root: document.querySelector('#root'),
  initialState,
  render: canvas,
  onStart,
  onStop
});
