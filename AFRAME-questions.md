Documentation misses:

1. In which order to components and systems's tick() get called?
- all components then systems?
- all systems then components?
- follwing registration order?

2. hy are extraneous methods ignored when registering components, while accepted when registering systems?

3. registerGeometry, primitive, shader, mentioned as footnotes of components. They should be first class citizen in the Core API section.


Grabbing objects:
1. grabbable component not in doc, just a footnote of some guide. It seems to go in pair with hand-tracking-grab-controls which plain doesn't work (or the doc is missing so pretty important info to make it work)

2. adding a child to a hand-controls/occulus-touch-control's entity does attach it, but does not render it :( So the naive and preferred way of nesting objects that AFRAME is pushing forward as the golden path isn't working here.

3. hand-controls/occulus-touch-controls's hand model is actually facing downward when rotation is 0, 0, 0. That gets corrected somewhere somehow, but when syncing the controller's rotation to another entity (to emulate grabbing an object) then the entity is clearly facing the wrong direction. With the x/y axis swap of the Euler referencial then it's hard to fix.