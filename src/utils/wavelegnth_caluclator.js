// Speed of sound at 20°C in m/s
const SPEED_OF_SOUND = 343;

/**
 * Calculate wavelength from frequency
 * @param {number} frequency - Frequency in Hz
 * @returns {number} Wavelength in meters
 */
export function calculateWavelength(frequency) {
    if (frequency <= 0) throw new Error("Frequency must be positive");
    return SPEED_OF_SOUND / frequency;
}

/**
 * Calculate frequency from wavelength
 * @param {number} wavelength - Wavelength in meters
 * @returns {number} Frequency in Hz
 */
export function calculateFrequency(wavelength) {
    if (wavelength <= 0) throw new Error("Wavelength must be positive");
    return SPEED_OF_SOUND / wavelength;
}

/**
 * Generate harmonic series from base frequency
 * @param {number} baseFrequency - Base frequency in Hz
 * @param {number} count - Number of harmonics to generate
 * @returns {Array<number>} Array of harmonic frequencies
 */
export function getHarmonicSeries(baseFrequency, count) {
    return Array.from({length: count}, (_, i) => baseFrequency * (i + 1));
}

/**
 * Calculate frequency based on market change
 * @param {number} baseFrequency - Base frequency (e.g., 432 Hz)
 * @param {number} marketChange - Market change percentage
 * @returns {number} Adjusted frequency
 */
export function adjustFrequencyByMarketChange(baseFrequency, marketChange) {
    return baseFrequency * (1 + marketChange / 100);
}

/**
 * Calculate all wavelengths for a set of frequencies
 * @param {Array<number>} frequencies - Array of frequencies in Hz
 * @returns {Array<number>} Array of wavelengths in meters
 */
export function calculateAllWavelengths(frequencies) {
    return frequencies.map(freq => calculateWavelength(freq));
}

export default {
    calculateWavelength,
    calculateFrequency,
    getHarmonicSeries,
    adjustFrequencyByMarketChange,
    calculateAllWavelengths
};
