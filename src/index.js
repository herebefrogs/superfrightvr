// NOTE: this is also stupid and no better than listing <scripts>
// but given the components and systems are independent by nature,
// they don't import each other so that's the only way for esbuild
// to bundle anything

import "./primitives/a-gun.js"
import "./primitives/a-portal.js"
import "./primitives/a-pyramid.js"
import "./components/debug-console.js"  // TODO remove for shipping
import "./components/dynamic-collider.js"
import "./components/game-time.js"
import "./components/gravity.js"
import "./components/gesture-tracker.js"
import "./components/level.js"
import "./components/motion-tracker.js"
import "./components/puppet.js"
import "./components/sync-stance.js"
import "./systems/game-time.js"
import "./systems/gesture-tracker.js"
import "./systems/puppeteer.js"
import "./systems/conductor.js" // must be loaded after game-time due to event listeners registration
