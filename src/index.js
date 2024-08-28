// TODO this is also stupid and no better than listing <scripts>
// but given the components and systems are independent by nature
// they don't import each other so that's the only way for esbuild
// to bundle anything

import "./primitives/a-pyramid.js"
import "./components/debug-console.js"
import "./components/game-time.js"
import "./components/gesture-tracker.js"
import "./components/motion-tracker.js"
import "./components/portal.js"
import "./components/puppet.js"
import "./systems/game-time.js"
import "./systems/gesture-tracker.js"
import "./systems/puppeteer.js"
