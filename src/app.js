(function () {
  const { init, task, isRunning, setState } = engine;
  const { element, text } = hyperscript;
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
    invadersVelocity: 500,
    projectilesVelocity: 250
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
            projectile.x === newProjectile.x && projectile.y === newProjectile.y
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

  const animateInvaders = (function () {
    const processInvadersCollision = function () {
      setState(function (state) {
        const { gridRows } = settings;
        const colEnd = gridRows - 1;

        const isGameOver = state.invaders.some(function (invader) {
          return invader.y === colEnd;
        });

        if (isGameOver) {
          setTimeout(function () {
            task('stop');
          }, 0);
        }

        return {
          ...state,
          isGameOver: state.isGameOver || isGameOver
        };
      });
    };

    const getLeftMostInvader = function (state) {
      return state.invaders.reduce(function (acc, invader) {
        return invader.x < acc.x ? invader : acc;
      });
    };

    const getRightMostInvader = function (state) {
      return state.invaders.reduce(function (acc, invader) {
        return invader.x > acc.x ? invader : acc;
      });
    };

    const updateInvadersDirection = function () {
      const { gridCols } = settings;
      const rowStart = 0;
      const rowEnd = gridCols - 1;

      setState(function (state) {
        const leftMostInvader = getLeftMostInvader(state);
        const rightMostInvader = getRightMostInvader(state);

        if (state.invadersDirection.y === 1) {
          return {
            ...state,
            invadersDirection: {
              x: leftMostInvader.x === rowStart ? 1 : -1,
              y: 0
            }
          };
        }

        if (
          (rightMostInvader.x === rowEnd && state.invadersDirection.x === 1) ||
          (leftMostInvader.x === rowStart && state.invadersDirection.x === -1)
        ) {
          return {
            ...state,
            invadersDirection: { x: 0, y: 1 }
          };
        }

        return state;
      });
    };

    const updateInvadersPosition = function () {
      setState(function (state) {
        return {
          ...state,
          invaders: state.invaders.map(function (invader) {
            return {
              x: invader.x + state.invadersDirection.x,
              y: invader.y + state.invadersDirection.y
            };
          })
        };
      });
    };

    return function () {
      processInvadersCollision();
      updateInvadersDirection();
      updateInvadersPosition();
    };
  })();

  const animateProjectiles = (function () {
    const processProjectilesCollision = function () {
      setState(function (state) {
        const collisions = [];

        state.projectiles.forEach(function (projectile) {
          const collision = state.invaders.find(function (invader) {
            return invader.x === projectile.x && invader.y === projectile.y;
          });

          if (collision) {
            collisions.push({
              x: collision.x,
              y: collision.y
            });
          }
        });

        return {
          ...state,
          score: state.score + collisions.length,
          projectiles: state.projectiles
            .filter(function (projectile) {
              return projectile.y > 0;
            })
            .filter(function (projectile) {
              return !collisions.find(function (collision) {
                return (
                  projectile.x === collision.x && projectile.y === collision.y
                );
              });
            }),
          invaders: state.invaders.filter(function (invader) {
            return !collisions.find(function (collision) {
              return invader.x === collision.x && invader.y === collision.y;
            });
          })
        };
      });
    };

    const updateProjectilesPosition = function () {
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

    const updateGameState = function () {
      setState(function (state) {
        const isGameOver = !state.invaders.length;

        if (isGameOver) {
          setTimeout(function () {
            task('stop');
          }, 0);
        }

        return {
          ...state,
          isGameOver: state.isGameOver || isGameOver
        };
      });
    };

    return function () {
      processProjectilesCollision();
      updateProjectilesPosition();
      updateGameState();
    };
  })();

  // ----------
  // Life Cycle
  // ----------

  const intervalIds = [];

  const onStart = function () {
    const { invadersVelocity, projectilesVelocity } = settings;

    document.addEventListener('keydown', onKeyDown);

    intervalIds.push(setInterval(animateInvaders, invadersVelocity));
    intervalIds.push(setInterval(animateProjectiles, projectilesVelocity));
  };

  const onStop = function () {
    document.removeEventListener('keydown', onKeyDown);

    intervalIds.forEach(function (intervalId) {
      clearInterval(intervalId);
    });
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
      invadersDirection: {
        x: 1,
        y: 0
      },
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
})();
