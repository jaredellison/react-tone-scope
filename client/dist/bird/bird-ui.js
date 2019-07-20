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
<div>
  <input type="range" id="fmod1" min="0" max="1" step=".01" value="0">
  <label for="fmod1">fmod1</label>
  <input type="range" id="atkf1" min="0" max="1" step=".01" value="0">
  <label for="atkf1">atkf1</label>
  <input type="range" id="dcyf1" min="0" max="1" step=".01" value="0">
  <label for="dcyf1">dcyf1</label>
</div>
<div>
  <input type="range" id="fmod2" min="0" max="1" step=".01" value="0">
  <label for="fmod2">fmod2</label>
  <input type="range" id="atkf2" min="0" max="1" step=".01" value="0">
  <label for="atkf2">atkf2</label>
  <input type="range" id="dcyf2" min="0" max="1" step=".01" value="0">
  <label for="dcyf2">dcyf2</label>
</div>

<h3>a-modulation</h3>
<div>
  <input type="range" id="amod1" min="0" max="1" step=".01" value="0">
  <label for="amod1">amod1</label>
  <input type="range" id="atka1" min="0" max="1" step=".01" value="0">
  <label for="atka1">atka1</label>
  <input type="range" id="dcya1" min="0" max="1" step=".01" value="0">
  <label for="dcya1">dcya1</label>
</div>
<div>
  <input type="range" id="amod2" min="0" max="1" step=".01" value="0">
  <label for="amod2">amod2</label>
  <input type="range" id="atka2" min="0" max="1" step=".01" value="0">
  <label for="atka2">atka2</label>
  <input type="range" id="dcya2" min="0" max="1" step=".01" value="0">
  <label for="dcya2">dcya2</label>
</div>
`;

const sliders = [
  { id: '#ifrq', property: 'ifrq' },
  { id: '#amp-atk', property: 'ampAtk' },
  { id: '#amp-dcy', property: 'ampDcy' },
  { id: '#fmod1', property: 'fmod1' },
  { id: '#atkf1', property: 'atkf1' },
  { id: '#dcyf1', property: 'dcyf1' },
  { id: '#fmod2', property: 'fmod2' },
  { id: '#atkf2', property: 'atkf2' },
  { id: '#dcyf2', property: 'dcyf2' },
  { id: '#amod1', property: 'amod1' },
  { id: '#atka1', property: 'atka1' },
  { id: '#dcya1', property: 'dcya1' },
  { id: '#amod2', property: 'amod2' },
  { id: '#atka2', property: 'atka2' },
  { id: '#dcya2', property: 'dcya2' }
];

for (let slider of sliders) {
  document.querySelector(slider.id).addEventListener('input', e => {
    // console.log(`${slider.id} val:`, e.target.value);
    window.bird[slider.property] = parseFloat(e.target.value);
  });
}

////////////////////////////////////////
//  Oscilloscope

document.body.innerHtml =
  `<tone-oscilloscope></tone-oscilloscope>` + document.body.innerHtml;

document.querySelector('tone-oscilloscope').style.display = 'block';
document.querySelector('tone-oscilloscope').style.height = '200px';
document.querySelector('tone-oscilloscope').style.width = '200px';
document
  .querySelector('tone-oscilloscope')
  .shadowRoot.querySelector('canvas').width = 200;
document
  .querySelector('tone-oscilloscope')
  .shadowRoot.querySelector('canvas').height = 200;

// Connect oscilloscope for debugging
// document.querySelector('tone-oscilloscope').bind(bird.amp1.output);
// document.querySelector('tone-oscilloscope').bind(bird.voice.freqModLfo);
// document.querySelector('tone-oscilloscope').bind(bird.voice.freqModVca1);
// document.querySelector('tone-oscilloscope').bind(bird.voice.freqModOffset);
// document.querySelector('tone-oscilloscope').bind(bird.voice.freqModVca2);
document.querySelector('tone-oscilloscope').bind(bird.voice.vca);
