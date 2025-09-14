// HexGrid.js - Module for rendering and interacting with the hex map

import IconManager from './IconManager.js';

// --- Constants ---
const HEX_SIDES = 6;
const HEX_SIZE = 50;
const TERRAIN_COLORS = {
    "Plains": "#9aab6e", "Forest": "#547d5d", "Mountain": "#8a8a8a", "Swamp": "#5e6d6c",
    "Desert": "#c2a67d", "Hills": "#9e8b75", "Ocean": "#4f678a", "Lake": "#7a9a9a", "default": "#333"
};

// --- Module State ---
let canvas, ctx;
let mapData = null;
let onHexClickCallback = null;
let selectedHexCoord = null;
let drawingPath = [];
const camera = { x: 0, y: 0, zoom: 1, isDragging: false, lastX: 0, lastY: 0 };
let gridMetrics = {};
let visiblePOIs = new Set(); // NEW: Add this line

// --- Core Functions ---
async function init(canvasElement, hexClickCallback) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    onHexClickCallback = hexClickCallback;
    gridMetrics = calculateGridMetrics(HEX_SIZE);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('click', handleClick);
}

function setMap(newMapData) {
    mapData = newMapData;
}

function setDrawingPath(path) {
    drawingPath = path;
    draw();
}

function setVisiblePOIs(poiSet) {
    visiblePOIs = poiSet;
}

function draw(options = {}) {
    if (!ctx || !mapData) return;

    // --- NEW: Define default rendering options ---
    const {
        showPOIs = true,
        showCoords = true,
        // We can add more options here in the future (e.g., showRivers, showRoads)
    } = options;
    // --- END of New Logic ---

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // Render passes (unchanged)
    for (let gridY = 0; gridY < mapData.height; gridY++) {
        for (let gridX = 0; gridX < mapData.width; gridX++) {
            const coord = `${String(gridX + 1).padStart(2, '0')}${String(gridY + 1).padStart(2, '0')}`;
            const hexData = mapData.hexes[coord];
            const pixelPos = gridToPixel(gridX, gridY);
            drawHex(pixelPos.x, pixelPos.y, hexData ? hexData.terrain : "default");
        }
    }

    if (mapData.rivers && mapData.rivers.length > 0) {
        mapData.rivers.forEach(riverObj => drawPath(riverObj.path, { color: '#7a9a9a', width: 5 }, mapData));
    }
    if (mapData.roads && mapData.roads.length > 0) {
        mapData.roads.forEach(roadObj => drawPath(roadObj.path, { color: '#6b5a45', width: 2, dash: [2, 6] }, mapData));
    }
    if (drawingPath.length > 0) {
        drawPath(drawingPath, { color: '#ffffff', width: 3, dash: [10, 5] });
    }

    if (selectedHexCoord) {
        const x = parseInt(selectedHexCoord.substring(0, 2)) - 1;
        const y = parseInt(selectedHexCoord.substring(2, 4)) - 1;
        if (x >= 0 && y >= 0) {
            const pixelPos = gridToPixel(x, y);
            drawHexHighlight(pixelPos.x, pixelPos.y);
        }
    }
    
    // --- MODIFIED: POI Rendering Loop ---
    if (showPOIs) {
        for (let gridY = 0; gridY < mapData.height; gridY++) {
            for (let gridX = 0; gridX < mapData.width; gridX++) {
                const coord = `${String(gridX + 1).padStart(2, '0')}${String(gridY + 1).padStart(2, '0')}`;
                const hexData = mapData.hexes[coord];
                if (hexData && hexData.pois && hexData.pois.length > 0 && visiblePOIs.has(hexData.pois[0])) {
                    const pixelPos = gridToPixel(gridX, gridY);
                    drawPoiMarker(pixelPos, hexData.pois[0]);
                }
            }
        }
    }
    // --- END of Modification ---

    // --- MODIFIED: Hex Coordinate Rendering Loop ---
    if (showCoords) {
        for (let gridY = 0; gridY < mapData.height; gridY++) {
            for (let gridX = 0; gridX < mapData.width; gridX++) {
                const coord = `${String(gridX + 1).padStart(2, '0')}${String(gridY + 1).padStart(2, '0')}`;
                const pixelPos = gridToPixel(gridX, gridY);
                drawHexCoords(pixelPos, coord);
            }
        }
    }
    // --- END of Modification ---

    ctx.restore();
}

