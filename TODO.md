bugs
- on retry, enemy bullets from the previous attempts are still active (even though no longer visible)
  and kill the player (level 4 and 5)... have system.level clear them, or clear themselves on level-loaded event
- 2~3 more methods to relocate, and fire events instead to trigger them to decouple components
  system.level + system.gesture-tracker
- one or more code decisions to document (look at TODO why did I do this?)

game:
- physics (so you can throw stuff at enemies)
- implement interesting puppet motions/behaviours
- implement methods to pause/resume the game properly when leaving the VR browser for the Occulus main menu and back

build:
- see what can get optimized in Terser config, given I'm mostly using external lib AFrame's public API
- if ever any assets, would avif compress better than webp?
- can I add a round of etc/ect to compress the ZIP even better?