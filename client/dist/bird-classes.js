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
    this.vca = new Tone.Multiply();
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
    this.envelope.triggerAttackRelease(0.1);
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
    this.envelope = new Tone.Envelope({
      "attack" : 0.1,
      "decay" : 0.1,
      "sustain" : 0.1,
      "release" : 0.5,
    });
    this.vca = new Tone.Multiply();

    // Connect modules
    this.envelope.chain(this.vca);

    this.output = this.vca;
    // Variable Params
    this.modulation = modulation || 0;
    this.attack = attack || 0;
    this.decay = decay || 0;
  }

  trigger() {
    this.envelope.triggerAttackRelease(0.1);
  }

  set modulation(value) {
    this._modulation = value;
    this.vca.value = value;
  }

  get modulation() {
    return this._modulation || 0;
  }

  set attack(value) {
   this.envelope.attack = value / 1000;
  }

  get attack() {
   return this.envelope.attack;
  }

  set decay(value) {
    this.envelope.decay = value / 1000;
  }

  get decay() {
    return this.envelope.decay;
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
    // this.freqModLfo = new Tone.Oscillator(440, "sawtooth").toMaster().start();
    this.freqModLfo = new Tone.Oscillator(440, "sine").start();
    this.freqModVca1 = new Tone.Multiply();
    this.freqModOffset = new Tone.Add(1);
    this.freqModVca2 = new Tone.Multiply();

    // Amplitude Modulation
    // this.ampModLfo = new Tone.Oscillator(220, "sawtooth").toMaster().start();
    this.ampModLfo = new Tone.Oscillator(220, "sine").start();
    this.ampModVca1 = new Tone.Multiply();
    this.ampModVca2 = new Tone.Multiply(-1);
    this.ampModOffset = new Tone.Add(-1);

    // Main Voice
    // this.osc = new Tone.Oscillator(880, "sine").toMaster().start();
    this.osc = new Tone.Oscillator(880, "sine").start();
    this.env = new Tone.Envelope();
    this.vca = new Tone.Volume();

    // Expose Inputs
    this.freqModInitIn = this.freqModVca2;
    this.freqModAmpIn = this.freqModVca1;
    this.freqModFreqIn = this.freqModLfo.frequency;

    this.ampModAmpIn = this.ampModVca1;
    this.ampModFreqIn = this.ampModLfo.frequency;

    // Connect modules
    this.freqModLfo.connect(this.freqModVca1);
    this.freqModOffset.connect(this.freqModVca2);
    this.freqModVca2.connect(this.osc.frequency);

    this.ampModLfo.connect(this.ampModVca1);
    this.ampModVca1.connect(this.ampModOffset);
    this.ampModOffset.connect(this.ampModVca2);
    this.ampModVca2.connect(this.osc.frequency);

    this.osc.connect(this.ampModVca2);
    this.ampModVca2.connect(this.vca);

    this.env.connect(this.vca.volume);

    this.output = this.vca;
  }

  set ifrq(value){
    this._ifrq = value;
    this.freqModVca2.value = (value * 7000) + 300;
  }

  get ifrq(){
    return this._ifrq;
  }

  trigger() {
    console.log('chirp');
    this.env.triggerAttackRelease(0.1);
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

    this.pad = new Tone.Volume(-10);
    this.output = this.pad;
    this.voice.output.chain(this.pad, masterVolume);
  }

  trigger() {
    this.voice.trigger();
    this.freq1.trigger();
    this.freq2.trigger();
    this.amp2.trigger();
    this.amp1.trigger();
  }

  ////////////////////
  //  ifrq
  set ifrq(value) {
    this.voice.ifrq = value;
  }

  get ifrq() {
    return this.voice.ifrq;
  }

  ////////////////////
  //  amp-atk

  ////////////////////
  //  amp-dcy

  ////////////////////
  //  fmod1
  set fmod1(value) {
    this.freq1.modulation = value;
  }

  get fmod1() {
    return this.freq1.modulation;
  }

  ////////////////////
  //  atkf1
  set atkf1(value) {
    this.freq1.attack = value;
  }

  get atkf1() {
    return this.freq1.attack;
  }

  ////////////////////
  //  dcyf1
  set dcyf1(value) {
    this.freq1.decay = value;
  }

  get dcyf1() {
    return this.freq1.decay;
  }

  ////////////////////
  //  fmod2

  ////////////////////
  //  atkf2

  ////////////////////
  //  dcyf2

  ////////////////////
  //  amod1
  set amod1(value) {
    this.amp1.modulation = value;
  }

  get amod1() {
    return this.amp1.modulation;
  }

  ////////////////////
  //  atka1
  set atka1(value) {
    this.amp1.attack = value;
  }

  get atka1() {
    return this.amp1.decay;
  }

  ////////////////////
  //  dcya1
  set dcya1(value) {
    this.amp1.decay = value;
  }

  get dcya1() {
    return this.amp1.decay;
  }

  ////////////////////
  //  amod2

  ////////////////////
  //  atka2

  ////////////////////
  //  dcya2

}