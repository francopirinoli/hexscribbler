// HexUtils.js - A collection of helper functions for the hex grid.

/**
 * Converts axial coordinates to an offset coordinate string (e.g., "0101").
 * @param {object} axial - An object with q and r properties.
 * @returns {string} The offset coordinate string.
 */
function axialToOffsetString(axial) {
    const col = axial.q;
    const row = axial.r + (axial.q - (axial.q & 1)) / 2;
    return `${String(col + 1).padStart(2, '0')}${String(row + 1).padStart(2, '0')}`;
}

/**
 * Converts an offset coordinate string (e.g., "0101") to axial coordinates.
 * @param {string} coord - The offset coordinate string.
 * @returns {object} An object with q and r properties.
 */
function offsetStringToAxial(coord) {
    const col = parseInt(coord.substring(0, 2)) - 1;
    const row = parseInt(coord.substring(2, 4)) - 1;
    const q = col;
    const r = row - (col - (col & 1)) / 2;
    return { q, r };
}

/**
 * Gets the coordinates of all valid neighbors for a given hex.
 * @param {string} coord - The coordinate string of the hex.
 * @param {number} width - The width of the map.
 * @param {number} height - The height of the map.
 * @returns {string[]} An array of neighbor coordinate strings.
 */
function getNeighbors(coord, width, height) {
    const axial = offsetStringToAxial(coord);
    const neighbors = [];
    const directions = [
        { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
        { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
    ];

    for (const dir of directions) {
        const neighborAxial = { q: axial.q + dir.q, r: axial.r + dir.r };
        const col = neighborAxial.q;
        const row = neighborAxial.r + (neighborAxial.q - (neighborAxial.q & 1)) / 2;

        if (col >= 0 && col < width && row >= 0 && row < height) {
            neighbors.push(axialToOffsetString(neighborAxial));
        }
    }
    return neighbors;
}

/**
 * Calculates the distance between two hexes in hex units.
 * @param {string} startCoord - The starting hex coordinate string.
 * @param {string} endCoord - The ending hex coordinate string.
 * @returns {number} The distance in hexes.
 */
function getHexDistance(startCoord, endCoord) {
    const a = offsetStringToAxial(startCoord);
    const b = offsetStringToAxial(endCoord);
    const dq = Math.abs(a.q - b.q);
    const dr = Math.abs(a.r - b.r);
    const ds = Math.abs((-a.q - a.r) - (-b.q - b.r));
    return Math.max(dq, dr, ds);
}

const HexUtils = {
    getNeighbors,
    getHexDistance,
    offsetStringToAxial
};

export default HexUtils;