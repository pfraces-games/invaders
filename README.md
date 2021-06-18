# Space Invaders

## Introduction

I've just watched Ania's [Space Invaders in JavaScript](https://www.youtube.com/watch?v=3Nz4Yp7Y_uA)
and want to repeat the same exercise by myself.

The challenge is to build a really simple clone of the Space Invaders 80s
videogame with vanilla JavaScript, HTML and CSS in the minimumm time possible

I will clone the mechanics of the videogame implemented by Ania but I want to
implement it using a different approach:

* Make some previous analysis of how the implementation should be
* Get ideas from React and game engines to hopefully simplify the implementation

I also want to provide an extra feature not implemented by Ania which is to move
remaining invaders to the edges of the canvas

Ania's implementation took her **40 minutes** to complete with **133 LOC**.
Let's see it goes for us.

Let's begin!

## Retrospective

Game is finally complete! It took **6 hours** of development with **346 LOC**.

Additional features:

* Move remaining invaders to the edges of the canvas
* Start and pause / resume buttons
* Game over overlay

### Design failures

* Collision detection has some issues due to the async nature of the state updates
* Collision detection design and performance can be improved
* Render functions are not pure
* Game engine is spreaded all over the game code
* State updates mixed mutations with immutable updates
* Missing unified game loop
* Missing rendering updates as soon as possible by using `requestAnimationFrame`
* Collision detection is domain specific
* Status bar should be included in the render pipeline
* Missing `editorConfig` and `eslint` settings decreases development time
* Ania's approach to use DOM classes instead of state was not optimal for game
  development but allow her to simplify the implementation