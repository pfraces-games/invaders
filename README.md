# Invaders

<https://pfraces.github.io/invaders>

## v0.1.0

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

Game is finally complete!

It took **6 hours** of development with **346 LOC**.

**Higlights:**

- Missing dev tools (linter and formatter)
- Keeping render functions pure and immutable state updates was not possible due to the rush
- Tiles positioning could be simpler by using absolute positioning
- The resulting implementation was a monolith which coupled game engine and game mechanics

### Product changelog (from Ania's implementation)

- Moved remaining invaders to the edges of the canvas
- Added start and pause / resume buttons
- Added a game over overlay

## v0.2.0

No more speed coding sessions for this project.

I want to change the implementation by fixing some design failures.

I want to implement a React-like render and some sort of game engine.

### Retrospective

Game is finally complete!

The code has been splitted in 3 files:

- `hyperscript.js`: 42 LOC
- `game-engine.js`: 101 LOC
- `app.js`: 480 LOC

**Higlights:**

- Missing dev tools (app bundler and app server)
- Missing game engine management of animations and collisions
- Missing a virtual dom engine

### Product changelog

- Removed the invader landing and defender dead styles to simplify implementation.
- The only game over condition is that the invader reaches the last row.

### Implementation changelog

- Added `editorConfig` and `eslint` development tools
- Pure render functions
- Added status bar to the render pipeline
- Simplified tiles positioning by using `position: absolute`
- Immutable state updates
- ASAP render updates by using `requestAnimationFrame`
- Decoupled game engine

## v0.3.0

I want to extend the game engine with animations and collisions.

Also, let's build a virtual dom engine!

### Retrospective

Game is finally complete!

The code has been splitted in 4 files:

- `src/lib/fp.js`: 8 LOC
- `src/lib/game-engine.js`: 96 LOC
- `src/lib/store.js`: 33 LOC
- `src/index.js`: 500 LOC

**Highlights:**

I had fun trying to implement a virtual dom engine but the diff algorithm was a lot harder than I though so I ended up using a 3rd party implementation.

While migrating to virtual dom, the state management has been decoupled from the game engine which make implementation simpler.

Collision detection can be improved but is simple and do the job.

### Product changelog

- Fixed killing leftmost invaders when they are moving down from leftmost position
- Invaders velocity increases when invaders are killed
- Added defender weapon cooldown
- Replaced statusbar actions with menus
- Removed player score

### Implementation changelog

- Hid elements outside the DOM-based canvas
- Added app bundler and app server
- Added game engine management of animations and collisions
- Added a virtual dom engine
- State management has been decoupled from game engine

## v0.4.0

I want to make the cell/grid size and the number of columns/rows fully customizable through the settings object.

I want to improve graphics by adding a canvas-generated space-themed background and sprites.

### Product changelog

- Changed fire cooldown by allowing a single flying projectile
- Added invader explosions
- Improved movement by using keydown and keyup events

### Implementation changelog

- Defender out of bounds response implemented as a collider
- Added dynamic grid sizing based on settings

## TODO

### Next release

- [ ] Check collisions after each animation
  - Bound colliders to animations
- [ ] Replace `keyboard.reset` with keypress events
- [ ] Move components to its own folder
- [ ] Replace entity styles with sprites

### Backlog

- [ ] Add space-themed background
- [ ] Add score (3 invader types with different score points)
  - 1st row invaders: 10pts
  - 2nd row invaders: 20pts
  - 3rd row invaders: 30pts
- [ ] Add mystery ship (100pts)
- [ ] Add sound effects
- [ ] Add background music
- [ ] Add high scores screen (needs server/firebase)

### N2H

- [ ] Movement smooth transitions
- [ ] State reducers
- [ ] Partial state updates
