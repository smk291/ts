import App from './App';
import { canvasParams } from './Constants';
import { drawGrid } from './drawGrid';

type Sides = number[];
type Coordinates = {
  point0: [number, number];
  point1: [number, number];
  point2: [number, number];
};

export function isValidTriangle(this: App) {
  const sideLengths =
    this.inputs.current &&
    Array.from(this.inputs.current.getElementsByTagName('input'))
      .map(v => Number(v.value));

  // console.log(sideLengths);

  // If sideLengths is falsey, there are no inputs.
  if (!sideLengths) {
    setError('Sorry, inputs seem to be missing.');

    return false;
  }

  // console.log(allSidesHaveLengths(sideLengths))

  // All inputs have values that are parseable as valid numbers
  if (!allSidesHaveLengths(sideLengths)) {
    setError('Please enter lengths for all three sides.');

    return false;
  }

  // console.log(sidesAreValidTriangle(sideLengths));

  // The inputs don't add up to a valid triangle
  if (!sidesAreValidTriangle(sideLengths)) {
    setError("Sorry, these values don't form a valid 2d triangle. The longest side can be no shorter than the difference between the other two sides and no greater than their sum.");

    return false;
  }

  return true;
}

const setError = (message: string) => {
  const errorContainer = document.getElementsByClassName('error-message')[0];

  if (errorContainer) {
    errorContainer.innerHTML = message;
  }
};

// 'getSideLenths' parses the three input values as numbers
export function getSideLengths(this: App): number[] | null {
  const sideLengths =
    this.inputs.current &&
    Array
      .from(this.inputs.current.getElementsByTagName('input'))
      .filter(v => v.type === 'text')
      .map(v => Number(v.value));

  // console.log('sideLengths: ');
  // console.log(sideLengths);

  return sideLengths;
}

