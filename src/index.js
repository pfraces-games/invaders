import {
  keyboard,
  sound,
  animation,
  collider,
  mount
} from './lib/engine/engine';
import { store } from './lib/store';
import { constant } from './lib/fp';
import { menu, invaderType } from './model';
import { settings } from './settings';
import { rootComponent } from './components/root-component';

// -----
// State
// -----

const invaderTypeByRow = function (row) {
  if (row === 0) {
    return invaderType.alfa;
  }

  if (row <= 2) {
    return invaderType.beta;
  }

  return invaderType.gamma;
};

const initInvaders = function () {
  const { cols } = settings.grid;
  const { invaderCols, invaderRows } = settings.scene;
  const invaderCells = invaderRows * invaderCols;
  const invaderOffsetX = (cols - invaderCols) / 2;
  const invaderOffsetY = 1;

  return [...Array(invaderCells)].map(function (_, index) {
    const rowIndex = Math.floor(index / invaderCols);
    const colIndex = index % invaderCols;

    return {
      type: invaderTypeByRow(rowIndex),
      x: colIndex + invaderOffsetX,
      y: rowIndex + invaderOffsetY
    };
  });
};

const gameState = store(function () {
  const { cols, rows } = settings.grid;
  const rowEnd = rows - 1;

  return {
    currentMenu: menu.controls,
    score: 0,
    defender: {
      x: Math.ceil(cols / 2) - 1,
      y: rowEnd
    },
    defenderDirection: 0,
    projectiles: [],
    explosions: [],
    invaders: initInvaders(),
    invadersDirection: 1
  };
});

const { onStateChange, getState, setState, resetState, withState } = gameState;

// ------------
// Key Bindings
// ------------

const play = function () {
  keyboard.reset();

  setState(function (state) {
    return {
      ...state,
      currentMenu: menu.none
    };
  });
};

const pause = function () {
  keyboard.reset();

  setState(function (state) {
    return {
      ...state,
      currentMenu: menu.pause
    };
  });
};

const reset = function () {
  keyboard.reset();
  resetState();
};

const moveDefenderLeft = function () {
  setState(function (state) {
    return {
      ...state,
      defenderDirection: -1
    };
  });
};

const moveDefenderRight = function () {
  setState(function (state) {
    return {
      ...state,
      defenderDirection: 1
    };
  });
};

const fire = function () {
  const { maxConcurrency, cooldown } = settings.projectile;

  const canFire = getState(function (state) {
    const { defender, projectiles } = state;

    const projectileOverlap = projectiles.find(function (projectile) {
      return projectile.y >= defender.y - (1 + cooldown);
    });

    return !projectileOverlap && projectiles.length < maxConcurrency;
  });

  if (!canFire) {
    return;
  }

  sound.play('fire');

  setState(function (state) {
    const { projectiles } = state;

    const newProjectile = {
      x: state.defender.x,
      y: state.defender.y - 1
    };

    return {
      ...state,
      projectiles: [...projectiles, newProjectile]
    };
  });
};

const onMenu = function (menuId, action) {
  return function () {
    const idMatches = getState(function ({ currentMenu }) {
      return currentMenu === menuId;
    });

    if (idMatches) {
      action();
    }
  };
};

keyboard.bind('ArrowLeft', onMenu(menu.none, moveDefenderLeft));
keyboard.bind('ArrowRight', onMenu(menu.none, moveDefenderRight));
keyboard.bind('Space', onMenu(menu.none, fire));
keyboard.bind('Escape', onMenu(menu.none, pause));

keyboard.bind('Space', onMenu(menu.controls, play));
keyboard.bind('Space', onMenu(menu.pause, play));
keyboard.bind('Escape', onMenu(menu.youwin, reset));
keyboard.bind('Escape', onMenu(menu.gameover, reset));

// ------
// Sounds
// ------

sound.load({ name: 'invader', url: './assets/invader.ogg', volume: 0.3 });
sound.load({ name: 'mystery-ship', url: './assets/mystery-ship.ogg' });
sound.load({ name: 'fire', url: './assets/fire.ogg' });
sound.load({ name: 'explosion', url: './assets/explosion.ogg' });

