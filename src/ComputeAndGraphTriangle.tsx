import App from './App';
import { canvasParams } from './Constants';
import { drawGrid } from './drawGrid';
import { scaleAndLabelSideLengths, getCanvasCoordinates, adjustCoordinates, createLabels, } from './TriangleDrawingFunctions';

// 'drawTriangle' does all the computations necessary in order to render the triangle
// and then it draws the triangle and labels it.
export function computeAndGraphTriangle(this: App, sidesFromRefs: number[] | null) {
  const canvas = this.canvas.current;

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  const { offset, h }    = canvasParams;
  const horizontalOffset = offset;
  const verticalOffset   = h - offset;

  // The goal is to plot the user's triangle in the NE quadrant of a Cartesian graph,
  // and to add labels to each vertex showing the x and y coordinates of that
  // vertex on the Cartesian graph.
  // The app does this on a canvas element.
  // Two problems:
  // 1) Canvas's coordinates aren't counted the way Cartesian coordinates are counted.
  //    Counting starts from upper left corner (0, 0). Moving to the right increases x,
  //    and moving down increases y.  On a Cartesian graph, moving down decreases y.
  // 2) Additionally, the Cartesian graph's coordinates are offset relative to the canvas
  //    element's coordinates.

  // On the graph below,
  // a's coordinates are (0, 0) on the canvas element, and (-horizontalOffset, -verticalOffset) on the Cartesian graph.
  // b's coordinates are (horizontalOffset, verticalOFfset) on the canvas element, and (0, 0) on the Cartesian graph.
  //
  //           a
  //            *      |
  //                   |
  //                   |
  //                   | b
  //             ------*--------------------
  //                   |
  //                   |
  //                   |

  // 'horizontalOffset' and 'verticalOffset' are the offsets usesd to convert between canvas coordinates and
  // Cartesian coordinates

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Redraw the grid
  drawGrid.call(this);

  // Unavoidable null-check
  if (!sidesFromRefs) return;

  // The longest side of the triangle will always be 300px
  // Multiplying its length by'scalingFactor' will produce the value 300.
  const scalingFactor = 300 / Math.max(...sidesFromRefs);
  const sides = scaleAndLabelSideLengths(sidesFromRefs, scalingFactor);

  // Sides is an object.
  // The keys are the labels of the three text inputs in the webapp ('a', 'b', 'c')
  // The values are the values of the corresponding inputs, parsed as numbers
  //
  //                 /\
  //                /  \
  //               / C  \
  //              /      \
  //    sides.a  /        \  sides.b
  //            /          \
  //           / B       A  \
  //          /______________\
  //
  //              sides.c
  //

  // 'getCanvasCoordinates' computes the triangle's coordinates on the canvas element.
  // It assumes that vertex B will be located at the center of the Cartesian graph (0, 0).
  const uncorrectedCanvasCoords = getCanvasCoordinates(horizontalOffset, verticalOffset, sides);
  // But if B is obtuse, C's x coordinate will be negative.
  // The triangle is supposed to appear in the NE quadrant of the graph
  // and so no vertex may have an x coordinate lower than 0.
  // Thus find the the triangle's lowest x value.
  const { point0, point1, point2 } = uncorrectedCanvasCoords;
  const xMin = Math.min(...[point0, point1, point2].map(v => v[0]));
  // and subtract that value from each vertex.
  const corrected = adjustCoordinates(uncorrectedCanvasCoords, xMin);
  // Now the triangle's x and y coordinates are all >= 0.

  // Start drawing triangle
  ctx.beginPath();
  ctx.moveTo(corrected.point0[0], corrected.point0[1]); // vertex B in diagram above
  ctx.lineTo(corrected.point1[0], corrected.point1[1]); // vertex A
  ctx.lineTo(corrected.point2[0], corrected.point2[1]); // vertex C
  ctx.lineTo(corrected.point0[0], corrected.point0[1]); // vertex B
  ctx.fillStyle = '#aaa';
  ctx.fill();
  // Finish drawing triangle

  // 'createLabels' returns an object.
  // 'label' is a text label providing the x and y coordinates of the vertex on the Cartesian graph
  // 'coords' is an array of two numbers -- an x coordinate and a y coordinate
  const labels = createLabels(horizontalOffset, verticalOffset, scalingFactor, xMin, uncorrectedCanvasCoords);

  // Draw labels
  ctx.font = '14px Times bold';
  ctx.fillStyle = '#f00';
  ctx.fillText(labels[0].label, ...labels[0].coords);
  ctx.fillText(labels[1].label, ...labels[1].coords);
  ctx.fillText(labels[2].label, ...labels[2].coords);
}
