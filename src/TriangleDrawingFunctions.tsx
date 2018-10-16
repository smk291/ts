import { canvasParams } from './Constants';
import { Coordinates, LabeledSides } from './Types';

function sq(num: number) { return Math.pow(num, 2); }

// The longest side of the triangle will always be 300px long
// Multiplying that side by 'scalingFactor' will set its length to 300px.
// and proportionally resize the other sides.
// 'scaleAndLabelSideLengths' does that computation and puts each scaled length in an object
export const scaleAndLabelSideLengths = (sidesFromRefs: number[], scalingFactor: number) => {

  // Return is an object.
  // The keys of the return are the labels/placeholders of their coresponding inputs ('a', 'b', 'c')
  // The value are the values of the input multiplied by the scalingFactor

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

  return {
    a: sidesFromRefs[0] * scalingFactor, // Left side
    b: sidesFromRefs[1] * scalingFactor, // Right side
    c: sidesFromRefs[2] * scalingFactor, // Bottom side
  } as LabeledSides;
};


// 'getCanvasCoordinates' calculates vertex coordinates on the assumption that vertex B is at (0, 0) on the Cartesian graph.
// Return type is Coordinates
export const getCanvasCoordinates = (horizontalOffset: number, verticalOffset: number, sides: LabeledSides): Coordinates => {
  const point0: [number, number] = [horizontalOffset, verticalOffset];

  // Draw a horizontal line the length of side c
  const point1: [number, number] = [horizontalOffset + sides.c, verticalOffset];

  // The next two values represent the triangle's third point
  // I used the top answer here: https://math.stackexchange.com questions/1583375/how-to-plot-a-triangle-given-three-side-lengths
  const x = (sq(sides.a) - sq(sides.b) - sq(sides.c)) / (-2 * sides.c);
  const y = Math.sqrt(sq(sides.b) - sq(x));

  // Convert the coordinates to canvas coordinates
  const xAdjusted = (horizontalOffset + sides.c) - x;
  const yAdjusted = verticalOffset - y;

  const point2: [number, number] = [xAdjusted, yAdjusted];

  return {
    point0,
    point1,
    point2
  };
};

// 'adjustCoordinates' alters the triangle's coordinates if necessary so that
// its vertices' x coordinate are all >= 0
// Return type is Coordinates
export const adjustCoordinates = (unadjustedCanvasCoords: Coordinates, xMin: number): Coordinates => {
  const { point0, point1, point2 } = unadjustedCanvasCoords;
  const { offset } = canvasParams;

  return {
    point0: [ point0[0] - xMin + offset, point0[1]],
    point1: [ point1[0] - xMin + offset, point1[1]],
    point2: [ point2[0] - xMin + offset, point2[1]],
  };
};

// Returns an array of objects {label: string, coords: [number, number]}[]:
//    value of 'label' is the x coordinate and y coordinate of the vertex on the Cartesian graph
//    value of 'coords' is the x coordinate and y coordinate on the canvas element  where the label is to be drawn
export const createLabels = (
  horizontalOffset: number,
  verticalOffset: number,
  scalingFactor: number,
  xMin: number,
  uncorrected: Coordinates
): Array<{label: string, coords: [number, number]}> => {
  const labelCoordinatesClosure = (point: [number, number], labelNumber: number) =>
    createCoordinatesLabel(
      point,
      horizontalOffset,
      verticalOffset,
      scalingFactor,
      labelNumber,
      xMin
    );

  // Label x and y coordinates
  return [
    labelCoordinatesClosure(uncorrected.point0, 0),
    labelCoordinatesClosure(uncorrected.point1, 1),
    labelCoordinatesClosure(uncorrected.point2, 2),
  ];
};

// Move each label relative to the vertex it's labeling
// Imperfect. Could be better.
export const getExtraOffset = (labelNumber: number, xMin: number) => {
  if (labelNumber === 0)
    return [20, -5];
  if (labelNumber === 1)
    return [0, -5];
  if (labelNumber === 2) {
    if (xMin < 10) {
      return [50, 0];
    }
    return [0, 0];
  }

  return [0, 0];
};

// Returns object:
//    value of 'label' is the x coordinate and y coordinate of the vertex on the Cartesian graph
//    value of 'coords' is the x coordinate and y coordinate on the canvas element  where the label is to be drawn
export const createCoordinatesLabel = (
  points: [number, number],
  _hOffset: number,
  vOffset: number,
  scalingFactor: number,
  labelNumber: number,
  xMin: number
): {label: string, coords: [number, number]} => {
  const extraOffset = getExtraOffset(labelNumber, xMin);
  const xCoord = formatCoord(Math.abs(points[0] - xMin) / scalingFactor);
  const yCoord = formatCoord(Math.abs(points[1] - vOffset) / scalingFactor);

  return {
    label: '(' + xCoord + ', ' + yCoord + ')',  // e.g. (1.5, 5)
    coords: [                                   // e.g. [1.5, 5]
      points[0]  + extraOffset[0],
      points[1]  + extraOffset[1]
    ],
  };
};

// Show coordinate as whole number
// if its remainder % 1 is less than
// .01, else print it to two decimal
// places
const formatCoord = (n: number) => {
  if (n % 1 >= .01)
    return n.toFixed(2);

  return Math.round(n);
};