// ----------
// Animations
// ----------

const defenderAnimation = {
  name: 'defender',
  velocity: constant(settings.defender.velocity),
  update: function () {
    setState(function (state) {
      return {
        ...state,
        defender: {
          ...state.defender,
          x: state.defender.x + state.defenderDirection
        },
        defenderDirection: 0
      };
    });
  }
};

const invadersAnimation = {
  name: 'invaders',
  velocity: function () {
    const { minVelocity, incrementVelocity } = settings.invader;

    return getState(function ({ invaders }) {
      return minVelocity + invaders.length * incrementVelocity;
    });
  },
  update: function () {
    sound.play('invader');

    setState(function (state) {
      return {
        ...state,
        invaders: state.invaders.map(function (invader) {
          return {
            ...invader,
            x: invader.x + state.invadersDirection
          };
        }),
        explosions: []
      };
    });
  }
};

const projectilesAnimation = {
  name: 'projectiles',
  velocity: constant(settings.projectile.velocity),
  update: function () {
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
  }
};

animation.add(defenderAnimation);
animation.add(invadersAnimation);
animation.add(projectilesAnimation);

// ---------
// Colliders
// ---------

const defenderOutOfBoundsCollider = {
  animations: ['defender'],
  respond: function () {
    const rowStart = 0;
    const rowEnd = settings.grid.cols - 1;

    setState(function (state) {
      let x = state.defender.x;

      if (x < rowStart) {
        x = rowStart;
      }

      if (x > rowEnd) {
        x = rowEnd;
      }

      return {
        ...state,
        defender: {
          ...state.defender,
          x
        }
      };
    });
  }
};

const invadersOutOfBoundsCollider = {
  animations: ['invaders'],
  respond: function () {
    const rowStart = 0;
    const rowEnd = settings.grid.cols - 1;

    setState(function (state) {
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
            ...invader,
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
    });
  }
};

const invadersLandingCollider = {
  animations: ['invaders'],
  respond: function () {
    setState(function (state) {
      const rowEnd = settings.grid.rows - 1;

      const invaderLanded = state.invaders.some(function (invader) {
        return invader.y === rowEnd;
      });

      let currentMenu = state.currentMenu;
      let defender = state.defender;

      if (invaderLanded) {
        currentMenu = menu.gameover;
        defender = null;
      }

      return {
        ...state,
        defender,
        currentMenu
      };
    });
  }
};

const projectilesOutOfBoundsCollider = {
  animations: ['projectiles'],
  respond: function () {
    setState(function (state) {
      return {
        ...state,
        projectiles: state.projectiles.filter(function (projectile) {
          return projectile.y >= 0;
        })
      };
    });
  }
};

const projectilesHitCollider = {
  animations: ['projectiles', 'invaders'],
  respond: function () {
    const collisions = getState(function (state) {
      const { invaders, projectiles } = state;

      return invaders.filter(function (invader) {
        return projectiles.some(function (projectile) {
          return projectile.x === invader.x && projectile.y === invader.y;
        });
      });
    });

    if (!collisions.length) {
      return;
    }

    sound.play('explosion');

    const scoreIncrement = collisions.reduce(function (acc, collision) {
      return acc + settings.score.invaderType[collision.type];
    }, 0);

    setState(function (state) {
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

      let currentMenu = state.currentMenu;

      if (!invaders.length) {
        currentMenu = menu.youwin;
      }

      return {
        ...state,
        currentMenu,
        score: state.score + scoreIncrement,
        projectiles,
        explosions: [...state.explosions, ...collisions],
        invaders
      };
    });
  }
};

collider.add(defenderOutOfBoundsCollider);
collider.add(invadersOutOfBoundsCollider);
collider.add(invadersLandingCollider);
collider.add(projectilesOutOfBoundsCollider);
collider.add(projectilesHitCollider);

// ---------------
// State listeners
// ---------------

onStateChange(function ({ currentMenu }) {
  const action = currentMenu === menu.none ? 'run' : 'stop';
  animation[action]();
});

// ----
// Init
// ----

mount(document.getElementById('root'), withState(rootComponent));
keyboard.listen();
