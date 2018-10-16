import * as React from 'react';
import './App.css';
import { drawGrid, DrawGridFn } from './drawGrid';
import { isValidTriangle, getSideLengths, drawTriangle } from './renderShape';
import { canvasParams, inputNumberToLetter } from './Constants';

declare const ts: any;

export default class App extends React.Component<{}, {}> {
  // this.canvas is a React ref bound to a canvas element.
  // This is where the app draws a triangle proportional to the user's inputs
  canvas: React.RefObject<HTMLCanvasElement>;
  // 'this.inputs' is a React ref includes the three text inputs where uses can enter the side lengths
  // It also includes the 'evaluate' button
  inputs: React.RefObject<HTMLDivElement>;
  // 'drawGrid' draws the grid/graph
  drawGrid: DrawGridFn;
  renderShape: (this: App) => void;
  // 'isValidTriangle' tests whether the three values form a valid triangle
  // If the inputs fail this test, the app will not try to draw a triangle
  isValidTriangle: (this: App) => boolean;
  // 'getSideLenths' parses the three input values as numbers
  getSideLengths: (this: App) => null | number [];
  // 'drawTriangle' renders the triangle if the input values can form a valid 2d triangle
  drawTriangle: (this: App) => void;

  constructor(props: {}) {
    super(props);

    this.canvas = React.createRef();
    this.inputs = React.createRef();
    this.isValidTriangle = isValidTriangle.bind(this);
    this.drawTriangle = drawTriangle.bind(this);
    this.getSideLengths = getSideLengths.bind(this);
    this.drawGrid = drawGrid.bind(this);
  }

  componentDidMount() {
    ts.ui.get('#mytabbar', (tabbar: any) => {
      tabbar.tabs([
        {label: 'One'},
        {label: 'Two'},
        {label: 'Three'}
      ]);
    });

    const canvas = this.canvas.current;


    // Set canvas height and width
    if (canvas) {
      canvas.width  = canvasParams.w;
      canvas.height = canvasParams.h;
    }

    this.drawGrid();
  }

  testAndDraw = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    // If 'isValidTriangle' returns false, values do not comprise a valid, flat, 2d triangle
    if (!this.isValidTriangle.call(this))
      return;

    this.drawTriangle.call(this, this.getSideLengths());
  }

  render() {
    const sideInputs = [0, 1, 2].map(v => input.call(this, v));

    return (
      <main data-ts="Main">
        <header id="mytabbar" data-ts="TabBar"></header>
        <canvas ref={this.canvas} className='canvas' />
        <div ref={this.inputs}>
          <div className='flexSideInput'>
            {sideInputs}
          </div>
          <button data-ts="Button" className="ts-primary" onClick={this.testAndDraw}>
            <span>
              Evaluate
            </span>
          </button>
          <div className="error-message" />
        </div>
      </main>
    );
  }
}

function input(this: App, inputNumber: 0 | 1 | 2) {
  return(
    <form data-ts="Form" onSubmit={this.testAndDraw}>
      <fieldset>
        <label>
          <span>
            <span style={{textTransform: 'capitalize', }}>
              Side
            </span>
            &nbsp;
            <span style={{textTransform: 'lowercase', }}>
              {inputNumberToLetter[inputNumber]}
            </span>
          </span>
          <input placeholder={inputNumberToLetter[inputNumber]} type="text" required />
      </label>
      </fieldset>
    </form>
  );
}

