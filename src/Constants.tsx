// 'w' and 'h' determine the dimensions of the canvas element
// 'step' is the side length, in pixels, of the sqaures that comprise the graph's grid
// 'offset' is the canvas x coordinate that corresponds to 0 on the Cartesian graph.
// 'h - offset' is the canvas y coordinate that corresponds to 0 on the Cartesian graph
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
