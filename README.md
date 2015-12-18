# brick.js

A DOM-level div-based "renderer" for JavaScript - and as elegant as a brick.

Initially conjured up for [anything.js](https://github.com/Rabrennie/anything.js).

## How does it work?

It's stupid simple. Creating a new instance of BRICK creates a new `<div>` element (the __root element__ or __context__) and appends it to the document body. Every new entity or sprite created through the BRICK instance is added to the root element.

Entities and sprites have accessors and modifiers defined for positions, sizes, and other things that directly affect their CSS styles. That's what does most of the magic.

The rest is up to the user. Attach callbacks, define behaviours, and be amazed at what a simple `<div>` element can do!

## How about documentation?

Maybe later on. The source is short and commented, so it shouldn't be a problem to figure things out.

However, here are some useful notes:

* `Element` is the building block. It defines get/set methods for width and height, as well as a shorthand for adding event listeners (`Entity.on()`)
* `Entity` extends `Element`. It defines get/set methods for position (x, y), graphic, scale, and angle.
* `Sprite` extends `Entity`. It has support for sprite sheets as graphics, and support for animations.
* Don't forget: everything is a `<div>` element, and all of the "transformations" are done through CSS!

## Examples?

Sure. Check out the examples folder.

## Can I contribute?

Yup. Fork, create a branch for your feature, push changes to that branch, and make a pull request!
