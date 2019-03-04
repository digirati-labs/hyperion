// This will be valid under a canvas.
// It will be an interface for controlling a virtual clock.
// It will take in some configuration, like frequency
// and return some data, like current time
// It will also provide some methods, like high performance syncing for media
// And it will also have some basic hooks into the HTML audio/video elements to sync those.
// Other methods for controlling the clock would be:
// - set current time
// - fast forward
// - rewind
// - set playback speed
//
// Other hooks might come out for priority updates. Like: useLowPriorityCanvasClock(), which will update at a preset
// lower tick rate.
