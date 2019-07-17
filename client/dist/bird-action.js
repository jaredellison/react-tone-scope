const startChirping = () => {
  window.bird = new Bird();
  setInterval(() => {
    window.bird.trigger();
  }, 1000);

  // Connect oscilloscope for debugging
  document.querySelector('tone-oscilloscope').bind(bird.voice.ampModVca1);
};

let started = false;

let volumeSlider = document.querySelector('#volume');
volumeSlider.addEventListener('input', e => {
  if (!started) {
    started = true;
    Tone.context.resume();
    startChirping();
  }
  masterVolume.volume.value = dbScale(e.target.value);
});
