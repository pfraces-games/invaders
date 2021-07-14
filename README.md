# Invaders

Grid-based browser game inspired by Space Invaders

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

It took **6 hours** of development with **345 LOC** in a single file.

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

- No more speed coding sessions for this project.
- Change the implementation by fixing some design failures.
- Implement a React-like render and some sort of game engine.

### Retrospective

Complete rewrite with React-like components! (no virtual dom though)

**Higlights:**

- Missing dev tools (app bundler and app server)
- Missing game engine management of animations and collisions
- Missing a virtual dom engine

**Source code stats:**

- `hyperscript.js`: 41 LOC
- `game-engine.js`: 100 LOC
- `app.js`: 479 LOC

A total of **620 LOC**

### Product changelog

- Removed the invader landing and defender dead styles to simplify implementation.
- The only game over condition is that the invader reaches the last row.

### Implementation changelog

- Added `editorConfig`, `eslint` and `prettier` development tools
- Pure render functions
- Added status bar to the render pipeline
- Simplified tiles positioning by using `position: absolute`
- Immutable state updates
- ASAP render updates by using `requestAnimationFrame`
- Decoupled game engine

## v0.3.0

- Extend the game engine with animations and collisions.
- Let's build a virtual dom engine!

### Retrospective

Welcome [snabbdom](https://github.com/snabbdom/snabbdom)!

**Highlights:**

- I had fun trying to implement a virtual dom engine but the diff algorithm was a lot harder than I though
- Snabbdom virtual dom library has been added
- State management has been decoupled from the game engine which make implementation simpler
- Collision detection can be improved but it is simple enough to do the job

**Source code stats:**

- `src/lib/fp.js`: 7 LOC
- `src/lib/game-engine.js`: 95 LOC
- `src/lib/store.js`: 32 LOC
- `src/index.js`: 499 LOC

A total of **633 LOC**

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

- Make the cell/grid size and the number of columns/rows fully customizable through the settings object.
- Improve graphics by adding sprites.

### Retrospective

Full rewrite was not needed this time!

I wanted to release this version even with known bugs and missing sprites because I wanted to publish with the recently added sprites and I want to publish only released versions.

**Highlights:**

- Impressive impact on user experience by adding sprites!
- New key bindings system successfully removed the effect of movement freeze but added new challenges:
  - It makes difficult to move the defender a single cell
  - It had issues in menus so a `keyboard.reset` hack has been needed

**Source code stats:**

- `src/lib/fp.js`: 5 LOC
- `src/lib/game-engine.js`: 148 LOC
- `src/lib/store.js`: 32 LOC
- `src/index.js`: 580 LOC

A total of **765 LOC**

### Product changelog

- Changed fire cooldown by allowing a single flying projectile
- Improved movement by using keydown/keyup events
- Added sprites

### Implementation changelog

- Defender out of bounds response implemented as a collider
- Added dynamic grid sizing based on settings
- Added invader explosions (yet invisible due to missing sprite)
- Moved key bindings management to game engine
- Defender movement implemented as an animation

## v0.5.0

- Add sound effects

### Retrospective

The original objectives for this release have been moved to the next one.

I ended up looking for free game assets and researching about how to add sounds to the game.

**Highlights:**

- Big impact on user experience by adding sound effects

**Source code stats:**

- `src/lib/fp.js`: 5 LOC
- `src/lib/game-engine.js`: 169 LOC
- `src/lib/store.js`: 32 LOC
- `src/index.js`: 618 LOC

A total of **824 LOC**

### Product changelog

- Added explosion sprite
- Added sound effects

### Implementation changelog

- Moved layout static node to the render pipeline

## v0.6.0

- Improve graphics by adding a space-themed background.
- Fix known issues.

### Retrospective

Long standing collision bug was finally fixed!

This release was mainly a refactor.

**Highlights:**

- Dynamic background generation has been discarded to prevent multiple rendering
  pipelines (DOM vs canvas)
- Components have been moved to its own folder and splitted in several files
- Engine have been splitted in several modules

**Source code stats:**

- `src/components/layout-component.js`: 32 LOC
- `src/components/menu-layer-component.js`: 83 LOC
- `src/components/root-component.js`: 6 LOC
- `src/components/sprite-component.js`: 15 LOC
- `src/components/world-layer-component.js`: 32 LOC
- `src/lib/animation.js`: 45 LOC
- `src/lib/collider.js`: 8 LOC
- `src/lib/fp.js`: 11 LOC
- `src/lib/game-engine.js`: 85 LOC
- `src/lib/keyboard.js`: 41 LOC
- `src/lib/sound.js`: 13 LOC
- `src/lib/store.js`: 43 LOC
- `src/index.js`: 437 LOC

A total of **851 LOC**

### Product changelog

- Improved projectile/invader collisions
- Removed defender on game over
- Added space-themed background

### Implementation changelog

- Bound colliders to animations
- Bound colliders are applied after animation update
- Decoupled components
- Decoupled engine features
- Rewritten invaders initialization with division and module
- Prevented `onStateChange` infinite loop
- Added explicit keyboard initialization

## v0.7.0

- Add score
- Add the mystery ship

### Retrospective

Welcome mystery ship!

**Highlights:**

- More than 1K lines of code (over 100 LOC to add mystery ship)
- Nice looking score component
- The mystery ship implementation needed features not yet implemented in the engine:
  - Spawning animations at specific time interval
  - Sound loop and stop
- The removal of `onStateChange` required animations and sound loops management to be repeated in several parts

**Source code stats:**

- `src/components/layout-component.js`: 50 LOC
- `src/components/lcd-component.js`: 59 LOC
- `src/components/menu-layer-component.js`: 81 LOC
- `src/components/root-component.js`: 6 LOC
- `src/components/sprite-component.js`: 15 LOC
- `src/components/stats-layer-component.js`: 9 LOC
- `src/components/world-layer-component.js`: 38 LOC
- `src/lib/engine/animation.js`: 52 LOC
- `src/lib/engine/collider.js`: 7 LOC
- `src/lib/engine/engine.js`: 65 LOC
- `src/lib/engine/keyboard.js`: 42 LOC
- `src/lib/engine/sound.js`: 21 LOC
- `src/lib/engine/vdom.js`: 5 LOC
- `src/lib/fp.js`: 5 LOC
- `src/lib/store.js`: 23 LOC
- `src/index.js`: 551 LOC

A total of **1029 LOC**

### Product changelog

- Added score component
- Incremented score depending on invader type
  - `gamma` invaders: 10pts
  - `beta` invaders: 20pts
  - `alfa` invaders: 30pts
- Added mystery ship (100pts)

### Implementation changelog

- Grouped settings
- Added `vdom` engine module
- Moved game engine and its modules to its own folder
- Removed engine dependency on fp lib
- Removed state change notifications
- Added sound loops

## v0.8.0

- Add high scores menu

### TODO

- [ ] Improve screen management
- [ ] Improve sounds balance
- [ ] Add config menu with sounds volumne and custom key bindings
  - Volume off by default
  - Save user config in `localStorage`
- [ ] Add high scores screen (needs server/firebase)

## Roadmap

### v0.9.0

- [ ] Add multiple stages increasing invaders velocity on each stage
  - Create a `scene` module
  - Change scene init by using a matrix
- [ ] Show credits when winning the game

## Backlog

### Project

- [ ] Production build
- [ ] Replace relative imports with folder alias
- [ ] Use CSS modules
- [ ] Rewrite with TypeScript

### Game

- [ ] Quit current game from game pause menu
- [ ] Improve menu navigation by using spacebar instead of escape to skip menu windows

### Engine

- [ ] Hide shared state from engine modules with `init` wrappers?
  - This would allow to initialize the same module multiple times each one with its own state
  - Useful for `scene` module?
- [ ] Move game engine to its own repo
- [ ] Add API documentation

### Init

- [ ] Create an `init` module?
  - Calling `mount` and `keyboard.listen()`
  - `mount` vtree when all sounds are loaded

### Game loop

- [ ] Decouple game loop from engine

### Keyboard

- [ ] Replace `keyboard.reset` with keypress events
  - Improve keyboard bindings for menus

### Sounds

- [ ] Rename module to `audio`
- [ ] Add functionality to pause/resume all sounds
- [ ] Replace Ogg sounds with Web Audio API

### Scene

- [ ] Create a `scene` module?
  - Background image
  - Actors map
  - Spawning actors

### Menu

- [ ] Create a `menu` module?
- [ ] Add menu trees
  - Menu trees can be bound to different scenes
  - Menu trees can be reuse with different scenes
  - Thinking about demo animations played in the background
- [ ] Automatic run/stop animation/audio relative to menu state
  - Such handling was previosly centralized in the deprecated `onStateChage`

### Animation

- [ ] Rename module
  - Actor? Entity? Other?
- [ ] Improve API to allow a simpler way to spawn actors

### Collider

- [ ] Add `detect` method to separate collision detection and response
  - `detect` returs a collision or an array of collisions
  - `respond` is only called if collisions have been detected and receives the `detect` output
- [ ] Improve animation/collider API to prevent loading colliders before animations
- [ ] Improve collider API so a collider is declared as a collision between 2 actors
  - Compare coordinates internally
  - Handle arrays of actors of the same type
  - Boundary actor functions or invisible actors outside the scene?
  - Does this need to handle state by the engine? Is there a way to prevent it?

### Store

- [ ] Add a 2nd callback to `setState` to execute side-effects once state has changed
- [ ] State updates using `immerjs`
- [ ] Partial component rendering
- [ ] Add state selectors to `withState` HOC
- [ ] State reducers
- [ ] Partial state updates

### Misc

- [ ] Sprite smooth movement
- [ ] Sprite animations
- [ ] Sprite groups
