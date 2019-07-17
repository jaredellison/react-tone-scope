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

const dbScale = n => {
  return Math.log10(n) * 20;
};

let masterVolume = new Tone.Volume();
masterVolume.toMaster();

////////////////////////////////////////////////////////////
//
//    Class Definitions


class FreqMod {
  constructor(modulation, attack, decay) {
    // Static Params
    this.attackDecayScale = 900;
    this.modulationScale = 3000;

    // Tone modules
    this.envelope = new Tone.Envelope();
    this.vca = new Tone.Volume();
    this.multiply = new Tone.Multiply(this.modulationScale);

    // Connect modules
    this.envelope.chain(this.vca, this.multiply);
    this.output = this.multiply;

    // Variable Params
    this.modulation = modulation || 0;
    this.attack = attack || 0;
    this.decay = decay || 0;
  }

  trigger() {
    this.envelope.triggerAttackRelease(0.6);
  }

  set modulation(value) {
    this._modulation = value;
    this.vca.value = value;
  }

  get modulation() {
    return this._modulation || 0;
  }
}

class AmpMod {
  constructor(modulation, attack, decay) {
    // Static Params
    this.attackDecayScale = 900;

    // Tone modules
    this.envelope = new Tone.Envelope();
    this.vca = new Tone.Volume();

    // Connect modules
    this.envelope.chain(this.vca);

    this.output = this.vca;

    // Variable Params
    this.modulation = modulation || 0;
    this.attack = attack || 0;
    this.decay = decay || 0;
  }

  trigger() {
    this.envelope.triggerAttackRelease(0.6);
  }

  set modulation(value) {
    this._modulation = value;
    this.vca.value = value;
  }

  get modulation() {
    return this._modulation || 0;
  }
}

class BirdVoice {
  constructor(attack, decay) {
    // Params
    this.attack = attack;
    this.decay = decay;

    // Static Params
    this.attackDecayScale = 900;

    /////////////////////
    //  Tone modules
    // Frequency Modulation
    this.freqModLfo = new Tone.Oscillator();
    this.freqModVca1 = new Tone.Volume();
    this.freqModOffset = new Tone.Add(1);
    this.freqModVca2 = new Tone.Volume();

    // Amplitude Modulation
    this.ampModLfo = new Tone.Oscillator();
    this.ampModVca1 = new Tone.Volume();
    this.ampModVca2 = new Tone.Volume();
    this.ampModOffset = new Tone.Add(-1);

    // Main Voice
    this.osc = new Tone.Oscillator(440, "sine");
    this.env = new Tone.Envelope();
    this.vca = new Tone.Volume();

    // Expose Inputs
    this.freqModInitIn = this.freqModVca2.volume;
    this.freqModAmpIn = this.freqModVca1.volume;
    this.freqModFreqIn = this.freqModLfo.frequency;

    this.ampModAmpIn = this.ampModVca1.volume;
    this.ampModFreqIn = this.ampModLfo.frequency;

    // Connect modules
    this.freqModLfo.chain(
      this.freqModVca1,
      this.freqModOffset,
      this.freqModVca2,
      this.osc.frequency,
    );

    this.ampModLfo.chain(
      this.ampModVca1,
      this.ampModOffset,
      this.ampModVca2,
      this.osc.frequency,
    );

    this.osc.chain(
      this.ampModVca2,
      this.vca
    );

    this.env.connect(this.vca.volume);

    this.output = this.vca;

    // Start oscillators
    this.osc.start();
    this.freqModLfo.start();
    this.ampModLfo.start();
  }

  set ifrq(value){
    this._ifrq = value;
    this.ampModVca2.volume.value = dbScale((value * 7000) + 300);
    // this.ampModVca2.volume.value = (value * 7000) + 300;
  }

  get ifrq(){
    return this._ifrq;
  }

  trigger() {
    console.log('chirp');
    this.env.triggerAttackRelease(0.6);
  }
}