// 'drawTriangle' renders the triangle if the input values can form a valid 2d triangle
export function drawTriangle(this: App, sidesFromRefs: Sides | null) {
  if (sidesFromRefs === null || sidesFromRefs === undefined) {
    setError('Something went wrong!');
  } else {
    const canvas = this.canvas.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const { offset, h } = canvasParams;
    const horizontalOffset = offset;
    const verticalOffset = h - offset;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Start drawing coordinate grid
    drawGrid.call(this);
    // Finish drawing coordinate grid

    if (!sidesFromRefs) return;

    // The longest side of the triangle will always be 300px long
    // Other sides scale accordingly
    const scalingFactor = 300 / Math.max(...sidesFromRefs);

    // Converting array of side lengths to object for clarity
    // const sides: LabeledSides = {
    //   c: sidesFromRefs[0] * scalingFactor, // Bottom side
    //   a: sidesFromRefs[1] * scalingFactor, // Right side
    //   b: sidesFromRefs[2] * scalingFactor, // Left side
    // };

    if (!sidesFromRefs) return;

    const sides = scaleAndLabelSideLengths(sidesFromRefs, scalingFactor);

    //         /\
    //        /  \
    //       / C  \
    //      /      \
    //  b  /        \  a
    //    /          \
    //   / A       B  \
    //  /______________\

    //         c

    // 'point0', 'point1' and 'point2' are the result of two computations:
    //   1) Converting side lengths into x and y coordinates,
    //      starting from vertex A, treating it as though it were at (0, 0).
    //   2) Compensating for Canvas' different x- and y-axis numbering.
    //      Where x appears to be 0 on the visible graph, the true x-coordinate is the value of 'offset'
    //      Where y appears to be 0 on the visible graph, the true y-coordinate is `h - offset` (canvas height - offset)
    //
    //               |‾‾‾ Distance from d to e this is where to the viewer x equals 0.
    //               |    The rightmost x-coordinate, where x appears to equal zero
    //               |    equals the value of `canvasparams.offset`.
    //               |
    //            |‾‾‾‾‾\
    //          (0,0)                                                (canvasParams.w, canvasParams.h)
    //      |‾           |                                              ‾‾‾‾‾|
    //      |            |                                                   |
    //    __|            |                                                   |
    //   |  |            |                                                   |
    //   |  |_     ______|_____________________________________________       >  height of canvas element, `canvasParams.h`
    //   |               |                                                   |
    //   |               |                                                   |
    //   |               |                                               ____|
    //   |
    //   |       (0, canvasParams.h)                                  (canvasParams.w, canvasparams.h)
    //   |
    //   |
    //   |
    //   |
    //   Distance from start of canvas (true y-coordinate is 0)
    //   to where x-axis is drawn; this is where to the viewer y equals 0.
    //   The bottom-most y-coordinate, where y appears to be zero
    //   equals the value of `canvasParams.h - canvasParams.offset

    // There will be two more computations before the app will be able to plot the triangle.

    // The first set of coordinates will always be the canvas equivalent of (0, 0)
    // These two coordinates represent where, to the viewer, the x- and y-axis meet
    // const point0: [number, number] = [horizontalOffset, verticalOffset];

    // // Draw a horizontal line the length of side c
    // const point1: [number, number] = [horizontalOffset + sides.c, verticalOffset];

    // // The next two values represent the triangle's third point
    // // I used the top answer here: https://math.stackexchange.com questions/1583375/how-to-plot-a-triangle-given-three-side-lengths
    // const x = (sq(sides.a) - sq(sides.b) - sq(sides.c)) / (-2 * sides.c);
    // const y = Math.sqrt(sq(sides.b) - sq(x));

    // // Convert the coordinates to canvas coordinates
    // const xAdjusted = (horizontalOffset + sides.c) - x;
    // const yAdjusted = verticalOffset - y;

    // const point2: [number, number] = [xAdjusted, yAdjusted];

    const uncorrectedCanvasCoords = getCanvasCoordinates(horizontalOffset, verticalOffset, sides);
    const { point0, point1, point2 } = uncorrectedCanvasCoords;

    // If angle A is obtuse, the third coordinate's x value will be negative.
    // xMin is a second offset: if it's negative, subtract it from each x coordinate,
    // so that the lowest x value is 0.
    const xMin = Math.min(...[point0, point1, point2].map(v => v[0]));
    const corrected = adjustCoordinates(uncorrectedCanvasCoords, xMin);

    // Start drawing triangle
    ctx.beginPath();
    ctx.moveTo(corrected.point0[0], corrected.point0[1]);
    ctx.lineTo(corrected.point1[0], corrected.point1[1]);
    ctx.lineTo(corrected.point2[0], corrected.point2[1]);
    ctx.lineTo(corrected.point0[0], corrected.point0[1]);
    ctx.fillStyle = '#aaa';
    ctx.fill();
    // Finish drawing triangle


    const labels = createLabels(horizontalOffset, verticalOffset, scalingFactor, xMin, uncorrectedCanvasCoords);

    // Label x and y coordinates
    ctx.font = '14px Times bold';
    ctx.fillStyle = '#f00';
    ctx.fillText(labels[0].label, ...labels[0].coords);
    ctx.fillText(labels[1].label, ...labels[1].coords);
    ctx.fillText(labels[2].label, ...labels[2].coords);
  }
}

const scaleAndLabelSideLengths = (sidesFromRefs: number[], scalingFactor: number) => {
  // The longest side of the triangle will always be 300px long
  // Other sides scale accordingly

  // Converting array of side lengths to object for clarity
  return {
    a: sidesFromRefs[0] * scalingFactor, // Bottom side
    b: sidesFromRefs[1] * scalingFactor, // Right side
    c: sidesFromRefs[2] * scalingFactor, // Left side
  } as LabeledSides;
};

