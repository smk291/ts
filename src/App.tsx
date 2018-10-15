import * as React from 'react';
import './App.css';
import { drawGrid, DrawGridFn } from './drawGrid';
import { isValidTriangle, getSideLengths, drawTriangle } from './renderShape';
declare const ts: any;

export const canvasParams: CanvasParams = {
  step: 20,
  w: 800,
  h: 400,
  offset: 60,
};

export type CanvasParams = {
  step: number;
  w: number;
  h: number;
  offset: number;
};

export default class App extends React.Component<{}, {error: string}> {
  canvas: React.RefObject<HTMLCanvasElement>;
  sides: React.RefObject<HTMLDivElement>;
  drawGrid: DrawGridFn;
  renderShape: (this: App) => void;
  isValidTriangle: (this: App) => boolean;
  getSideLengths: (this: App) => null | number [];
  drawTriangle: (this: App) => void;
  constructor(props: {}) {
    super(props);

    this.state = {
      error: '',
    }

    this.canvas = React.createRef();
    this.sides = React.createRef();
    this.isValidTriangle = isValidTriangle.bind(this)
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
    
    const canvas = this.canvas.current
    
    if (canvas) {
      canvas.width  = canvasParams.w;
      canvas.height = canvasParams.h;
    }
    
    this.drawGrid(); 
  }
  
  testAndDraw = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    if (!this.isValidTriangle.call(this))
      return;

    this.drawTriangle.call(this, this.getSideLengths());
  }

  render() {
    return (
      <main data-ts="Main">
        <header id="mytabbar" data-ts="TabBar"></header>
        <canvas ref={this.canvas} className='canvas' />
        <div ref={this.sides}>
          <div className='flexSideInput'>
            {[0, 1, 2].map(v =>
              input.call(this, v))
            }
          </div>
          <button data-ts="Button" className="ts-primary" onClick={this.testAndDraw}>
            <span>Evaluate triangle</span>
          </button>
          <div className="error-message" />
        </div>
      </main>
    );
  }
}

function input (this: App, inputNumber: 0 | 1 | 2) {
  return(
    <form data-ts="Form" onSubmit={this.testAndDraw}>
      <fieldset>
        <label>
          <span>Side a</span>
          <input placeholder="a" type="text" required />
      </label>
      </fieldset>

    </form>
  );
}
