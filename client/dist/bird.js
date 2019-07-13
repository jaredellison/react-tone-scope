// Variables

// All scaled between 0 and 1
const params = {
  freq: 0,
  amp: {
    attack: 0,
    decay: 0
  },
  freqMod: {
    mod1: 0,
    attack1: 0,
    decay1: 0,
    mod2: 0,
    attack2: 0,
    decay2: 0
  },
  ampMod: {
    mod1: 0,
    attack1: 0,
    decay1: 0,
    mod2: 0,
    attack2: 0,
    decay2: 0
  }
};

const freqScale = n => {
  n * 7000 + 300;
};
const envScale = n => {
  n * 900;
};

const dbScale = n => {
  return Math.log10(n) * 20;
};


// Modules:
//  Env - 5
//  Osc - 3
//  VCA - 5 +?

let mainOut = new Tone.Volume;
mainOut.connect(Tone.Master);

let osc = new Tone.Oscillator();
osc.connect(mainOut);
osc.start();

document.body.innerHTML += `
<input type="range" id="start" name="volume" min="0" max="1" step=".01" value="0">
<label for="volume">Volume</label>
`;

let started = false;

let volumeSlider = document.querySelector("input[name='volume']");
volumeSlider.addEventListener('input', e => {
  if (!started) {
    // osc.start();
    started = true;
    Tone.context.resume();
  }
  mainOut.volume.value = dbScale(e.target.value);
});