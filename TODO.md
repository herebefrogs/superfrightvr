bugs
- entities in a level that's hidden aren't paused
- gun is rotated 90 deg because so is the hand model (though I don't know where that is corrected)

game:
x moving between a title screen, lobby and levels
x grabbing/releasing a gun
- shooting a target
- physics
- stop game when 13s have passed
- implement interesting puppet motions/behaviours
- implement methods to pause/resume the game properly when leaving the VR browser for the Occulus main menu and back

build:
- see what can get optimized in Terser config, given I'm mostly using external lib AFrame's public API
- if ever any assets, would avif compress better than webp?
- can I add a round of etc/ect to compress the ZIP even better?