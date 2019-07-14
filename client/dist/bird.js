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

let masterVolume = new Tone.Volume;

let osc = new Tone.Oscillator();
osc.chain(masterVolume, Tone.master);
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
  masterVolume.volume.value = dbScale(e.target.value);
});


class Bird {
  constructor() {
    this.modules = {

    }
  }
}

// Tone.Add 1
// Tone.Multiply 1
// Tone.Envelope

class FreqMod {
  constructor(modulation, attack, decay) {
    // Variable Params
    this.modulation = modulation || 0;
    this.attack = attack || 0;
    this.decay = decay || 0;

    // Statc Params
    this.attackDecayScale = 900;
    this.modulationScale = 3000;

    // Tone modules
    this.envelope = new Tone.Envelope;
    this.vca = new Tone.Volume;
    this.multiply = new Tone.Multiply(this.modulationScale);

    // Connect modules
    this.envelope.chain(this.vca, this.multiply);
    this.output = this.multiply;
  }

  trigger() {
    this.node.triggerAttackRelease(this.attack, this.decay);
  }

  set modulation(value) {
    this.modulation = value;
    this.vca.value = value;
  }
}

class AmpMod {
  constructor(modulation, attack, decay) {
    // Variable Params
    this.modulation = modulation || 0;
    this.attack = attack || 0;
    this.decay = decay || 0;

    // Statc Params
    this.attackDecayScale = 900;

    // Tone modules
    this.envelope = new Tone.Envelope;
    this.vca = new Tone.Volume;

    // Connect modules
    this.envelope.chain(this.vca, this.multiply);
    this.output = this.vca;
  }

  trigger() {
    this.node.triggerAttackRelease(this.attack, this.decay);
  }

  set modulation(value) {
    this.modulation = value;
    this.vca.value = value;
  }
}
