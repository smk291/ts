import App from './App';
import { canvasParams } from './App';
import { drawGrid } from './drawGrid';

type Sides = number[];

export function isValidTriangle (this: App) {
  const sideLengths =
    this.sides.current &&
    Array.from(this.sides.current.getElementsByTagName('input'))
      .map(v => Number(v.value));

  // console.log(sideLengths);

  if (!sideLengths) {
    setError('Sorry, inputs seem to be missing.');

    return false;
  }
  
  // console.log(allSidesHaveLengths(sideLengths))

  if (!allSidesHaveLengths(sideLengths)) {
    setError('Please enter lengths for all three sides.');

    return false;
  }

  // console.log(sidesAreValidTriangle(sideLengths));
  
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
}

export function getSideLengths (this: App): number[] | null {
  const sideLengths =
    this.sides.current &&
    Array.from(this.sides.current.getElementsByTagName('input'))
      .filter(v => v.type === 'text')
      .map(v => Number(v.value));

  // console.log('sideLengths: ');
  // console.log(sideLengths);

  return sideLengths;
  // return sideLengths && resizeSides(sideLengths) || sideLengths;
}

export function drawTriangle (this: App, sidesFromRefs: Sides | null) {
  if (sidesFromRefs === null || sidesFromRefs === undefined) {
    setError('Something went wrong!');
  } else {
    const canvas = this.canvas.current;

    if (!canvas) return;
    
    const { offset, h } = canvasParams;
    
    const ctx = canvas.getContext('2d');

    if (!ctx) return;


    // Start drawing coordinate grid
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    drawGrid.call(this)
    // Finish drawing coordinate grid

    if (!sidesFromRefs) return;

    const scalingFactor = 300 / Math.max(...sidesFromRefs);
    
    const sides: LabeledSides = {
      c: sidesFromRefs[0] * scalingFactor,
      a: sidesFromRefs[1] * scalingFactor,
      b: sidesFromRefs[2] * scalingFactor,
    };

    const horizontalOffset = offset;
    const verticalOffset = h - offset;

    // const scaleBy = getProportions.call(this);
    const point0: [number, number] = [horizontalOffset, verticalOffset];
    const point1: [number, number] = [horizontalOffset + sides.c, verticalOffset];

    const x = (sq(sides.a) - sq(sides.b) - sq(sides.c)) / (-2 * sides.c);
    const y = Math.sqrt(sq(sides.b) - sq(x));

    const xAdjusted = (horizontalOffset + sides.c) - x;
    const yAdjusted = verticalOffset - y;

    const point2: [number, number] = [xAdjusted, yAdjusted];

    const xMin = Math.min(...[point0, point1, point2].map(v => v[0]));

    ctx.beginPath(); 
    ctx.moveTo(point0[0] - xMin + offset, point0[1]);
    ctx.lineTo(point1[0] - xMin + offset, point1[1]);
    ctx.lineTo(point2[0] - xMin + offset, point2[1]);
    ctx.lineTo(point0[0] - xMin + offset, point0[1]);
    ctx.fillStyle = '#aaa';
    ctx.fill();

    const createLabelClosure = (point: [number, number], labelNumber: number) => createCoordinatesLabel(point, horizontalOffset, verticalOffset, scalingFactor, labelNumber, xMin);

    ctx.font = '12px Verdana';
    ctx.fillStyle = '#f00';
    ctx.fillText(...createLabelClosure(point0, 0));
    ctx.fillText(...createLabelClosure(point1, 1));
    ctx.fillText(...createLabelClosure(point2, 2));
  }
}

const getExtraOffset = (labelNumber: number, xMin: number) => {
  if (labelNumber === 0)
    return [20, -5];
  if (labelNumber === 1)
    return [0, -5];
  if (labelNumber === 2) {
    if (xMin < 10) {
      return [50, 0]
    }
    return [0, 0];
  }

  return [0, 0];
}

function createCoordinatesLabel (points: [number, number], hOffset: number, vOffset: number, scalingFactor: number, labelNumber: number, xMin: number): [string, number, number] {
  const extraOffset = getExtraOffset(labelNumber, xMin)

  const xCoord = formatCoord(Math.abs((points[0] - hOffset) / scalingFactor));
  const yCoord = formatCoord(Math.abs((points[1] - vOffset) / scalingFactor));

  return[
    '(' + xCoord + ', ' + yCoord + ')',
    points[0]  + extraOffset[0],
    points[1]  + extraOffset[1]
  ];
}

function formatCoord (n: number) {
  if (Math.round(n) === n)
    return n;

  return n.toFixed(2);
}

type LabeledSides = {
  a: number,
  b: number,
  c: number,
};

function sidesAreValidTriangle (sides: Sides) {
  const sidesFromRefs = sides.sort();
  const thirdSideMinLength = sidesFromRefs[1] - sidesFromRefs[0];
  const thirdSideMaxLength = sidesFromRefs[0] + sidesFromRefs[1];

  return(
    sides.every(v => v >= 0) &&
    sidesFromRefs[2] >= thirdSideMinLength &&
    sidesFromRefs[2] <= thirdSideMaxLength
  );
}

function allSidesHaveLengths (sides: Sides) {
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

function sq (num: number) { return Math.pow(num, 2); }



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