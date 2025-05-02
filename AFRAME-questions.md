Documentation misses:

1. In which order to components and systems's tick() get called?
- all components then systems?
- all systems then components?
- follwing registration order?

2. why are extraneous methods ignored when registering components, while accepted when registering systems?

3. registerGeometry, primitive, shader, mentioned as footnotes of components. They should be first class citizen in the Core API section.

4. doc says obb-collider size defaults to 0 0 0, but is fact it's just 0

5. Entity doc is missing getChildEntities(), is() and hasAttribute() methods

6. Pivot component undocumented (in extras/components source folder)

FRAMEWORK issues

1. obb-collider should be playable/pausable instead of running on every tick

2. push for el.getAttribute('component_name').attribute_name but also available el.components.component_name.data.attribute_name, as least in read only
setAttribute() probably fires the right events 'componentchanged'


Grabbing objects:
1. grabbable component not in doc, just a footnote of some guide. It seems to go in pair with hand-tracking-grab-controls which plain doesn't work (or the doc is missing so pretty important info to make it work)

2. adding a child to a hand-controls/occulus-touch-control's entity does attach it, but does not render it :( So the naive and preferred way of nesting objects that AFRAME is pushing forward as the golden path isn't working here. => re-parenting not supported
- leave object where it is in the HTML/Three hiearachy and sync its position/rotation (with the -90deg quirk)
- create a duplicate entity and had it to the hand, remove original from scene => useful to have a "gimbal" in between the object and hand to counteract -90deg quirk

3. hand-controls/occulus-touch-controls's hand model is actually facing downward when rotation is 0, 0, 0. That gets corrected somewhere somehow, but when syncing the controller's rotation to another entity (to emulate grabbing an object) then the entity is clearly facing the wrong direction. With the x/y axis swap of the Euler referencial then it's hard to fix.



Debugging headset:
1. https://developer.oculus.com/meta-quest-developer-hub/
Recording videos
2. https://www.meta.com/help/quest/articles/in-vr-experiences/social-features-and-sharing/record-video-oculus/