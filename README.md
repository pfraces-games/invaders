# Space Invaders

## Introduction

I've just watched Ania's [Space Invaders in JavaScript](https://www.youtube.com/watch?v=3Nz4Yp7Y_uA)
and want to repeat the same exercise by myself.

The challenge is to build a really simple clone of the Space Invaders 80s
videogame with vanilla JavaScript, HTML and CSS in the minimumm time possible

I will clone the mechanics of the videogame implemented by Ania but I want to
implement it using a different approach:

- Make some previous analysis of how the implementation should be
- Get ideas from React and game engines to hopefully simplify the implementation

I also want to provide an extra feature not implemented by Ania which is to move
remaining invaders to the edges of the canvas

Ania's implementation took her **40 minutes** to complete with **133 LOC**.
Let's see it goes for us.

Let's begin!

### Retrospective

Game is finally complete! It took **6 hours** of development with **346 LOC**.

**Additional features:**

- Move remaining invaders to the edges of the canvas
- Start and pause / resume buttons
- Game over overlay

**Design failures:**

- [x] Missing `editorConfig` and `eslint` settings decreases development time
- [x] Render functions are not pure
- [x] Status bar should be included in the render pipeline
- [x] Tiles positioning should be simplified using `position: absolute`
- [x] State updates mixed mutations with immutable updates
- [x] Missing rendering updates as soon as possible by using `requestAnimationFrame`
- [x] Game engine is spreaded all over the code
- [ ] Collision detection issues due to the async nature of the state updates
- [ ] Collision detection is domain specific
- [ ] Collision detection is spreaded all over the code
- [ ] Missing unified game loop

## 2nd exercise

In this case I want to change the implementation by fixing the design failures
found in the 1st exercise. This time I don't want to do a speed coding session.
Instead I want to implement a React-like render and some sort of game engine.

### Retrospective

Game is finally complete! I've removed the invader landing and defender dead
styles for simplicity of implementation. The only check for game over is for the
invader to reach the last column.

The code has been splitted in 3 files:

- hyperscript.js with 42 LOC
- game-engine.js with 101 LOC
- app.js with 480 LOC

**Pending design failures (from previous implementation):**

- [x] Missing unified game loop
- [x] Collision detection is domain specific
- [x] Collision detection is spreaded all over the code
- [x] Collision detection issues due to the async nature of the state updates

**Design failures:**

- [x] Avoid gameOver side effects from setState
- [x] Avoid using setTimeout to render gameOver
- [x] Hide elements outside canvas boundaries
- [x] Missing development environment (app server and bundler with support for modules)
- [x] (Bug) Killing leftmost invaders when they are moving down from leftmost position
- [x] Remove state diff optimization
- [x] Velocity as a function of state
- [ ] Game engine single export: `init((deps) => config)`
- [ ] Move life cycle from engine to game
- [ ] Add virtual dom to optimize memory usage and to fix mouse interacions
- [ ] Replace components HOFs by providing the state needed by named props
- [ ] Add component memoization
- [ ] Improve movement by using keydown and keyup events
- [ ] Improve status bar buttons texts and visibility
- [ ] Improve collisions: Killed invaders having other invaders underneath
  - Enities with `{ render, updatePosition, colliders }` methods
  - Manage decimal positions in colliders rounded to integers in grid cells
- [ ] (Optional) Debug tools: fps graph and state viewer
- [ ] (Optional) State selectors `getState((state) => selector)` and partial state updates
- [ ] (Optional) Use reactivity to control component updates
