# SuperFRIGHT VR

## What is this?

SuperHOT VR meets Fear of Number 13 for JS13KGAMES 2024

## How to play?

## Under the hood

`motion-tracker` component flags its entity with the 'player-moving' state if the entity has changed position or rotation between the last tick and the current one.
It is applied to the `<a-camera>` primitive and `<a-entity>` with `hand-controls` component to detect the player moving its head, body or hands

`game-time` system keeps track of the game time and only update it if the player is moving by checking with each entity with `motion-tracker` components (head, body, hands) when they have the `player-moving` state.
It emits a `step` event (given `tick` is already reserved by AFRAME) for whichever component or system interested in consuming the new game-time (typically the ones moving things around)

`game-time` component update its entity's text component's value with the current game-time

`puppeteer` system listens to `step` events and update each puppet's position

`puppet` component is currently an empty component used for `puppeteer` to mark which entities it must move.

`gesture-tracker` component keeps track of which game actions are made on one hand controller (grabbing, shooting) and game entity it is colliding with (hovering-portal, hovering-gun). It is apply to each entity with `hand-controls` component.

`gesture-tracker` system check each hand controller actions and triggers relevant transition (e.g. grabbing a portal loads the next level, grabbing a gun makes the gun follow the hand, dropping a gun leaves the gun at the last hand position...)

`portal` component setup an `obb-collider` on its entity so it can be hovered and grabbed, and keeps track of which level should be loaded.


`a-gun` primitive is an assembly of other primitives depicting a gun pointing forward.

`a-pyramid` primitive is an assembly of other primitives depicting a pyramid pointing face up.

Lifecycle

comp.motion-tracker -> player-moving state -> sys.game-time -> step event -> sys.puppeteer

comp.gesture-tracker -> grabbing state
                     -> hovering-portal state
                     -> hovering-gun state
                     -> shooting state

grabbing + hovering-portal states -> sys.gesture-tracker -> loadlevel event

grabbing + hovering-gun states -> sys.gesture-tracker -> holding-gun state
holding-gun + !grabbing states -> sys.gesture-tracker ->