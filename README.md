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

`a-gimbal` primitive is a geometry-less entity used to orient children entities in a certain direction

`a-level` primitive

`a-bullet` primitive

`a-portal` primitive

## Event & state lifecycle

**Legend**: (entity.component, "event" | +/-state [, entity]) --causes--> (entity, +/-state | "event" [, targeted_entity])

```
# hands interactions
(hand.hand-control, "gripdown")    -> (hand, +grabbing)
(hand.hand-control, "gripup")      -> (hand, -grabbing)
(hand.hand-control, "triggerdown") -> (hand, +grabbing)
(hand.hand-control, "triggerup")   -> (hand, -grabbing)

(hand.obb-collider, "obbcollisionstarted", gun|portal)
                                   -> (hand, +hovering, gun|portal)
(hand.obb-collider, "obbcollisionended", target)
                                   -> (hand, -hovering, gun|portal)

(hand, +hovering, gun) && (hand, +grabbing)
                       && (hand, -holding)   # 1 hand cannot hold 2 guns
                       && (gun, -held)       # 2 hands cannot hold the same gun
                                   -> (hand, +holding, gun) && (gun, +held)
(hand, +holding, gun) && (hand, -grabbing)
                                   -> (hand, -holding, gun) && (gun, -held)

(hand, +hovering, portal) && (hand, +grabbing)
                          && (hand, -holding) # 1 hand cannot hold a gun and a portal
                                   -> (portal, "load-level")

# bullet interactions
# TODO
```

## THREE.js/A-FRAME orientation

```
       ^ +y
       |
       |
       |
        ------> +x
      /
     /
    v +z
```

**Caveat**: Hand in GLB file modelled pointing along - y-axis, and rotated by A-FRAME 90 degrees counter-clockwise along the x-axis so it renders pointing towards - z-axis (away from the camera). Any Entity with geometry modelled to point forward - z-axis is rotated as well and will point up toward +y-axis

## Test cases

1. grab a gun -> hold the gun pointing forward, gun follows hand
2. grab a gun -> other hand can't grab it ("2 hands can't grab the same gun" principle)
3. grab a gun -> can't grab a portal or another gun with a gun in hand ("1 hand can't grab 2 guns" principle)
4. drop a gun -> released gun drops
5. drop a gun -> hand can grab it back without exiting the gun's collision box
6. drop a gun while other hand is trying to grab it -> released gun is instantly caught by other hand
7. grab a portal -> change level
8. grab a portal while other hand grab a gun -> gun isn't carried into the next level, releasing hand grip does not cause problem
9. grab a portal with bullets flying -> bullets aren't carried into the next level (even if they don't render, make sure they're not active in the new level)
