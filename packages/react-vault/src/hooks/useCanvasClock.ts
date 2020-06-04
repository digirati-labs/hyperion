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

import { useRafLoop, useUpdate } from 'react-use';
import { useState, useCallback } from 'react';
import { useCanvas } from './useCanvas';

export function useCanvasClock(canvasId?: string, autoplay = false) {
  const canvas = useCanvas(canvasId ? { id: canvasId } : undefined);
  if (!canvas || typeof canvas.duration === 'undefined') throw new Error('Unsupported or undefined canvas');

  const update = useUpdate();
  const [lastCall, setLastCall] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [loopStop, loopStart, isActive] = useRafLoop(time => {
    const timeInSeconds = lastCall === 0 ? 0 : (time - lastCall) / 1000;
    if (currentTime + timeInSeconds < canvas.duration) {
      setCurrentTime(t => t + timeInSeconds);
    } else {
      setCurrentTime(canvas.duration);
      loopStop();
    }
    setLastCall(time);
  }, autoplay);

  const play = useCallback(
    () => {
      if (currentTime === canvas.duration) {
        setCurrentTime(0);
        setLastCall(0);
      }
      loopStart();
      update();
    },
    [currentTime, loopStart, update]
  );

  const pause = useCallback(
    () => {
      loopStop();
      update();
    },
    [loopStop, update]
  );

  return {
    isPlaying: isActive(),
    currentTime,
    duration: canvas.duration,
    play,
    pause,
    seek: setCurrentTime,
  };
}
