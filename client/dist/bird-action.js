const startChirping = () => {
  window.bird = new Bird();
  randomChirp();
  setInterval(() => {
    window.bird.trigger();
  }, 1000);


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


let randomChirp = () => {
  let time = Math.random() * 2500 + 100;
  setTimeout(() => {
    window.bird.trigger();
    randomChirp();
  }, time);
}