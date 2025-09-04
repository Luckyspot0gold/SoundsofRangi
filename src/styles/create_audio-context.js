function createAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Browsers often require audio context to be resumed after a user gesture (like a click)
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        } catch (e) {
            console.error("Web Audio API is not supported in this browser", e);
            return null;
        }
    }
    return audioContext;
}
// Then, in your toggleAudio function:
const ctx = createAudioContext();
if (!ctx) { return; } // Exit if audio isn't supported