class Bird {
  constructor() {
    this.voice = new BirdVoice(1,2);
    this.freq1 = new FreqMod();
    this.freq2 = new FreqMod();
    this.amp2 = new AmpMod();
    this.amp1 = new AmpMod();


    this.freq1.output.connect(this.voice.freqModFreqIn);
    this.amp1.output.connect(this.voice.freqModAmpIn);
    this.freq2.output.connect(this.voice.ampModFreqIn);
    this.amp2.output.connect(this.voice.ampModAmpIn);

    this.pad = new Tone.Volume(-60);
    this.voice.output.chain(this.pad, masterVolume);
  }

  trigger() {
    this.voice.trigger();
    this.freq1.trigger();
    this.freq2.trigger();
    this.amp2.trigger();
    this.amp1.trigger();
  }

  set ifrq(value) {
    this.voice.ifrq = value;
  }

  get ifrq() {
    return this.voice.ifrq;
  }
}

////////////////////////////////////////
//  Main Action

document.body.innerHTML += `
<input type="range" id="volume" min="0" max="1" step=".01" value="0">
<label for="volume">volume</label>

<h2>Controls</h2>
<h3>F</h3>
<input type="range" id="ifrq" name="ifrq" min="0" max="1" step=".01" value="0">
<label for="ifrq">ifrq</label>

<h3>amp</h3>
<input type="range" id="amp-atk" min="0" max="1" step=".01" value="0">
<label for="amp-atk">amp-atk</label>
<input type="range" id="amp-dcy" min="0" max="1" step=".01" value="0">
<label for="amp-dcy">amp-dcy</label>

<h3>f-modulation</h3>
<input type="range" id="fmod1" min="0" max="1" step=".01" value="0">
<label for="fmod1">fmod1</label>
<input type="range" id="atkf1" min="0" max="1" step=".01" value="0">
<label for="atkf1">atkf1</label>
<input type="range" id="dcyf1" min="0" max="1" step=".01" value="0">
<label for="dcyf1">dcyf1</label>
<input type="range" id="fmod2" min="0" max="1" step=".01" value="0">
<label for="fmod2">fmod2</label>
<input type="range" id="atkf2" min="0" max="1" step=".01" value="0">
<label for="atkf2">atkf2</label>
<input type="range" id="dcyf2" min="0" max="1" step=".01" value="0">
<label for="dcyf2">dcyf2</label>

<h3>a-modulation</h3>
<input type="range" id="amod1" min="0" max="1" step=".01" value="0">
<label for="amod1">amod1</label>
<input type="range" id="atka1" min="0" max="1" step=".01" value="0">
<label for="atka1">atka1</label>
<input type="range" id="dcya1" min="0" max="1" step=".01" value="0">
<label for="dcya1">dcya1</label>
<input type="range" id="amod2" min="0" max="1" step=".01" value="0">
<label for="amod2">amod2</label>
<input type="range" id="atka2" min="0" max="1" step=".01" value="0">
<label for="atka2">atka2</label>
<input type="range" id="dcya2" min="0" max="1" step=".01" value="0">
<label for="dcya2">dcya2</label>
`;

const startChirping = () => {
  window.bird = new Bird();
  setInterval(() => {window.bird.trigger()}, 1000);
}

let started = false;

let volumeSlider = document.querySelector("#volume");
volumeSlider.addEventListener('input', e => {
  if (!started) {
    started = true;
    Tone.context.resume();
    startChirping();
  }
  masterVolume.volume.value = dbScale(e.target.value);
});


document.querySelector("#ifrq").addEventListener('input', e => {
  const val = e.target.value;
  console.log('ifrq val:', val);
  window.bird.ifrq = val;
});


document.querySelector("#amp-atk").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#amp-dcy").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#fmod1").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#atkf1").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#dcyf1").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#fmod2").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#atkf2").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#dcyf2").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#amod1").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#atka1").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#dcya1").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#amod2").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#atka2").addEventListener('input', e => {
  const val = e.target.value;

});


document.querySelector("#dcya2").addEventListener('input', e => {
  const val = e.target.value;

});

