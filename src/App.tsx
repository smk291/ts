import * as React from 'react';
import './App.css';
import { drawGrid, DrawGridFn } from './drawGrid';
import { computeAndGraphTriangle } from './ComputeAndGraphTriangle';
import { isValidTriangle, getSideLengths } from './TestInputs';
import { canvasParams, inputNumberToLetter } from './Constants';

// Intended functionality:
// This app provides three text inputs, each representing the side of a triangle.
// User enters side lenghts.
// App computes whether they form a valid triangle.
// If they do, app plots triangle on a graph
// If they don't, app provides error message.
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
  computeAndDrawTriangle: (this: App) => void;

  // This ref is used to display error messages
  errorMessage: React.RefObject<HTMLDivElement>;
  // This ref is used to display the type of triangle
  triangleType: React.RefObject<HTMLDivElement>;

  constructor(props: {}) {
    super(props);

    this.canvas = React.createRef();
    this.errorMessage = React.createRef();
    this.triangleType = React.createRef();
    this.inputs = React.createRef();
    this.isValidTriangle = isValidTriangle.bind(this);
    this.computeAndDrawTriangle = computeAndGraphTriangle.bind(this);
    this.getSideLengths = getSideLengths.bind(this);
    this.drawGrid = drawGrid.bind(this);
  }

  componentDidMount() {
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

    const errorElement = this.errorMessage.current;
    const triangleTypeContainer = this.triangleType.current;

    // Clear error messages
    if (errorElement) {
      errorElement.innerHTML = '';
      errorElement.style.display = 'none';
    }

    // Clear success message
    if (triangleTypeContainer) {
      triangleTypeContainer.innerHTML = '';
      triangleTypeContainer.style.display = 'none';
    }

    // If 'isValidTriangle' returns false, values do not comprise a valid, flat, 2d triangle
    // Show error
    if (!this.isValidTriangle.call(this)) {
      if (errorElement)
        errorElement.style.display = 'block';

      return;
    }

    // compute & draw triangle
    this.computeAndDrawTriangle.call(this, this.getSideLengths());

    // classify triangle
    const triangleType = classifyTriangle(this.getSideLengths() as [number, number, number]);

    // Show success message
    if (triangleTypeContainer) {
      triangleTypeContainer.style.display = 'block';
      triangleTypeContainer.innerHTML = `Hey, that\'s a nice <span class="${triangleType}">${triangleType}</span> triangle!`;
    }
  }

  render() {
    const sideInputs = [0, 1, 2].map(v => sideLengthTextInput.call(this, v));

    return (
      <main data-ts="Main" className='main'>
        <h2>
          Triangle Classifier
        </h2>
        <div>
          Enter three positive, finite, non-zero numbers below.
        </div>
        <div>
          If they form a valid triangle, I'll plot the triangle on the grid below and tell you what kind of triangle it is (<span className='scalene'>scalene</span>, <span className='isosceles'>isosceles</span> or <span className='equilateral'>equilateral</span>).
        </div>
        <br />
        <br />
        <canvas ref={this.canvas} className='canvas' />
        <div ref={this.inputs}>
          <div className='flexSideInput'>
            {sideInputs}
            <button data-ts="Button" className="ts-primary submitButton" onClick={this.testAndDraw}>
              <div>Submit</div>
            </button>
          </div>
          <div ref={this.errorMessage} className='errorContainer'/>
          <div ref={this.triangleType} className='triangleType' />
        </div>
      </main>
    );
  }
}

function sideLengthTextInput(this: App, inputNumber: 0 | 1 | 2) {
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

const classifyTriangle = (sides: [number, number, number]) => {
  if (isEquilateral(sides))
    return 'equilateral';
  else if (isIsosceles(sides))
    return 'isosceles';
  else
    return 'scalene';

};

const isEquilateral = (sides: [number, number, number]) => {
  if (sides[0] === sides[1] && sides[1] === sides[2])
    return true;

  return false;
};


const isIsosceles = (sides: [number, number, number]) => {
  for (let i = 0; i < 3; i++) {
    if (sides.indexOf(sides[i]) !== sides.lastIndexOf(sides[i]))
      return true;
  }

  return false;
};

