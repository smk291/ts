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
    setError("Sorry, these values don't form a valid 2d triangle.");

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid.call(this)

    const sortedSides = sidesFromRefs;

    if (!sortedSides) return;

    const scalingFactor = 300 / Math.max(...sortedSides);
    
    const sides: LabeledSides = {
      c: sortedSides[0] * scalingFactor,
      a: sortedSides[1] * scalingFactor,
      b: sortedSides[2] * scalingFactor,
    };

    // const scaleBy = getProportions.call(this);
    const point0: [number, number] = [offset, h - offset];
    const point1: [number, number] = [offset + sides.c, h - offset];

    const x = (sq(sides.a) - sq(sides.b) - sq(sides.c)) / (-2 * sides.c);
    const y = Math.sqrt(sq(sides.b) - sq(x));

    const xAdjusted = (offset + sides.c) - x;
    const yAdjusted = (h - offset) - y;

    const point2: [number, number] = [xAdjusted, yAdjusted];

    const xMin = Math.min(...[point0, point1, point2].map(v => v[0]))
    
    ctx.beginPath(); 
    ctx.moveTo(point0[0] - xMin + offset, point0[1]);
    ctx.lineTo(point1[0] - xMin + offset, point1[1]);
    ctx.lineTo(point2[0] - xMin + offset, point2[1]);
    ctx.lineTo(point0[0] - xMin + offset, point0[1]);
    ctx.fillStyle = '#aaa';
    ctx.fill();

    // console.log('xOriginal');
    // console.log(x);
    // console.log('yOriginal');
    // console.log(y);
    // console.log('x');
    // console.log(x);
    // console.log(offset + sides.c - x);
    // console.log('y');
    // console.log(yAdjusted);
    // console.log('point1: ');
    // console.log(point0);
    // console.log('point2');
    // console.log(point1);
    // console.log('point3: ')
    // console.log(point2)
  }
}

type LabeledSides = {
  a: number,
  b: number,
  c: number,
};

function sidesAreValidTriangle (sides: Sides) {
  const sortedSides = sides.sort();
  const thirdSideMinLength = sortedSides[1] - sortedSides[0];
  const thirdSideMaxLength = sortedSides[0] + sortedSides[1];

  return(
    sides.every(v => v >= 0) &&
    sortedSides[2] >= thirdSideMinLength &&
    sortedSides[2] <= thirdSideMaxLength
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