async function renderFullMapToImage(options = {}) {
    if (!mapData || !ctx) return null;

    // --- 1. Save the current state ---
    // We store the original canvas context and camera settings to restore them later.
    const originalCtx = ctx;
    const originalCamera = { ...camera };

    // --- 2. Calculate the full map dimensions ---
    // This determines how big our temporary canvas needs to be.
    // We add some padding around the edges.
    const totalWidth = mapData.width * gridMetrics.gridSpaceX + HEX_SIZE;
    const totalHeight = mapData.height * gridMetrics.gridSpaceY + HEX_SIZE;

    // --- 3. Create a temporary, off-screen canvas ---
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = totalWidth;
    tempCanvas.height = totalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    
    // --- 4. Temporarily override the module's state for rendering ---
    // We point the module's main 'ctx' to our temporary one.
    ctx = tempCtx; 
    // We reset the camera to a neutral state to draw the whole map from the top-left.
    // The small offset accounts for the padding.
    camera.x = HEX_SIZE / 2;
    camera.y = HEX_SIZE / 2;
    camera.zoom = 1;

    // --- 5. Draw the entire map onto the temporary canvas ---
    // We call our modified draw function, passing the specific rendering options.
    draw(options);

    // --- 6. Generate the image data ---
    // This converts the content of our temporary canvas into an image URL.
    const imageDataUrl = tempCanvas.toDataURL('image/png');

    // --- 7. CRITICAL: Restore the original state ---
    // We revert the context and camera back to what they were before we started.
    // This ensures the user's on-screen view is not affected at all.
    ctx = originalCtx;
    camera.x = originalCamera.x;
    camera.y = originalCamera.y;
    camera.zoom = originalCamera.zoom;

    // --- 8. Return the final image data ---
    return imageDataUrl;
}

function setSelected(hexCoord) {
    selectedHexCoord = hexCoord;
    draw();
}

