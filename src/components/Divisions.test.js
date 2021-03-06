import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import Divisions from './Divisions.jsx';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('Divisions Component', () => {
  test('Renders the correct number of vertical divisions', () => {
    const divsV = 10;
    const width = 10;
    const height = 10;

    act(() => {
      ReactDOM.render(<Divisions orientation={'vertical'} total={divsV} width={width} height={height} />, container);
    });

    const divisions = document.getElementsByTagName('line');
    expect(divisions.length).toBe(10);
  });

  test('Renders vertical divisions equally spaced apart', () => {
    const divsV = 10;
    const width = 10;
    const height = 10;

    act(() => {
      ReactDOM.render(<Divisions orientation={'vertical'} total={divsV} width={width} height={height} />, container);
    });

    const divisions = Array.from(document.getElementsByTagName('line'));
    const divisionXCoordinates = divisions.map((e) => [
      e.attributes.getNamedItem('x1').value,
      e.attributes.getNamedItem('x2').value,
    ]);

    expect(divisionXCoordinates).toEqual([
      ['0', '0'],
      ['1', '1'],
      ['2', '2'],
      ['3', '3'],
      ['4', '4'],
      ['5', '5'],
      ['6', '6'],
      ['7', '7'],
      ['8', '8'],
      ['9', '9'],
    ]);
  });

  test('Renders middle vertical division in darker color', () => {
    const divsV = 10;
    const width = 10;
    const height = 10;

    act(() => {
      ReactDOM.render(<Divisions orientation={'vertical'} total={divsV} width={width} height={height} />, container);
    });
    const divisions = document.getElementsByTagName('line');
    expect(divisions[4].attributes.getNamedItem('stroke').value).toBe('lightgrey');
    expect(divisions[5].attributes.getNamedItem('stroke').value).toBe('grey');
  });

  test('Renders the correct number of horizontal divisions', () => {
    const divsH = 10;
    const width = 10;
    const height = 10;

    act(() => {
      ReactDOM.render(<Divisions orientation={'horizontal'} total={divsH} width={width} height={height} />, container);
    });

    const divisions = document.getElementsByTagName('line');
    expect(divisions.length).toBe(10);
  });

  test('Renders horizontal divisions equally spaced apart', () => {
    const divsH = 10;
    const width = 10;
    const height = 10;

    act(() => {
      ReactDOM.render(<Divisions orientation={'horizontal'} total={divsH} width={width} height={height} />, container);
    });

    const divisions = Array.from(document.getElementsByTagName('line'));
    const divisionYCoordinates = divisions.map((e) => [
      e.attributes.getNamedItem('y1').value,
      e.attributes.getNamedItem('y2').value,
    ]);

    expect(divisionYCoordinates).toEqual([
      ['0', '0'],
      ['1', '1'],
      ['2', '2'],
      ['3', '3'],
      ['4', '4'],
      ['5', '5'],
      ['6', '6'],
      ['7', '7'],
      ['8', '8'],
      ['9', '9'],
    ]);
  });

  test('Renders middle horizontal division in darker color', () => {
    const divsH = 10;
    const width = 10;
    const height = 10;

    act(() => {
      ReactDOM.render(<Divisions orientation={'horizontal'} total={divsH} width={width} height={height} />, container);
    });
    const divisions = document.getElementsByTagName('line');
    expect(divisions[4].attributes.getNamedItem('stroke').value).toBe('lightgrey');
    expect(divisions[5].attributes.getNamedItem('stroke').value).toBe('grey');
  });
});
