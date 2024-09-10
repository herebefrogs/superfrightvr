// cache utterances by message so they can be reused
const utterances = {};

// voices are loaded asynchronously, but the API doesn't return a promise
// so attempt to load voices for 1 second before giving up
const getVoices = () => new Promise((resolve, reject) => {
  let attempts = 0;

  let id = setInterval(() => {
    attempts += 1;
    if (speechSynthesis.getVoices().length) {
      resolve(speechSynthesis.getVoices());
      clearInterval(id);
    }
    else if (attempts >= 100) {
      reject([]);
      clearInterval(id);
    }
  }, 10);
});


// Speech Synthesis wrapper API

/**
 * Initialize speech synthesis voices and return a function to speak text
 * using a random voice from the ones matching the navigator's language value
 * @return function to pronounce a text using a random voice from the ones matching the navigator's language value
 */
async function initSpeech() {
  // find all suitable voices
  const allVoices = await getVoices();
  const bestVoices = []
  for (const name of ['Boing', 'Zarvox', 'Whisper']) {
    const voice = allVoices.find(v => v.name === name)
    if (voice) { bestVoices.push(voice) }
  }

  if (bestVoices.length) {
    let i = 0;
    // return a function to speak a message in that voice
    return function(text) {
      // retrieved a cached utterance of this message, or create a new utterance
      const utterance = utterances[text] || (utterances[text] = new SpeechSynthesisUtterance(text));
      utterance.voice = bestVoices[i];
      utterance.pitch = 0.1
      speechSynthesis.speak(utterance);
      i = (i + 1) % bestVoices.length;
    }
  } else {
    return function() {
      // no-op since no suitable voice is available
    }
  }
}

(async () => { window.speak = await initSpeech(); })()