// --- Helper Drawing Functions ---
function drawHex(x, y, terrain) {
    ctx.beginPath();
    const step = (2 * Math.PI) / 6;
    for (let i = 0; i < 6; i++) {
        const px = x + HEX_SIZE * Math.cos(step * i);
        const py = y + HEX_SIZE * Math.sin(step * i);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = TERRAIN_COLORS[terrain] || TERRAIN_COLORS.default;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawHexHighlight(x, y) {
    ctx.beginPath();
    const step = (2 * Math.PI) / 6;
    for (let i = 0; i < 6; i++) {
        const px = x + HEX_SIZE * Math.cos(step * i);
        const py = y + HEX_SIZE * Math.sin(step * i);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = '#5b8ee3';
    ctx.lineWidth = 4;
    ctx.stroke();
}

function drawHexCoords(origin, coord) {
    if (camera.zoom < 0.5) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = `${Math.min(12, HEX_SIZE / 4)}px var(--font-body)`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(coord, origin.x, origin.y + (HEX_SIZE * 0.7));
}

function drawPoiMarker(origin, poiType) {
    if (camera.zoom < 0.3) return;
    const icon = IconManager.getIcon(poiType);
    if (icon) {
        const iconSize = HEX_SIZE * 0.6;
        const x = origin.x - iconSize / 2;
        const y = origin.y - iconSize / 2;
        ctx.drawImage(icon, x, y, iconSize, iconSize);
    }
}

function drawPath(pathCoords, style, mapData) {
    if (pathCoords.length < 2) return;
    const points = pathCoords.map(coord => {
        const x = parseInt(coord.substring(0, 2)) - 1;
        const y = parseInt(coord.substring(2, 4)) - 1;
        return gridToPixel(x, y);
    });

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // --- START: River Termination Logic ---
    let specialEndPoint = null;
    if (mapData && style.color === '#7a9a9a') { // Check if it's a river
        const lastCoord = pathCoords[pathCoords.length - 1];
        const lastHex = mapData.hexes[lastCoord];
        if (lastHex && (lastHex.terrain === 'Ocean' || lastHex.terrain === 'Lake')) {
            const p1 = points[points.length - 2];
            const p2 = points[points.length - 1];
            // The border between two hexes is exactly at the midpoint of the line connecting their centers.
            specialEndPoint = {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2
            };
        }
    }
    // --- END: River Termination Logic ---

    if (points.length === 2) {
        const endPoint = specialEndPoint || points[1];
        ctx.lineTo(endPoint.x, endPoint.y);
    } else {
        // Draw curves for all segments except the very last one
        for (let i = 1; i < points.length - 2; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        // Handle the last segment separately
        const secondLastPoint = points[points.length - 2];
        const lastPoint = points[points.length - 1];
        const endPoint = specialEndPoint || lastPoint;
        ctx.quadraticCurveTo(secondLastPoint.x, secondLastPoint.y, endPoint.x, endPoint.y);
    }

    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash(style.dash || []);
    ctx.stroke();
    ctx.setLineDash([]);
}

function calculateGridMetrics(radius) {
    const diameter = radius * 2;
    const gridSpaceX = diameter * 0.75;
    const gridSpaceY = diameter * (Math.sqrt(3) / 2);
    return { gridSpaceX, gridSpaceY, gridOffsetY: gridSpaceY / 2 };
}

function gridToPixel(gridX, gridY) {
    return {
        x: gridX * gridMetrics.gridSpaceX,
        y: gridY * gridMetrics.gridSpaceY + (gridX % 2 ? gridMetrics.gridOffsetY : 0)
    };
}

function handleMouseDown(e) {
    if (e.button !== 0) return;
    e.target.dragged = false;
    camera.isDragging = true;
    camera.lastX = e.clientX;
    camera.lastY = e.clientY;
}
function handleMouseMove(e) {
    if (!camera.isDragging) return;
    e.target.dragged = true;
    const dx = e.clientX - camera.lastX;
    const dy = e.clientY - camera.lastY;
    camera.x += dx;
    camera.y += dy;
    camera.lastX = e.clientX;
    camera.lastY = e.clientY;
    requestAnimationFrame(draw);
}
function handleMouseUp(e) {
    if (e.button !== 0) return;
    camera.isDragging = false;
}
function handleWheel(e) {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const oldZoom = camera.zoom;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldX = (mouseX - camera.x) / oldZoom;
    const worldY = (mouseY - camera.y) / oldZoom;
    camera.zoom *= (e.deltaY < 0) ? (1 + zoomIntensity) : (1 - zoomIntensity);
    camera.zoom = Math.max(0.1, Math.min(camera.zoom, 3));
    camera.x = mouseX - worldX * camera.zoom;
    camera.y = mouseY - worldY * camera.zoom;
    requestAnimationFrame(draw);
}
function handleClick(e) {
    if (e.target.dragged) return;
    const rect = canvas.getBoundingClientRect();
    const worldX = (e.clientX - rect.left - camera.x) / camera.zoom;
    const worldY = (e.clientY - rect.top - camera.y) / camera.zoom;
    const hexCoord = pixelToGrid(worldX, worldY);
    if (hexCoord && onHexClickCallback) {
        onHexClickCallback(hexCoord);
    }
}
function resizeCanvas() {
    const container = document.getElementById('mapContainer');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    requestAnimationFrame(draw);
}
function pixelToGrid(x, y) {
    const q_axial = (2/3 * x) / HEX_SIZE;
    const r_axial = ((-1/3 * x) + (Math.sqrt(3)/3 * y)) / HEX_SIZE;
    const rounded = axialRound(q_axial, r_axial);
    const col = rounded.q;
    const row = rounded.r + (rounded.q - (rounded.q & 1)) / 2;
    if (mapData && col >= 0 && col < mapData.width && row >= 0 && row < mapData.height) {
        return `${String(col + 1).padStart(2, '0')}${String(row + 1).padStart(2, '0')}`;
    }
    return null;
}
function axialRound(q, r) {
    const s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);
    const q_diff = Math.abs(rq - q);
    const r_diff = Math.abs(rr - r);
    const s_diff = Math.abs(rs - s);
    if (q_diff > r_diff && q_diff > s_diff) {
        rq = -rr - rs;
    } else if (r_diff > s_diff) {
        rr = -rq - rs;
    }
    return { q: rq, r: rr };
}

const HexGrid = { init, setMap, draw, resize: resizeCanvas, pixelToGrid, camera, setSelected, setDrawingPath, setVisiblePOIs, renderFullMapToImage };
export default HexGrid;