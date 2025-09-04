let audioContext; // Declared
// Later, when trying to use it:
if (!audioContext) {
    // This line might fail in older browsers or if audio is blocked
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}