const getCanvasCoordinates = (horizontalOffset: number, verticalOffset: number, sides: LabeledSides): Coordinates => {
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

const adjustCoordinates = (unadjustedCanvasCoords: Coordinates, xMin: number): Coordinates => {
  const { point0, point1, point2 } = unadjustedCanvasCoords;
  const { offset } = canvasParams;

  return {
    point0: [ point0[0] - xMin + offset, point0[1]],
    point1: [ point1[0] - xMin + offset, point1[1]],
    point2: [ point2[0] - xMin + offset, point2[1]],
  };
};

const createLabels = (
  horizontalOffset: number,
  verticalOffset: number,
  scalingFactor: number,
  xMin: number,
  uncorrected: Coordinates
) => {
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

// Used to adjust location of coordinate labels.
const getExtraOffset = (labelNumber: number, xMin: number) => {
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

function createCoordinatesLabel(points: [number, number], _hOffset: number, vOffset: number, scalingFactor: number, labelNumber: number, xMin: number): {label: string, coords: [number, number]} {
  const extraOffset = getExtraOffset(labelNumber, xMin);

  const xCoord = formatCoord(Math.abs(points[0] - xMin) / scalingFactor);
  const yCoord = formatCoord(Math.abs(points[1] - vOffset) / scalingFactor);

  return {
    label: '(' + xCoord + ', ' + yCoord + ')',
    coords: [
      points[0]  + extraOffset[0],
      points[1]  + extraOffset[1]
    ],
  };
}

function formatCoord(n: number) {
  if (Math.round(n) === n)
    return n;

  return n.toFixed(2);
}

type LabeledSides = {
  a: number,
  b: number,
  c: number,
};

function sidesAreValidTriangle(sides: Sides) {
  const sidesFromRefs = sides.sort();
  const thirdSideMinLength = sidesFromRefs[1] - sidesFromRefs[0];
  const thirdSideMaxLength = sidesFromRefs[0] + sidesFromRefs[1];

  return(
    sides.every(v => v >= 0) &&
    sidesFromRefs[2] >= thirdSideMinLength &&
    sidesFromRefs[2] <= thirdSideMaxLength
  );
}

function allSidesHaveLengths(sides: Sides) {
  return sides.every(v => !isNaN(v));
}

// function doResizeSides (sides: Sides) {
//   return sides[0] > 700 || sides[1] > 300 || sides[2] > 300;
// }

// function resizeSides (sides: Sides) {
//   const sortedSides = sides.sort();
//   const longestSide = Math.max.apply(null, sortedSides);

//   console.log(longestSide);

//   if (1 === sides.indexOf(longestSide) || 2 === sides.indexOf(longestSide)) {
//     return sides.map(v => v * (300 / longestSide));
//   } else {
//     return sides.map(v => v * (600 / longestSide));
//   }
// };

// function getProportions (this: App) {
  // const sides =
  // this.sides.current &&
  // Array.from(this.sides.current.getElementsByTagName('input'))
  //   .map(v => Number(v.value));

  // if (!sides) return;

  // const longestSide = Math.max.apply(null, sides);

  // console.log('longestSide');
  // console.log(longestSide);
  // if (1 === sides.indexOf(longestSide) || 2 === sides.indexOf(longestSide)) {
  //   console.log('300 / longestSide');
  //   console.log(300 / longestSide);
  //   return 300 / longestSide;
  // } else {
  //   console.log('600 / longestSide');
  //   console.log(600 / longestSide);
  //   return 600 / longestSide;
  // }
// }

function sq(num: number) { return Math.pow(num, 2); }



        //         /\
        //        /  \
        //       / C  \
        //      /      \
        //  b  /        \  a
        //    /          \
        //   / A       B  \
        //  /______________\

        //         c

// const computeAngles = {
//   B: function betweenAandC (sides: LabeledSides) {
//       const { a, b, c } = sides;

//       return lawOfCosines(a, c, b);
//     },
//   C: function betweenBandA (sides: LabeledSides) {
//     const { a, b, c } = sides;

//     return lawOfCosines(a, b, c);
//   },
//   A: function betweenBandC (sides: LabeledSides) {
//     const { a, b, c } = sides;

//     return lawOfCosines(b, c, a);
//   },
// };

// function lawOfCosines (adjacent: number, adjacent2: number, opposite: number) {
//   return (sq(adjacent) + sq(adjacent2) - sq(opposite))
//   / (2 * adjacent * adjacent2);
// }
