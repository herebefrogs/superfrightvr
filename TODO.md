bugs
- bullet origin is wrong (not the muzzle of the gun)
x gravity/physis should stop affecting objects in inactive levels
x holding gun with 2 hands crashes game (one hand has the other as a target, so gun methods don't work on it)
x holding a gun while changing level crashes the game when the gun is released (something to do with the target... fix in conductor or gesture-tracker)
x entities in a level that's hidden aren't paused
x gun is rotated 90 deg because so is the hand model (though I don't know where that is corrected)

game:
x moving between a title screen, lobby and levels
x grabbing/releasing a gun
x make bullet
x hit a target
- physics (so you can throw stuff at enemies)
- stop game when 13s have passed
- implement interesting puppet motions/behaviours
- implement methods to pause/resume the game properly when leaving the VR browser for the Occulus main menu and back

build:
- see what can get optimized in Terser config, given I'm mostly using external lib AFrame's public API
- if ever any assets, would avif compress better than webp?
- can I add a round of etc/ect to compress the ZIP even better?