# JS13KGAMES 2024

## What is this?

Superhot meets Fear of Number 13

## How to play?

## Under the hood

`motion-tracker` component flags its entity with the 'player-moving' state if the entity has changed position or rotation between the last tick and the current one.
It is applied to the `<a-camera>` primitive and `<a-entity>` with `hand-controls` component to check whether the player has moved its head, body or hands

`puppeteer` system keeps track of the game time and only update it when at least one of the entities with `motion-tracker` components (head, body and hands of the player) detected motion.

`puppet` component update its entity's position and/or rotation when game time has changed (aka player moved a bit).

`game-time` component update its entity's text component's value with the current game-time