////////////////////////////////////////
//  Main Action

document.body.innerHTML += `
<input type="range" id="volume" min="0" max="1" step=".01" e.target.valueue="0">
<label for="volume">volume</label>

<h2>Controls</h2>
<h3>F</h3>
<input type="range" id="ifrq" name="ifrq" min="0" max="1" step=".01" e.target.valueue="0">
<label for="ifrq">ifrq</label>

<h3>amp</h3>
<input type="range" id="amp-atk" min="0" max="1" step=".01" e.target.valueue="0">
<label for="amp-atk">amp-atk</label>
<input type="range" id="amp-dcy" min="0" max="1" step=".01" e.target.valueue="0">
<label for="amp-dcy">amp-dcy</label>

<h3>f-modulation</h3>
<input type="range" id="fmod1" min="0" max="1" step=".01" e.target.valueue="0">
<label for="fmod1">fmod1</label>
<input type="range" id="atkf1" min="0" max="1" step=".01" e.target.valueue="0">
<label for="atkf1">atkf1</label>
<input type="range" id="dcyf1" min="0" max="1" step=".01" e.target.valueue="0">
<label for="dcyf1">dcyf1</label>
<input type="range" id="fmod2" min="0" max="1" step=".01" e.target.valueue="0">
<label for="fmod2">fmod2</label>
<input type="range" id="atkf2" min="0" max="1" step=".01" e.target.valueue="0">
<label for="atkf2">atkf2</label>
<input type="range" id="dcyf2" min="0" max="1" step=".01" e.target.valueue="0">
<label for="dcyf2">dcyf2</label>

<h3>a-modulation</h3>
<input type="range" id="amod1" min="0" max="1" step=".01" e.target.valueue="0">
<label for="amod1">amod1</label>
<input type="range" id="atka1" min="0" max="1" step=".01" e.target.valueue="0">
<label for="atka1">atka1</label>
<input type="range" id="dcya1" min="0" max="1" step=".01" e.target.valueue="0">
<label for="dcya1">dcya1</label>
<input type="range" id="amod2" min="0" max="1" step=".01" e.target.valueue="0">
<label for="amod2">amod2</label>
<input type="range" id="atka2" min="0" max="1" step=".01" e.target.valueue="0">
<label for="atka2">atka2</label>
<input type="range" id="dcya2" min="0" max="1" step=".01" e.target.valueue="0">
<label for="dcya2">dcya2</label>
`;

document.querySelector('#ifrq').addEventListener('input', e => {
  window.bird.ifrq = e.target.value;
});

document.querySelector('#amp-atk').addEventListener('input', e => {
  window.bird.ampAtk = e.target.value;
});

document.querySelector('#amp-dcy').addEventListener('input', e => {
  window.bird.ampDcy = e.target.value;
});

document.querySelector('#fmod1').addEventListener('input', e => {
  window.bird.fmod1 = e.target.value;
});

document.querySelector('#atkf1').addEventListener('input', e => {
  window.bird.atkf1 = e.target.value;
});

document.querySelector('#dcyf1').addEventListener('input', e => {
  window.bird.dcyf1 = e.target.value;
});

document.querySelector('#fmod2').addEventListener('input', e => {

});

document.querySelector('#atkf2').addEventListener('input', e => {
});

document.querySelector('#dcyf2').addEventListener('input', e => {
});

document.querySelector('#amod1').addEventListener('input', e => {
  window.bird.amod1 = e.target.value;
});

document.querySelector('#atka1').addEventListener('input', e => {
  window.bird.atka1 = e.target.value;
});

document.querySelector('#dcya1').addEventListener('input', e => {
  window.bird.dcya1 = e.target.value;
});

document.querySelector('#amod2').addEventListener('input', e => {
});

document.querySelector('#atka2').addEventListener('input', e => {
});

document.querySelector('#dcya2').addEventListener('input', e => {
});

document.querySelector('tone-oscilloscope').style.display = 'block';
document.querySelector('tone-oscilloscope').style.height = '200px';
document.querySelector('tone-oscilloscope').style.width = '200px';
document
  .querySelector('tone-oscilloscope')
  .shadowRoot.querySelector('canvas').width = 200;
document
  .querySelector('tone-oscilloscope')
  .shadowRoot.querySelector('canvas').height = 200;
