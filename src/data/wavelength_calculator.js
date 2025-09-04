// Speed of sound at 20°C in m/s
const SPEED_OF_SOUND = 343;

export function calculateWavelength(frequency) {
  return SPEED_OF_SOUND / frequency;
}

export function calculateFrequency(wavelength) {
  return SPEED_OF_SOUND / wavelength;
}

export function getHarmonicSeries(baseFrequency, count) {
  return Array.from({length: count}, (_, i) => baseFrequency * (i + 1));
}
