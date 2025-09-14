// Pathfinder.js - A* Pathfinding Algorithm for a Hex Grid

import HexUtils from './HexUtils.js';

/**
 * Finds the cheapest path between two hexes using the A* algorithm.
 * @param {string} startCoord - The starting hex coordinate string (e.g., "0101").
 * @param {string} endCoord - The goal hex coordinate string.
 * @param {object} mapData - The complete map data object, including width, height, and hexes.
 * @param {object} costMap - An object mapping terrain types to their movement cost (e.g., { Plains: 1, Mountain: 10 }).
 * @returns {string[] | null} An array of coordinate strings representing the path, or null if no path is found.
 */
function findPath(startCoord, endCoord, mapData, costMap) {
    const openSet = [startCoord];
    const cameFrom = {};

    const gScore = {}; // Cost from start to the current node
    gScore[startCoord] = 0;

    const fScore = {}; // Estimated total cost from start to goal through the current node
    fScore[startCoord] = HexUtils.getHexDistance(startCoord, endCoord);

    // Initialize scores for all hexes to infinity
    for (const coord in mapData.hexes) {
        if (coord !== startCoord) {
            gScore[coord] = Infinity;
            fScore[coord] = Infinity;
        }
    }

    while (openSet.length > 0) {
        // Find the node in openSet with the lowest fScore
        let current = openSet.sort((a, b) => fScore[a] - fScore[b])[0];

        if (current === endCoord) {
            return reconstructPath(cameFrom, current);
        }

        // Remove current from openSet
        openSet.splice(openSet.indexOf(current), 1);
        
        const neighbors = HexUtils.getNeighbors(current, mapData.width, mapData.height);

        for (const neighbor of neighbors) {
            const terrain = mapData.hexes[neighbor].terrain;
            const cost = costMap[terrain] || 1000; // Use a high cost for undefined terrains

            const tentativeGScore = gScore[current] + cost;

            if (tentativeGScore < gScore[neighbor]) {
                // This path to the neighbor is better than any previous one. Record it!
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] = gScore[neighbor] + HexUtils.getHexDistance(neighbor, endCoord);
                
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    // If the open set is empty but the goal was never reached, no path exists.
    return null; 
}

/**
 * Reconstructs the path by tracing back from the goal using the cameFrom map.
 * @param {object} cameFrom - The map of connections.
 * @param {string} current - The goal coordinate string.
 * @returns {string[]} The final path as an array of coordinate strings.
 */
function reconstructPath(cameFrom, current) {
    const totalPath = [current];
    while (current in cameFrom) {
        current = cameFrom[current];
        totalPath.unshift(current);
    }
    return totalPath;
}

const Pathfinder = {
    findPath,
};

export default Pathfinder;