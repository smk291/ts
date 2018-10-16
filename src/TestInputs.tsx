import App from './App';
import { Sides } from './Types';

export function isValidTriangle(this: App) {
  const sideLengths =
    this.inputs.current &&
    Array.from(this.inputs.current.getElementsByTagName('input'))
      .map(v => Number(v.value));

  // console.log(sideLengths);

  // If sideLengths is falsey, there are no inputs.
  if (!sideLengths) {
    setError.call(this, 'Sorry, inputs seem to be missing.');

    return false;
  }

  // console.log(allSidesHaveLengths(sideLengths))

  // All inputs have values that are parseable as valid numbers
  if (!allSidesHaveLengths(sideLengths)) {
    setError.call(this, 'Please enter lengths for all three sides.');

    return false;
  }

  if (sideLengths.some(v => [NaN, Infinity, -Infinity, 0].indexOf(v) !== -1) || sideLengths.some(v => v <= 0 )) {
    setError.call(this, 'Sides must be finite numbers larger than 0');

    return false;
  }

  // console.log(sidesAreValidTriangle(sideLengths));

  // The inputs don't add up to a valid triangle
  if (!sidesAreValidTriangle(sideLengths)) {
    setError.call(this, "These values don't form a valid, flat, 2d triangle. The longest side can be no shorter than the difference of the other two sides and no greater than their sum.");

    return false;
  }

  return true;
}

function setError(this: App, message: string) {
  const errorContainer = this.errorMessage.current;

  if (errorContainer) {
    errorContainer.innerHTML = message;
  }
}

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

function sidesAreValidTriangle(sides: Sides) {
  const sidesFromRefs = sides.sort().reverse();
  console.log(sidesFromRefs);
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


