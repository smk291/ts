
// 'w' and 'h' determine the dimensions of the canvas element
// 'step' is the side length, in pixels, of the sqaures that comprise the graph's grid
// 'offset' is where, to the viewer, x === 0 and y === 0
// Canvas's x and y and the x and y of the visible graph are not the same
// For canvasm x === 0 and y === 0 in the upper left corner
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


export const inputNumberToLetter = ['a', 'b', 'c'];
