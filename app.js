(function () {
    const canvas = document.querySelector("#canvas");
    const startButton = document.querySelector("#start");
    const pauseResumeButton = document.querySelector("#pause-resume");
    const score = document.querySelector("#score");
    
    const settings = {
        gridWidth: 15,
        gridHeight: 15,
        rowInvadersQty: 10,
        invaderRows: 3,
        refreshRate: 100,
        invaderVelocity: 600,
        projectileVelocity: 200,
    };

    let state = {};
    const intervalIds = [];

    const resetState = function () {
        state = {
            isRunning: false,
            isGameOver: false,
            cells: [],
            invaders: [],
            defender: null,
            projectiles: [],
            invadersDirection: { x: 1, y: 0 }
        };
    };

    const initCells = function () {
        state.cells = [];
        const totalCells = settings.gridWidth * settings.gridHeight;

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            state.cells.push(cell);
        }
    };

    const initInvaders = function () {
        state.invaders = [];
        const invadersQty = settings.rowInvadersQty * settings.invaderRows;

        for (let i = 0; i < invadersQty; i++) {
            const invaderElement = document.createElement('div');
            invaderElement.classList.add('invader');

            state.invaders.push({
                element: invaderElement, 
                x: i % settings.rowInvadersQty,
                y: Math.floor(i / settings.rowInvadersQty)
            });
        }
    };

    const initDefender = function () {
        const defenderElement = document.createElement('div');
        defenderElement.classList.add('defender');

        state.defender = {
            element: defenderElement,
            x: Math.ceil(settings.gridWidth / 2) - 1,
            y: settings.gridHeight - 1
        };
    };

    const checkCollisions = function () {
        const collisions = [];
        
        state.projectiles.forEach(function (projectile) {
            const invaderCollision = state.invaders.find(function (invader) {
                return invader.x === projectile.x && invader.y === projectile.y;
            });

            if (invaderCollision) {
                collisions.push({
                    x: invaderCollision.x,
                    y: invaderCollision.y
                });
            }

            if (projectile.y < 0) {
                collisions.push({
                    x: projectile.x,
                    y: projectile.y
                });
            }
        });

        state.invaders.forEach(function (invader) {
            if (invader.x === state.defender.x && invader.y === state.defender.y) {
                collisions.push({
                    x: invader.x,
                    y: invader.y
                });

                state.defender.element.classList.add('dead');
                gameOver();
            }

            if (invader.y === settings.gridHeight - 1) {
                invader.element.classList.add('landed');
                gameOver();
            }
        });

        collisions.forEach(function (collision) {
            state.invaders = state.invaders.filter(function (invader) {
                return invader.x !== collision.x || invader.y !== collision.y;
            });

            state.projectiles = state.projectiles.filter(function (projectile) {
                return projectile.x !== collision.x || projectile.y !== collision.y;
            });
        });
    };

    const renderScore = function () {
        const invadersQty = settings.rowInvadersQty * settings.invaderRows;
        score.innerHTML = `Score: ${invadersQty - state.invaders.length}`;
    };

    const renderCells = function () {
        state.cells.forEach(function (cell) {
            canvas.appendChild(cell);
        });
    };

    const renderInvaders = function () {
        state.invaders.forEach(function (invader) {
            const cellIndex = (settings.gridWidth * invader.y) + invader.x;
            state.cells[cellIndex].appendChild(invader.element);
        });
    };

    const renderDefender = function () {
        const defender = state.defender;
        const cellIndex = (settings.gridWidth * defender.y) + defender.x;
        state.cells[cellIndex].appendChild(defender.element);
    }

    const renderProjectiles = function () {
        state.projectiles.forEach(function (projectile) {
            const cellIndex = (settings.gridWidth * projectile.y) + projectile.x;
            state.cells[cellIndex].appendChild(projectile.element);
        });
    };

    const render = function () {
        canvas.innerHTML = '';
        initCells();
        checkCollisions();

        renderScore();
        renderCells();
        renderInvaders();
        renderDefender();
        renderProjectiles();
    };

    const getLeftMostInvader = function () {
        return state.invaders.reduce(function (acc, invader) {
            return invader.x < acc.x ? invader : acc;
        });
    };

    const getRightMostInvader = function () {
        return state.invaders.reduce(function (acc, invader) {
            return invader.x > acc.x ? invader : acc;
        });
    };

    const updateInvadersDirection = function () {
        const rowStart = 0;
        const rowEnd = settings.gridWidth - 1;
        const leftMostInvader = getLeftMostInvader();
        const rightMostInvader = getRightMostInvader();

        if (state.invadersDirection.y === 1) {
            state.invadersDirection = { x: leftMostInvader.x === rowStart ? 1 : -1, y: 0 };
            return;
        }

        if (
            (rightMostInvader.x === rowEnd && state.invadersDirection.x === 1) ||
            (leftMostInvader.x === rowStart && state.invadersDirection.x === -1)
        ) {
            state.invadersDirection = { x: 0, y: 1 }
            return;
        }
    };

    const updateInvadersPosition = function () {
        state.invaders.forEach(function (invader) {
            invader.x += state.invadersDirection.x;
            invader.y += state.invadersDirection.y;
        });
    };

    const updateProjectilesPosition = function () {
        state.projectiles.forEach(function (projectile) {
            projectile.y -= 1;
        });
    };

    const moveDefenderLeft = function () {
        const rowStart = 0;

        if (state.defender.x > rowStart) {
            state.defender.x -= 1;
        }
    };

    const moveDefenderRight = function () {
        const rowEnd = settings.gridWidth - 1;

        if (state.defender.x < rowEnd) {
            state.defender.x += 1;
        }
    };

    const fire = function () {
        const projectileCoords = {
            x: state.defender.x,
            y: state.defender.y - 1
        };

        const projectileOverlap = state.projectiles.find(function (projectile) {
            return projectile.x === projectileCoords.x && projectile.y === projectileCoords.y;
        });

        if (projectileOverlap) {
            return;
        }

        const element = document.createElement('div');
        element.classList.add('projectile');

        state.projectiles.push({
            element,
            ...projectileCoords
        });
    };

    const initState = function () {
        resetState();
        initCells();
        initInvaders();
        initDefender();
    };

    const onKeyDown = function (event) {
        const key = event.key;

        if (key === 'ArrowLeft') {
            moveDefenderLeft();
            return;
        }

        if (key === 'ArrowRight') {
            moveDefenderRight();
            return;
        }

        if (key === 'ArrowUp') {
            fire();
            return;
        }
    };
    
    const init = function () {
        initState();
        render();
    };

    const pause = function () {
        state.isRunning = false;

        document.removeEventListener('keydown', onKeyDown);

        intervalIds.forEach(function (intervalId) {
            clearInterval(intervalId);
        });
    };

    const run = function () {
        state.isRunning = true;

        document.addEventListener('keydown', onKeyDown);
        
        intervalIds.push(setInterval(function () {
            if (!state.invaders.length) {
                gameOver();
                return;
            }

            updateInvadersDirection();
            updateInvadersPosition();
        }, settings.invaderVelocity));

        intervalIds.push(setInterval(function () {
            updateProjectilesPosition();
        }, settings.projectileVelocity));

        intervalIds.push(setInterval(render, settings.refreshRate));
    }

    const start = function () {
        if (state.isRunning) {
            pause();
        }

        init();
        run();
    };

    const pauseResume = function () {
        if (state.isGameOver) {
            return;
        }

        state.isRunning ? pause() : run();
    };

    const gameOver = function () {
        if (state.isGameOver) {
            return;
        }

        pause();
        state.isGameOver = true;

        const backdrop = document.createElement('div');
        backdrop.classList.add('game-over');
        backdrop.innerHTML = state.invaders.length ? "Game Over" : "You Win";
        canvas.appendChild(backdrop);
    };

    startButton.addEventListener('click', start);
    pauseResumeButton.addEventListener('click', pauseResume);

    init();
})();