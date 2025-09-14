// main.js

import HexGrid from './HexGrid.js';
import IconManager from './IconManager.js';
import TableRoller from './TableRoller.js';
import Gemini from './Gemini.js';
import MapGenerator from './MapGenerator.js'; 
import Pathfinder from './Pathfinder.js';
import HexUtils from './HexUtils.js';
import { tables as defaultTables } from './tables/index.js';
import Perlin from './PerlinNoise.js';

let tables = {}; // Will hold merged default and custom tables

const appState = {
    currentMap: { 
        width: 30, 
        height: 20, 
        hexes: {}, 
        campaignLore: "",
        // Will now store objects like {id: 'river1', name: 'Whispering Brook', path: ['0101', ...]}
        rivers: [],
        // Will now store objects like {id: 'road1', name: 'Old King's Road', path: ['0304', ...]}
        roads: [],
    },
    selectedHex: null,
    selectedTablePath: null,
    customTables: {},
    editingTablePath: null,
    geminiApiKey: localStorage.getItem('geminiApiKey') || '',
    language: localStorage.getItem('language') || 'English',
    isPainting: false,
    isDrawingPath: false,
    drawingPath: [],
    activePoiBrush: null,
    visiblePOIs: new Set(),
    editingPathId: null,
};

const DOMElements = {
    loadingOverlay: document.getElementById('loading-overlay'),
    globalTooltip: document.getElementById('global-tooltip'),
    settingsBtn: document.getElementById('settingsBtn'),
    settingsModal: document.getElementById('settingsModal'),
    closeSettingsModalBtn: document.getElementById('closeSettingsModalBtn'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    geminiApiKeyInput: document.getElementById('geminiApiKey'),
    languageSelect: document.getElementById('languageSelect'),
    campaignLoreBtn: document.getElementById('campaignLoreBtn'),
    campaignLoreModal: document.getElementById('campaignLoreModal'),
    closeCampaignLoreModalBtn: document.getElementById('closeCampaignLoreModalBtn'),
    saveCampaignLoreBtn: document.getElementById('saveCampaignLoreBtn'),
    campaignLoreTextarea: document.getElementById('campaignLoreTextarea'),
    hexInfoPanel: document.getElementById('hexInfoPanel'),
    closeHexPanelBtn: document.getElementById('closeHexPanelBtn'),
    expandHexBtn: document.getElementById('expandHexBtn'),
    hexCoordsSpan: document.getElementById('hexCoords'),
    hexTerrainSpan: document.getElementById('hexTerrain'),
    hexPOIsSpan: document.getElementById('hexPOIs'),
    hexContentTextarea: document.getElementById('hexContentTextarea'),
    rollTablesBtn: document.getElementById('rollTablesBtn'),
    weaveWithAiBtn: document.getElementById('weaveWithAiBtn'),
    editContentBtn: document.getElementById('editContentBtn'),
    saveContentBtn: document.getElementById('saveContentBtn'),
    newMapBtn: document.getElementById('newMapBtn'),
    loadMapBtn: document.getElementById('loadMapBtn'),
    saveToFileBtn: document.getElementById('saveToFileBtn'),
    loadFromFileBtn: document.getElementById('loadFromFileBtn'),
    compilePdfBtn: document.getElementById('compilePdfBtn'),
    randomTablesBtn: document.getElementById('randomTablesBtn'),
    campaignFileInput: document.getElementById('campaignFileInput'),
    generateMapBtn: document.getElementById('generateMapBtn'),
    generateRiverBtn: document.getElementById('generateRiverBtn'),
    generateRoadBtn: document.getElementById('generateRoadBtn'),
    newMapModal: document.getElementById('newMapModal'),
    closeNewMapModalBtn: document.getElementById('closeNewMapModalBtn'),
    createNewMapBtn: document.getElementById('createNewMapBtn'),
    mapWidthInput: document.getElementById('mapWidthInput'),
    mapHeightInput: document.getElementById('mapHeightInput'),
    mapSeedInput: document.getElementById('mapSeedInput'),
    mapTypeSelect: document.getElementById('mapTypeSelect'),
    mapElevationSlider: document.getElementById('mapElevationSlider'),
    mapClimateSlider: document.getElementById('mapClimateSlider'),
    randomSeedBtn: document.getElementById('randomSeedBtn'),
    canvas: document.getElementById('hexCanvas'),
    mapToolsSidebar: document.getElementById('mapToolsSidebar'),
    terrainBrushesContainer: document.getElementById('terrainBrushes'),
    toastContainer: document.getElementById('toast-container'),
    hexModal: document.getElementById('hex-modal'),
    hexModalHeader: document.getElementById('hex-modal-header'),
    hexModalResizeHandle: document.getElementById('hex-modal-resize-handle'),
    hexModalContent: document.getElementById('hex-modal-content'),
    hexModalTitle: document.getElementById('hex-modal-title'),
    hexModalTextarea: document.getElementById('hex-modal-textarea'),
    hexModalCloseBtn: document.getElementById('hex-modal-close'),
    hexModalMinimizeBtn: document.getElementById('hex-modal-minimize'),
    pathsGroupToggle: document.getElementById('paths-group-toggle'),
    pathsGroupContent: document.getElementById('paths-group-content'),
    terrainGroupToggle: document.getElementById('terrain-group-toggle'),
    terrainGroupContent: document.getElementById('terrain-group-content'),
    randomTableModal: document.getElementById('randomTableModal'),
    closeRandomTableModalBtn: document.getElementById('closeRandomTableModalBtn'),
    tableSearchInput: document.getElementById('tableSearchInput'),
    tableListContainer: document.getElementById('tableListContainer'),
    rollSelectedTableBtn: document.getElementById('rollSelectedTableBtn'),
    copySelectedTableBtn: document.getElementById('copySelectedTableBtn'),
    selectedTableName: document.getElementById('selectedTableName'),
    tableViewerTextarea: document.getElementById('tableViewerTextarea'),
    lastRollResult: document.getElementById('lastRollResult'),
    addNewTableBtn: document.getElementById('addNewTableBtn'),
    editSelectedTableBtn: document.getElementById('editSelectedTableBtn'),
    deleteSelectedTableBtn: document.getElementById('deleteSelectedTableBtn'),
    customTableEditorModal: document.getElementById('customTableEditorModal'),
    tableCategoryInput: document.getElementById('tableCategoryInput'),
    tableNameInput: document.getElementById('tableNameInput'),
    tableEntriesTextarea: document.getElementById('tableEntriesTextarea'),
    cancelCustomTableBtn: document.getElementById('cancelCustomTableBtn'),
    saveCustomTableBtn: document.getElementById('saveCustomTableBtn'),
    poiGroupToggle: document.getElementById('poi-group-toggle'),
    poiGroupContent: document.getElementById('poi-group-content'),
    poiBrushesContainer: document.getElementById('poiBrushes'),
    filterGroupToggle: document.getElementById('filter-group-toggle'),
    filterGroupContent: document.getElementById('filter-group-content'),
    toggleAllPoisBtn: document.getElementById('toggleAllPoisBtn'),
    poiFilterCheckboxes: document.getElementById('poiFilterCheckboxes'),
    hexPathsSpan: document.getElementById('hexPaths'),
    pathEditorModal: document.getElementById('pathEditorModal'),
    pathNameInput: document.getElementById('pathNameInput'),
    pathDescriptionTextarea: document.getElementById('pathDescriptionTextarea'),
    cancelPathEditBtn: document.getElementById('cancelPathEditBtn'),
    savePathEditBtn: document.getElementById('savePathEditBtn'),
    pathDeletionModal: document.getElementById('pathDeletionModal'),
    pathDeletionList: document.getElementById('pathDeletionList'),
    cancelPathDeletionBtn: document.getElementById('cancelPathDeletionBtn'),
};

const TERRAIN_COLORS = {
    "Plains": "#9aab6e", "Forest": "#547d5d", "Mountain": "#8a8a8a", "Swamp": "#5e6d6c",
    "Desert": "#c2a67d", "Hills": "#9e8b75", "Ocean": "#4f678a", "Lake": "#7a9a9a",
};
const GM_NOTES_DELIMITER = "\n\n--- GM NOTES ---\n";

// --- START CUSTOM TABLE LOGIC ---

function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) {
                Object.assign(target, { [key]: {} });
            }
            deepMerge(target[key], source[key]);
        } else {
            Object.assign(target, { [key]: source[key] });
        }
    }
    return target;
}

function loadCustomTables() {
    const savedTables = localStorage.getItem('hexscribbler_custom_tables');
    if (savedTables) {
        appState.customTables = JSON.parse(savedTables);
    } else {
        appState.customTables = { my_tables: {} };
    }
}

function generateUniqueId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generatePathName(type) {
    if (type === 'river') {
        const riverNames = [...tables.world_building.river_names_1, ...tables.world_building.river_names_2];
        return riverNames[Math.floor(Math.random() * riverNames.length)];
    }
    if (type === 'road') {
        return tables.world_building.road_names[Math.floor(Math.random() * tables.world_building.road_names.length)];
    }
    return "Unnamed Path";
}

function saveCustomTables() {
    localStorage.setItem('hexscribbler_custom_tables', JSON.stringify(appState.customTables));
}

function openTableEditor(path = null) {
    appState.editingTablePath = path;
    if (path) { // Edit mode
        const pathParts = path.split('.');
        const name = pathParts.pop();
        const category = pathParts.join('.');
        
        let tableData = tables;
        for (const part of path.split('.')) {
            tableData = tableData[part];
        }

        DOMElements.tableCategoryInput.value = category;
        DOMElements.tableNameInput.value = name;
        DOMElements.tableEntriesTextarea.value = tableData.join('\n');
    } else { // Add mode
        DOMElements.tableCategoryInput.value = 'my_tables.new_category';
        DOMElements.tableNameInput.value = '';
        DOMElements.tableEntriesTextarea.value = '';
    }
    DOMElements.customTableEditorModal.classList.remove('hidden');
}

function populatePoiBrushes() {
    DOMElements.poiBrushesContainer.innerHTML = '';
    // We need the keys from the Icon Manager to create the buttons
    const poiTypes = Object.keys(IconManager.getIcon('all')); 
    
    for (const poi of poiTypes) {
        if (poi === 'default') continue; // Skip the default icon

        const button = document.createElement('button');
        button.className = 'tool-btn w-14 h-14 flex flex-col items-center justify-center text-xs';
        button.dataset.tooltip = `Place ${poi}`;
        button.dataset.tool = 'place-poi';
        button.dataset.poi = poi;

        const iconImg = document.createElement('img');
        iconImg.className = 'w-6 h-6 mb-1 pointer-events-none';
        iconImg.src = IconManager.getIcon(poi).src;
        iconImg.alt = poi;
        
        const label = document.createElement('span');
        label.textContent = poi;
        label.className = "pointer-events-none";

        button.appendChild(iconImg);
        button.appendChild(label);
        DOMElements.poiBrushesContainer.appendChild(button);
    }
}

// Add this new function to main.js
function populatePoiFilters() {
    const container = DOMElements.poiFilterCheckboxes;
    container.innerHTML = '';
    // Get the list of POI types and sort them alphabetically for a clean UI
    const poiTypes = Object.keys(IconManager.getIcon('all')).filter(p => p !== 'default').sort();

    for (const poi of poiTypes) {
        // By default, all POIs start as visible
        appState.visiblePOIs.add(poi);

        const button = document.createElement('button');
        // Add classes for styling: make it active by default, full-width, and text-aligned left
        button.className = 'tool-btn active w-full text-xs py-1 px-2 text-left mb-1';
        button.textContent = poi;
        button.dataset.poiFilter = poi; // Use a data attribute to identify the POI

        container.appendChild(button);

        // Add the event listener for toggling visibility
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            
            if (button.classList.contains('active')) {
                appState.visiblePOIs.add(poi);
            } else {
                appState.visiblePOIs.delete(poi);
            }

            HexGrid.setVisiblePOIs(appState.visiblePOIs);
            HexGrid.draw();
            updateToggleAllButtonState(); // Update the main toggle button's text
        });
    }
}

function saveCustomTable() {
    const categoryPath = DOMElements.tableCategoryInput.value.trim();
    const tableName = DOMElements.tableNameInput.value.trim().replace(/\s/g, '_');
    const entries = DOMElements.tableEntriesTextarea.value.split('\n').map(line => line.trim()).filter(line => line);

    if (!categoryPath.startsWith('my_tables')) {
        showToast("Error: Category path must start with 'my_tables'.", 3000);
        return;
    }
    if (!tableName || !entries.length) {
        showToast("Error: Table name and entries cannot be empty.", 3000);
        return;
    }

    if (appState.editingTablePath) {
        const oldPathParts = appState.editingTablePath.split('.');
        const oldName = oldPathParts.pop();
        let parent = appState.customTables;
        for (const part of oldPathParts) {
            if (parent) parent = parent[part];
        }
        if (parent && parent[oldName]) {
             delete parent[oldName];
        }
    }
    
    const pathParts = categoryPath.split('.');
    let currentLevel = appState.customTables;
    for (const part of pathParts) {
        if (!currentLevel[part]) {
            currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
    }
    currentLevel[tableName] = entries;

    saveCustomTables();
    populateTableCompendium();
    DOMElements.customTableEditorModal.classList.add('hidden');
    showToast(`Table '${tableName}' saved successfully!`);
}

function deleteCustomTable() {
    const path = appState.selectedTablePath;
    if (!path || !path.startsWith('my_tables')) {
        showToast("Only custom tables can be deleted.", 3000);
        return;
    }

    if (!confirm(`Are you sure you want to delete the table "${path}"? This cannot be undone.`)) {
        return;
    }

    const pathParts = path.split('.');
    const tableName = pathParts.pop();
    let parentObject = appState.customTables;
    for (const part of pathParts) {
        parentObject = parentObject[part];
    }
    delete parentObject[tableName];

    saveCustomTables();
    populateTableCompendium();

    appState.selectedTablePath = null;
    DOMElements.selectedTableName.textContent = "Select a table from the list";
    DOMElements.tableViewerTextarea.value = '';
    DOMElements.lastRollResult.textContent = 'N/A';
    DOMElements.rollSelectedTableBtn.disabled = true;
    DOMElements.copySelectedTableBtn.disabled = true;
    DOMElements.editSelectedTableBtn.disabled = true;
    DOMElements.deleteSelectedTableBtn.disabled = true;

    showToast(`Table "${path}" deleted.`);
}


// --- END CUSTOM TABLE LOGIC ---


function _compendium_roll(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

function _compendium_resolveString(templateStr) {
    if (typeof templateStr !== 'string') return '';
    const placeholderRegex = /\$\{([^}]+)\}/g;

    const replacer = (match, tablePath) => {
        const pathParts = tablePath.split('.');
        let currentTable = tables;
        for (const part of pathParts) {
            currentTable = currentTable ? currentTable[part] : undefined;
        }
        if (Array.isArray(currentTable)) {
            return _compendium_resolveString(_compendium_roll(currentTable));
        }
        return `[INVALID TABLE: ${tablePath}]`;
    };
    
    let resolvedStr = templateStr;
    let lastStr = "";
    while (resolvedStr.includes('${') && resolvedStr !== lastStr) {
        lastStr = resolvedStr;
        resolvedStr = resolvedStr.replace(placeholderRegex, replacer);
    }
    return resolvedStr;
}

function displayTableInViewer(path) {
    const pathParts = path.split('.');
    let selectedTable = tables;
    try {
        for (const part of pathParts) {
            selectedTable = selectedTable[part];
        }

        if (Array.isArray(selectedTable)) {
            const formattedContent = selectedTable.map((item, index) => `${index + 1}. ${item}`).join('\n');
            DOMElements.tableViewerTextarea.value = formattedContent;
        } else {
            DOMElements.tableViewerTextarea.value = "This is a category, not a rollable table.";
        }
    } catch (e) {
        DOMElements.tableViewerTextarea.value = "Error: Could not load table.";
        console.error("Error displaying table:", e);
    }
}

function populateTableCompendium() {
    const defaultCopy = JSON.parse(JSON.stringify(defaultTables));
    tables = deepMerge(defaultCopy, appState.customTables);

    const container = DOMElements.tableListContainer;
    container.innerHTML = '';
    const ul = document.createElement('ul');

    function buildList(obj, path = '') {
        for (const key in obj) {
            const newPath = path ? `${path}.${key}` : key;
            if (Array.isArray(obj[key])) {
                const li = document.createElement('li');
                li.textContent = key.replace(/_/g, ' ');
                li.dataset.path = newPath;
                ul.appendChild(li);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                const header = document.createElement('div');
                header.className = 'category-header';
                header.textContent = key.replace(/_/g, ' ').toUpperCase();
                ul.appendChild(header);
                buildList(obj[key], newPath);
            }
        }
    }
    
    buildList(tables);
    container.appendChild(ul);
}

function rollOnSelectedTable() {
    if (!appState.selectedTablePath) return;
    const pathParts = appState.selectedTablePath.split('.');
    let selectedTable = tables;
    try {
        for (const part of pathParts) {
            selectedTable = selectedTable[part];
        }
        if (Array.isArray(selectedTable)) {
            const result = _compendium_resolveString(_compendium_roll(selectedTable));
            DOMElements.lastRollResult.textContent = result;
        } else {
            throw new Error("Selected path is not a rollable table.");
        }
    } catch (e) {
        console.error("Error rolling on table:", e);
        showToast("Error: Could not roll on selected table.", 3000);
    }
}

function copyTableToClipboard() {
    const content = DOMElements.tableViewerTextarea.value;
    if (!content || appState.selectedTablePath === null) {
        showToast("No table content to copy.", 3000);
        return;
    }
    
    navigator.clipboard.writeText(content).then(() => {
        showToast(`Table copied to clipboard!`);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showToast("Error: Could not copy to clipboard.", 3000);
    });
}

function filterTableList() {
    const filter = DOMElements.tableSearchInput.value.toLowerCase();
    const items = DOMElements.tableListContainer.querySelectorAll('li, .category-header');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.classList.toggle('hidden', !text.includes(filter));
    });
}

async function compileCampaignToPdf() {
    // --- 1. SETUP & USER FEEDBACK ---
    if (typeof window.jspdf === 'undefined') {
        showToast("Error: PDF library not found.", 3000);
        return;
    }

    const loadingText = DOMElements.loadingOverlay.querySelector('p');
    loadingText.textContent = 'Compiling PDF... This may take a moment.';
    DOMElements.loadingOverlay.style.display = 'flex';
    showToast("Compiling PDF...", 4000);

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 15;
        const lineHeight = 6;
        const maxWidth = pageWidth - margin * 2;
        let y = margin;

        const checkPageBreak = (neededHeight = lineHeight) => {
            if (y + neededHeight > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
        };

        // --- 2. GENERATE & ADD MAP IMAGES ---
        console.log("Generating DM map image...");
        const dmMapImage = await HexGrid.renderFullMapToImage({ showPOIs: true, showCoords: true });
        console.log("Generating Player map image...");
        const playerMapImage = await HexGrid.renderFullMapToImage({ showPOIs: false, showCoords: false });

        if (!dmMapImage || !playerMapImage) {
            throw new Error("Failed to render map images.");
        }

        // Add DM Map to Page 1
        doc.setFontSize(18);
        doc.text("DM Map", pageWidth / 2, y, { align: 'center' });
        y += lineHeight * 2;
        doc.addImage(dmMapImage, 'PNG', margin, y, maxWidth, 0);

        // Add Player Map to Page 2
        doc.addPage();
        y = margin;
        doc.setFontSize(18);
        doc.text("Player Map", pageWidth / 2, y, { align: 'center' });
        y += lineHeight * 2;
        doc.addImage(playerMapImage, 'PNG', margin, y, maxWidth, 0);

        // --- 3. CREATE PATH INDEX SECTION ---
        if (appState.currentMap.rivers.length > 0 || appState.currentMap.roads.length > 0) {
            doc.addPage();
            y = margin;
            doc.setFontSize(18);
            doc.text("Rivers and Roads Index", pageWidth / 2, y, { align: 'center' });
            y += lineHeight * 2;

            const addPathSection = (title, paths) => {
                if (paths.length === 0) return;
                checkPageBreak(lineHeight * 2);
                doc.setFontSize(14);
                doc.setFont("times", "bold");
                doc.text(title, margin, y);
                y += lineHeight * 1.5;

                paths.forEach(path => {
                    checkPageBreak(lineHeight * 4);
                    doc.setFontSize(12);
                    doc.setFont("times", "bolditalic");
                    doc.text(path.name, margin, y);
                    y += lineHeight;

                    doc.setFont("times", "normal");
                    doc.setFontSize(10);
                    if (path.description) {
                        const descLines = doc.splitTextToSize(`Description: ${path.description}`, maxWidth);
                        descLines.forEach(line => { checkPageBreak(); doc.text(line, margin, y); y += lineHeight; });
                    }
                    const pathString = "Crosses Hexes: " + path.path.join(', ');
                    const pathLines = doc.splitTextToSize(pathString, maxWidth);
                    pathLines.forEach(line => { checkPageBreak(); doc.text(line, margin, y); y += lineHeight; });
                    y += lineHeight / 2;
                });
            };
            
            addPathSection("Rivers", appState.currentMap.rivers);
            y += lineHeight;
            addPathSection("Roads", appState.currentMap.roads);
        }

        // --- 4. APPEND HEX DESCRIPTIONS ---
        const keyedHexes = Object.entries(appState.currentMap.hexes)
            .filter(([, data]) => (data.content && data.content.trim()) || (data.gmNotes && data.gmNotes.trim()))
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

        if (keyedHexes.length > 0) {
            doc.addPage();
            y = margin;
            doc.setFontSize(18);
            doc.text("Hex Details", pageWidth / 2, y, { align: 'center' });
            y += lineHeight * 2;

            keyedHexes.forEach(([coord, data]) => {
                const content = data.content ? data.content.trim() : "";
                const gmNotes = data.gmNotes ? data.gmNotes.trim() : "";
                const estHeight = (content.split('\n').length + gmNotes.split('\n').length + 5) * lineHeight;
                checkPageBreak(estHeight);

                doc.setFontSize(14);
                doc.setFont("times", "bold");
                const pois = (data.pois && data.pois.length > 0) ? data.pois.join(', ') : 'None';
                doc.text(`Hex ${coord}: ${data.terrain} (POIs: ${pois})`, margin, y);
                y += lineHeight;
                doc.setLineWidth(0.2);
                doc.line(margin, y, pageWidth - margin, y);
                y += lineHeight;

                if (content) {
                    doc.setFontSize(11);
                    doc.setFont("times", "normal");
                    const contentLines = doc.splitTextToSize(content, maxWidth);
                    contentLines.forEach(line => { checkPageBreak(); doc.text(line, margin, y); y += lineHeight; });
                }

                if (gmNotes) {
                    y += lineHeight / 2;
                    checkPageBreak(lineHeight * 2);
                    doc.setFontSize(12);
                    doc.setFont("times", "bold");
                    doc.text("GM Notes", margin, y);
                    y += lineHeight;
                    doc.setFontSize(10);
                    doc.setFont("times", "italic");
                    const notesLines = doc.splitTextToSize(gmNotes, maxWidth);
                    notesLines.forEach(line => { checkPageBreak(); doc.text(line, margin, y); y += lineHeight; });
                }
                y += lineHeight * 1.5;
            });
        }
        
        // --- 5. SAVE THE DOCUMENT ---
        doc.save('hexscribbler-campaign.pdf');
    } catch (error) {
        console.error("PDF Compilation Error:", error);
        showToast("Error: Could not compile PDF.", 3000);
    } finally {
        // --- 6. CLEANUP ---
        loadingText.textContent = 'Loading Campaign...';
        DOMElements.loadingOverlay.style.display = 'none';
    }
}

function showToast(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    DOMElements.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

function generateRandomSeed() {
    return Math.random().toString(36).substring(2, 15);
}

function saveCampaignToFile() {
    try {
        const campaignData = JSON.stringify(appState.currentMap, null, 2);
        const blob = new Blob([campaignData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hexscribbler-campaign.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Campaign saved to file!");
    } catch (e) {
        console.error("Error saving campaign to file:", e);
        showToast("Error: Could not save campaign.", 3000);
    }
}

function loadCampaignFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const campaignData = JSON.parse(e.target.result);
            if (campaignData && campaignData.width && campaignData.height && campaignData.hexes) {
                appState.currentMap = campaignData;
                
                // --- NEW: Migration and Rebuild Logic ---
                if (!appState.currentMap.rivers) appState.currentMap.rivers = [];
                if (!appState.currentMap.roads) appState.currentMap.roads = [];
                
                for (const coord in appState.currentMap.hexes) {
                    const hex = appState.currentMap.hexes[coord];
                    // Migrate old single ID format to new array format
                    if (hex.riverId && !hex.riverIds) {
                        hex.riverIds = [hex.riverId];
                        delete hex.riverId;
                    }
                    if (hex.roadId && !hex.roadIds) {
                        hex.roadIds = [hex.roadId];
                        delete hex.roadId;
                    }
                }
                // --- END of Migration Logic ---

                HexGrid.setMap(appState.currentMap);
                HexGrid.draw();
                DOMElements.hexInfoPanel.classList.add('hidden');
                appState.selectedHex = null;
                HexGrid.setSelected(null);
                HexGrid.resize();
                
                showToast("Campaign loaded from file!");
            } else {
                throw new Error("Invalid campaign file format.");
            }
        } catch (err) {
            console.error("Error loading campaign from file:", err);
            showToast("Error: Invalid or corrupt campaign file.", 3000);
        }
    };
    reader.readAsText(file);
    DOMElements.campaignFileInput.value = '';
}

function openHexModal() {
    if (!appState.selectedHex) return;
    DOMElements.hexModalTitle.textContent = `Hex Content (${appState.selectedHex})`;
    DOMElements.hexModalTextarea.value = DOMElements.hexContentTextarea.value;
    DOMElements.hexModal.classList.remove('hidden');
}

function populateTerrainBrushes() {
    DOMElements.terrainBrushesContainer.innerHTML = '';
    for (const [terrain, color] of Object.entries(TERRAIN_COLORS)) {
        const button = document.createElement('button');
        button.className = 'tool-btn w-14 h-14 flex flex-col items-center justify-center text-xs';
        button.dataset.tooltip = `Paint ${terrain}`;
        button.dataset.tool = 'paint';
        button.dataset.terrain = terrain;
        const colorSwatch = document.createElement('div');
        colorSwatch.className = 'w-6 h-6 mb-1 pointer-events-none';
        colorSwatch.style.backgroundColor = color;
        colorSwatch.style.border = '2px solid var(--bg-darkest)';
        const label = document.createElement('span');
        label.textContent = terrain;
        label.className = "pointer-events-none";
        button.appendChild(colorSwatch);
        button.appendChild(label);
        DOMElements.terrainBrushesContainer.appendChild(button);
    }
}

function updateButtonStates() {
    const canUseAI = appState.selectedHex && appState.geminiApiKey;
    DOMElements.weaveWithAiBtn.disabled = !canUseAI;
}

function setActiveTool(tool, brush = null) {
    if (appState.isDrawingPath) {
        finalizeCurrentPath();
    }
    appState.activeTool = tool;
    appState.activeBrush = null; // Reset other brushes
    appState.activePoiBrush = null; // Reset other brushes

    if (tool === 'paint') {
        appState.activeBrush = brush;
    } else if (tool === 'place-poi') {
        appState.activePoiBrush = brush;
    }

    document.querySelectorAll('.tool-btn').forEach(btn => {
        const isPaintMatch = tool === 'paint' && btn.dataset.terrain === brush;
        const isPoiMatch = tool === 'place-poi' && btn.dataset.poi === brush;
        const isOtherToolMatch = btn.dataset.tool === tool && tool !== 'paint' && tool !== 'place-poi';
        btn.classList.toggle('active-tool', isPaintMatch || isPoiMatch || isOtherToolMatch);
    });

    if (appState.activeTool && (appState.activeTool.startsWith('draw-') || appState.activeTool === 'paint' || appState.activeTool === 'place-poi' || appState.activeTool === 'remove-poi')) {
        DOMElements.canvas.parentElement.style.cursor = 'crosshair';
    } else {
        DOMElements.canvas.parentElement.style.cursor = 'grab';
    }
}

function paintHexAt(worldX, worldY) {
    const hexCoord = HexGrid.pixelToGrid(worldX, worldY);
    if (!hexCoord) return;

    const hex = appState.currentMap.hexes[hexCoord];

    if (appState.activeBrush && hex.terrain !== appState.activeBrush) {
        // Update terrain and clear old content
        hex.terrain = appState.activeBrush;
        hex.content = "";
        hex.gmNotes = "";
        if (appState.selectedHex === hexCoord) {
            DOMElements.hexContentTextarea.value = "";
        }

        // --- NEW: Context-Aware POI Generation for Painting ---
        const POI_SETTINGS = TableRoller.getPOISettings(hex.terrain);
        if (POI_SETTINGS && Math.random() < POI_SETTINGS.chance) {
            const validPOIs = MapGenerator.filterPOIsByContext(POI_SETTINGS.types, hexCoord, appState.currentMap);
            const poiType = TableRoller.weightedRoll(validPOIs);

            if (poiType) {
                if (poiType === "Settlement") {
                    const settlementType = TableRoller.weightedRoll(TableRoller.getSettlementTypes());
                    hex.pois = settlementType ? [settlementType] : [];
                } else {
                    hex.pois = [poiType];
                }
            } else {
                hex.pois = [];
            }
        } else {
            hex.pois = [];
        }
        // --- End of New Logic ---

        HexGrid.draw();
    }
}

function deletePath(pathId, pathType) {
    if (!pathId || !pathType) return;

    const pathArray = pathType === 'river' ? appState.currentMap.rivers : appState.currentMap.roads;
    const idArrayKey = pathType === 'river' ? 'riverIds' : 'roadIds';
    const pathIndex = pathArray.findIndex(p => p.id === pathId);

    if (pathIndex > -1) {
        const pathNameToDelete = pathArray[pathIndex].name;
        pathArray.splice(pathIndex, 1);

        // Iterate through all hexes to remove the ID from their arrays
        for (const coord in appState.currentMap.hexes) {
            const hex = appState.currentMap.hexes[coord];
            if (hex[idArrayKey] && hex[idArrayKey].includes(pathId)) {
                hex[idArrayKey] = hex[idArrayKey].filter(id => id !== pathId);
                // If the array is now empty, delete the property
                if (hex[idArrayKey].length === 0) {
                    delete hex[idArrayKey];
                }
            }
        }
        
        showToast(`Deleted ${pathType}: ${pathNameToDelete}`);
        saveCampaignToLocal();
        HexGrid.draw();
        // Refresh the hex info panel if the deleted path was in the selected hex
        if (appState.selectedHex) handleHexSelection(appState.selectedHex);
    }
}

function openPathDeletionModal(hexCoord) {
    const hex = appState.currentMap.hexes[hexCoord];
    if (!hex) return;

    const listContainer = DOMElements.pathDeletionList;
    listContainer.innerHTML = ''; // Clear previous buttons

    const pathsToDelete = [];
    if (hex.riverIds) {
        hex.riverIds.forEach(id => {
            const river = appState.currentMap.rivers.find(r => r.id === id);
            if (river) pathsToDelete.push({ ...river, type: 'river' });
        });
    }
    if (hex.roadIds) {
        hex.roadIds.forEach(id => {
            const road = appState.currentMap.roads.find(r => r.id === id);
            if (road) pathsToDelete.push({ ...road, type: 'road' });
        });
    }

    if (pathsToDelete.length === 0) {
        showToast("No path in this hex to delete.", 2000);
        return;
    }

    // If there's only one path, just confirm and delete it directly
    if (pathsToDelete.length === 1) {
        const path = pathsToDelete[0];
        if (confirm(`Are you sure you want to delete the ${path.type} "${path.name}"?`)) {
            deletePath(path.id, path.type);
        }
        return;
    }

    // If there are multiple paths, populate the modal
    pathsToDelete.forEach(path => {
        const button = document.createElement('button');
        button.textContent = `Delete ${path.type}: ${path.name}`;
        button.className = 'w-full text-left p-2';
        button.onclick = () => {
            deletePath(path.id, path.type);
            DOMElements.pathDeletionModal.classList.add('hidden');
        };
        listContainer.appendChild(button);
    });

    DOMElements.pathDeletionModal.classList.remove('hidden');
}

function placeOrRemovePoiAt(worldX, worldY) {
    const hexCoord = HexGrid.pixelToGrid(worldX, worldY);
    if (!hexCoord) return;

    const hex = appState.currentMap.hexes[hexCoord];
    if (!hex) return;

    if (appState.activeTool === 'place-poi' && appState.activePoiBrush) {
        // Only update if the POI is different to prevent needless redraws
        if (!hex.pois.includes(appState.activePoiBrush)) {
            hex.pois = [appState.activePoiBrush];
            hex.content = ""; // Clear content when changing POI
            hex.gmNotes = "";
            if (appState.selectedHex === hexCoord) DOMElements.hexContentTextarea.value = "";
            HexGrid.draw();
        }
    } else if (appState.activeTool === 'remove-poi') {
        // Only update if there is a POI to remove
        if (hex.pois.length > 0) {
            hex.pois = [];
            hex.content = ""; // Clear content when removing POI
            hex.gmNotes = "";
            if (appState.selectedHex === hexCoord) DOMElements.hexContentTextarea.value = "";
            HexGrid.draw();
        }
    }
}

function saveCampaignToLocal() {
    try {
        localStorage.setItem('hexscribbler_campaign', JSON.stringify(appState.currentMap));
    } catch (e) { console.error("Error saving campaign:", e); }
}

function loadCampaignFromLocal() {
    try {
        const savedCampaign = localStorage.getItem('hexscribbler_campaign');
        if (savedCampaign) {
            appState.currentMap = JSON.parse(savedCampaign);

            // --- NEW: Migration and Rebuild Logic ---
            if (!appState.currentMap.rivers) appState.currentMap.rivers = [];
            if (!appState.currentMap.roads) appState.currentMap.roads = [];

            for (const coord in appState.currentMap.hexes) {
                const hex = appState.currentMap.hexes[coord];
                // Migrate old single ID format to new array format
                if (hex.riverId && !hex.riverIds) {
                    hex.riverIds = [hex.riverId];
                    delete hex.riverId;
                }
                if (hex.roadId && !hex.roadIds) {
                    hex.roadIds = [hex.roadId];
                    delete hex.roadId;
                }
            }
            // --- END of Migration Logic ---

            HexGrid.setMap(appState.currentMap);
        }
    } catch (e) { console.error("Error loading campaign:", e); }
}

function initBlankMap(width, height) {
    appState.currentMap = { width, height, hexes: {}, campaignLore: "", rivers: [], roads: [] };
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const coord = `${String(x + 1).padStart(2, '0')}${String(y + 1).padStart(2, '0')}`;
            appState.currentMap.hexes[coord] = { terrain: "Ocean", pois: [], content: "", gmNotes: "" };
        }
    }
    saveCampaignToLocal();
    HexGrid.setMap(appState.currentMap);
    HexGrid.draw();
    showToast(`New ${width}x${height} blank map created!`);
}

function initNewGeneratedMap({ width, height, seed, mapType, elevation, climate }) {
    DOMElements.loadingOverlay.style.display = 'flex';

    // Generate the base map terrain first
    const hexes = MapGenerator.generateMapData({ width, height, seed, mapType, elevation, climate });
    
    appState.currentMap = {
        width, height, seed, mapType, elevation, climate, 
        hexes, 
        campaignLore: "",
        rivers: [], roads: []
    };

    // --- REWRITTEN POI GENERATION LOOP ---
    // This loop now incorporates the context-aware filtering logic.
    for (const coord in appState.currentMap.hexes) {
        const hex = appState.currentMap.hexes[coord];
        const terrain = hex.terrain;
        
        // The POI list from TableRoller.js for the current terrain.
        // We need to access this directly to filter it before rolling.
        const POI_SETTINGS = TableRoller.getPOISettings(terrain);
        
        if (POI_SETTINGS && Math.random() < POI_SETTINGS.chance) {
            // Filter the list of possible POIs based on geographical context
            const validPOIs = MapGenerator.filterPOIsByContext(POI_SETTINGS.types, coord, appState.currentMap);

            // Roll for a POI from the *filtered* list
            const poiType = TableRoller.weightedRoll(validPOIs);

            if (poiType) {
                // If the result is a generic "Settlement", roll for the specific sub-type
                if (poiType === "Settlement") {
                    const settlementType = TableRoller.weightedRoll(TableRoller.getSettlementTypes());
                    hex.pois = settlementType ? [settlementType] : [];
                } else {
                    hex.pois = [poiType];
                }
            } else {
                hex.pois = [];
            }
        } else {
            hex.pois = [];
        }
    }
    saveCampaignToLocal();
    HexGrid.setMap(appState.currentMap);
    HexGrid.draw();
    showToast(`New ${width}x${height} ${mapType} world generated! Seed: ${seed}`);
    DOMElements.loadingOverlay.style.display = 'none';
}

function startOrContinuePath(hexCoord) {
    if (!hexCoord) return;
    if (appState.drawingPath.length > 0 && appState.drawingPath[appState.drawingPath.length - 1] === hexCoord) {
        return;
    }
    appState.isDrawingPath = true;
    appState.drawingPath.push(hexCoord);
    HexGrid.setDrawingPath(appState.drawingPath);
}

function finalizeCurrentPath() {
    if (!appState.isDrawingPath || appState.drawingPath.length < 2) {
        resetPathDrawing();
        return;
    }

    const isRiver = appState.activeTool.includes('river');
    const pathType = isRiver ? 'river' : 'road';
    const pathArray = isRiver ? appState.currentMap.rivers : appState.currentMap.roads;
    const idArrayKey = isRiver ? 'riverIds' : 'roadIds';
    
    const newId = generateUniqueId(pathType);
    const newName = generatePathName(pathType);
    const newPath = {
        id: newId,
        name: newName,
        description: "",
        path: [...appState.drawingPath]
    };

    pathArray.push(newPath);

    // --- UPDATED LOGIC ---
    // Link the path ID to each hex it crosses using an array.
    newPath.path.forEach(coord => {
        const hex = appState.currentMap.hexes[coord];
        if (hex) {
            if (!hex[idArrayKey]) {
                hex[idArrayKey] = [];
            }
            if (!hex[idArrayKey].includes(newId)) {
                hex[idArrayKey].push(newId);
            }
        }
    });
    // --- END of Update ---

    showToast(`${isRiver ? 'River' : 'Road'} path saved!`);
    saveCampaignToLocal();
    resetPathDrawing();
    HexGrid.draw();
}

function resetPathDrawing() {
    appState.isDrawingPath = false;
    appState.drawingPath = [];
    HexGrid.setDrawingPath([]);
    console.log("Path drawing reset.");
}

function handleHexSelection(hexCoord) {
    if (appState.activeTool && appState.activeTool.startsWith('draw-')) {
        startOrContinuePath(hexCoord);
        return;
    }
    if (appState.isDrawingPath) {
        finalizeCurrentPath();
    }
    
    const hex = appState.currentMap.hexes[hexCoord];
    if (!hex) return;

    if (appState.activeTool === 'delete-path') {
        openPathDeletionModal(hexCoord);
        return;
    }
    
    if (appState.activeTool === 'edit-path') {
        const pathIds = [...(hex.riverIds || []), ...(hex.roadIds || [])];
        if (pathIds.length === 1) {
            const pathType = hex.riverIds ? 'river' : 'road';
            openPathEditorModal(pathIds[0], pathType);
        } else if (pathIds.length > 1) {
            // If we add a multi-path edit modal, it would be called here.
            // For now, we can just edit the first one found or show a message.
            showToast("Multi-path editing not yet supported. Edit paths in separate hexes.", 3000);
        } else {
            showToast("No path in this hex to edit.", 2000);
        }
        return;
    }

    if (appState.activeTool !== 'select') return;

    appState.selectedHex = hexCoord;
    HexGrid.setSelected(hexCoord);
    
    DOMElements.hexCoordsSpan.textContent = hexCoord;
    DOMElements.hexTerrainSpan.textContent = hex.terrain;
    DOMElements.hexPOIsSpan.textContent = (hex.pois && hex.pois.length > 0) ? hex.pois.join(', ') : 'None';

    // --- NEW: Multi-Path Display Logic ---
    const pathStrings = [];
    if (hex.riverIds) {
        hex.riverIds.forEach(id => {
            const river = appState.currentMap.rivers.find(r => r.id === id);
            if (river) pathStrings.push(`River (${river.name})`);
        });
    }
    if (hex.roadIds) {
        hex.roadIds.forEach(id => {
            const road = appState.currentMap.roads.find(r => r.id === id);
            if (road) pathStrings.push(`Road (${road.name})`);
        });
    }

    DOMElements.hexPathsSpan.textContent = pathStrings.length > 0 ? pathStrings.join(', ') : 'None';
    // --- END of New Logic ---

    let combinedContent = hex.content || "";
    if (hex.gmNotes) {
        combinedContent += GM_NOTES_DELIMITER + hex.gmNotes;
    }
    DOMElements.hexContentTextarea.value = combinedContent;
    DOMElements.hexContentTextarea.disabled = true;
    DOMElements.saveContentBtn.disabled = true;
    DOMElements.hexInfoPanel.classList.remove('hidden');
    HexGrid.resize();
    updateButtonStates();
}

function updateToggleAllButtonState() {
    const allPois = Object.keys(IconManager.getIcon('all')).filter(p => p !== 'default');
    if (appState.visiblePOIs.size < allPois.length) {
        DOMElements.toggleAllPoisBtn.textContent = "Show All POIs";
    } else {
        DOMElements.toggleAllPoisBtn.textContent = "Hide All POIs";
    }
}

function generateSmartRoad() {
    const settlements = Object.entries(appState.currentMap.hexes)
        .filter(([, data]) => data.pois.includes('Hamlet') || data.pois.includes('Town') || data.pois.includes('City'))
        .map(([coord]) => coord);

    if (settlements.length < 2) {
        showToast("Not enough settlements to connect a road.");
        return;
    }

    let start = settlements[Math.floor(Math.random() * settlements.length)];
    let end;
    do {
        end = settlements[Math.floor(Math.random() * settlements.length)];
    } while (start === end);

    const roadCostMap = {
        Plains: 1, Forest: 2, Hills: 3, Desert: 4, Swamp: 10, Mountain: 20, Lake: 1000, Ocean: 1000,
    };

    const pathCoords = Pathfinder.findPath(start, end, appState.currentMap, roadCostMap);

    if (pathCoords) {
        const newId = generateUniqueId('road');
        const newName = generatePathName('road');
        const newPath = {
            id: newId,
            name: newName,
            description: "",
            path: pathCoords
        };
        
        appState.currentMap.roads.push(newPath);
        
        // --- UPDATED LOGIC ---
        newPath.path.forEach(coord => {
            const hex = appState.currentMap.hexes[coord];
            if (hex) {
                if (!hex.roadIds) {
                    hex.roadIds = [];
                }
                if (!hex.roadIds.includes(newId)) {
                    hex.roadIds.push(newId);
                }
            }
        });
        // --- END of Update ---
        
        saveCampaignToLocal();
        HexGrid.draw();
        showToast(`Road generated: ${newName}`);
    } else {
        showToast("Could not find a suitable path for a road.");
    }
}

function generateRiverPathStepByStep(start, end, mapData, terrainHeight) {
    const MIN_RIVER_LENGTH = 6;
    const MAX_RIVER_LENGTH = 100; // Failsafe to prevent infinite loops
    let path = [start];
    let currentCoord = start;

    for (let i = 0; i < MAX_RIVER_LENGTH; i++) {
        const currentHex = mapData.hexes[currentCoord];
        const currentHeight = terrainHeight[currentHex.terrain];
        
        const neighbors = HexUtils.getNeighbors(currentCoord, mapData.width, mapData.height);
        
        // Filter out hexes already in the path to prevent loops
        const validNeighbors = neighbors.filter(n => !path.includes(n));
        if (validNeighbors.length === 0) break; // River is stuck

        let scoredNeighbors = validNeighbors.map(nCoord => {
            const nHex = mapData.hexes[nCoord];
            const nHeight = terrainHeight[nHex.terrain];
            const heightDiff = currentHeight - nHeight; // Positive is downhill

            let score = 0;
            // Strong bonus for flowing downhill
            score -= heightDiff * 20;
            // Penalty for staying level
            if (heightDiff === 0) score += 10;
            // Strong penalty for flowing uphill
            if (heightDiff < 0) score += 50;

            // Add a strong random factor to encourage meandering
            score += Math.random() * 15;

            // Small bonus for generally heading toward the final destination
            if (HexUtils.getHexDistance(nCoord, end) < HexUtils.getHexDistance(currentCoord, end)) {
                score -= 5;
            }

            return { coord: nCoord, score: score };
        });

        // Find the best neighbor (lowest score)
        scoredNeighbors.sort((a, b) => a.score - b.score);
        const nextCoord = scoredNeighbors[0].coord;
        
        path.push(nextCoord);
        currentCoord = nextCoord;

        // If we hit water, the river is done
        const nextHex = mapData.hexes[nextCoord];
        if (nextHex.terrain === 'Ocean' || nextHex.terrain === 'Lake') {
            break;
        }
    }
    
    // Final validation
    if (path.length < MIN_RIVER_LENGTH) return null;
    
    // Truncate the path to end at the first water tile encountered
    const firstWaterIndex = path.findIndex(coord => {
        const hex = mapData.hexes[coord];
        return hex && (hex.terrain === 'Ocean' || hex.terrain === 'Lake');
    });

    if (firstWaterIndex > -1) {
        return path.slice(0, firstWaterIndex + 1);
    }
    
    return null; // The path did not successfully terminate in water
}

function generateSmartRiver() {
    // ... (The top part of the function finding start/end points and generating the path remains unchanged) ...
    const meanderNoise = new Perlin(Math.random()); 
    const MIN_RIVER_LENGTH = 6; 
    const terrainHeight = { Mountain: 5, Hills: 4, Forest: 3, Plains: 2, Desert: 2, Swamp: 1, Lake: 0, Ocean: 0 };
    
    const potentialStarts = Object.entries(appState.currentMap.hexes)
        .filter(([, data]) => data.terrain === 'Mountain' || data.terrain === 'Hills')
        .map(([coord]) => coord);

    if (potentialStarts.length === 0) {
        showToast("No mountains or hills found to start a river.");
        return;
    }
    const start = potentialStarts[Math.floor(Math.random() * potentialStarts.length)];

    const potentialEnds = Object.entries(appState.currentMap.hexes)
        .filter(([, data]) => data.terrain === 'Ocean' || data.terrain === 'Lake')
        .map(([coord]) => coord);

    if (potentialEnds.length === 0) {
        showToast("No ocean or lakes found for the river to flow to.");
        return;
    }
    
    const endTarget = potentialEnds.sort((a, b) => HexUtils.getHexDistance(start, a) - HexUtils.getHexDistance(start, b))[0];
    const pathCoords = generateRiverPathStepByStep(start, endTarget, appState.currentMap, terrainHeight);

    if (pathCoords && pathCoords.length >= MIN_RIVER_LENGTH) {
        const newId = generateUniqueId('river');
        const newName = generatePathName('river');
        const newPath = {
            id: newId,
            name: newName,
            description: "",
            path: pathCoords
        };

        appState.currentMap.rivers.push(newPath);

        // --- UPDATED LOGIC ---
        newPath.path.forEach(coord => {
            const hex = appState.currentMap.hexes[coord];
            if (hex) {
                hex.pois = []; 
                if (!hex.riverIds) {
                    hex.riverIds = [];
                }
                if (!hex.riverIds.includes(newId)) {
                    hex.riverIds.push(newId);
                }
            }
        });
        // --- END of Update ---

        saveCampaignToLocal();
        HexGrid.draw();
        showToast(`River generated: ${newName}`);
    } else {
        showToast("Could not find a suitable path for a river.");
    }
}

function openPathEditorModal(pathId, pathType) {
    appState.editingPathId = pathId;
    appState.editingPathType = pathType; // 'river' or 'road'

    const pathArray = pathType === 'river' ? appState.currentMap.rivers : appState.currentMap.roads;
    const path = pathArray.find(p => p.id === pathId);

    if (path) {
        DOMElements.pathNameInput.value = path.name;
        DOMElements.pathDescriptionTextarea.value = path.description || '';
        DOMElements.pathEditorModal.classList.remove('hidden');
    } else {
        showToast("Error: Could not find path data.", 3000);
    }
}

function savePathDetails() {
    if (!appState.editingPathId || !appState.editingPathType) return;

    const pathArray = appState.editingPathType === 'river' ? appState.currentMap.rivers : appState.currentMap.roads;
    const path = pathArray.find(p => p.id === appState.editingPathId);

    if (path) {
        path.name = DOMElements.pathNameInput.value.trim();
        path.description = DOMElements.pathDescriptionTextarea.value.trim();
        
        saveCampaignToLocal();
        DOMElements.pathEditorModal.classList.add('hidden');
        showToast(`Path '${path.name}' updated!`);
        
        // If the edited path is in the currently selected hex, refresh the info panel
        if (appState.selectedHex) {
            handleHexSelection(appState.selectedHex);
        }
    }

    // Clear editing state
    appState.editingPathId = null;
    appState.editingPathType = null;
}

function makeModalInteractive() {
    let isDragging = false, isResizing = false;
    let offsetX, offsetY, startX, startY, startWidth, startHeight;
    let lastPos = {};
    const modal = DOMElements.hexModal;
    const header = DOMElements.hexModalHeader;
    const handle = DOMElements.hexModalResizeHandle;
    const content = DOMElements.hexModalContent;
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - modal.offsetLeft;
        offsetY = e.clientY - modal.offsetTop;
        modal.style.cursor = 'grabbing';
    });
    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = modal.offsetWidth;
        startHeight = modal.offsetHeight;
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            modal.style.left = `${e.clientX - offsetX}px`;
            modal.style.top = `${e.clientY - offsetY}px`;
        }
        if (isResizing) {
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);
            modal.style.width = `${newWidth}px`;
            modal.style.height = `${newHeight}px`;
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
        modal.style.cursor = 'default';
    });
    DOMElements.hexModalMinimizeBtn.addEventListener('click', () => {
        if (modal.dataset.minimized === 'true') {
            modal.style.width = lastPos.width;
            modal.style.height = lastPos.height;
            modal.style.top = lastPos.top;
            modal.style.left = lastPos.left;
            modal.style.bottom = 'auto';
            modal.style.right = 'auto';
            modal.style.transform = 'translate(0, 0)';
            content.classList.remove('hidden');
            handle.classList.remove('hidden');
            modal.dataset.minimized = 'false';
            DOMElements.hexModalMinimizeBtn.textContent = '-';
        } else {
            lastPos = { width: `${modal.offsetWidth}px`, height: `${modal.offsetHeight}px`, top: `${modal.offsetTop}px`, left: `${modal.offsetLeft}px` };
            modal.style.width = '300px';
            modal.style.height = 'auto';
            modal.style.top = 'auto';
            modal.style.left = '1rem';
            modal.style.bottom = '1rem';
            modal.style.right = 'auto';
            modal.style.transform = 'none';
            content.classList.add('hidden');
            handle.classList.add('hidden');
            modal.dataset.minimized = 'true';
            DOMElements.hexModalMinimizeBtn.textContent = '+';
        }
    });
    DOMElements.hexModalTextarea.addEventListener('input', () => {
        DOMElements.hexContentTextarea.value = DOMElements.hexModalTextarea.value;
        if (DOMElements.saveContentBtn.disabled) {
            DOMElements.saveContentBtn.disabled = false;
        }
    });
}

function initializeTooltips() {
    const tooltip = DOMElements.globalTooltip;
    document.body.addEventListener('mouseover', e => {
        const target = e.target.closest('[data-tooltip]');
        if (!target) return;
        tooltip.textContent = target.dataset.tooltip;
        tooltip.classList.remove('hidden');
        const targetRect = target.getBoundingClientRect();
        tooltip.style.left = `0px`;
        tooltip.style.top = `0px`;
        const tooltipRect = tooltip.getBoundingClientRect();
        let top, left;
        if (targetRect.top < window.innerHeight / 2) {
            top = targetRect.bottom + 5;
        } else {
            top = targetRect.top - tooltipRect.height - 5;
        }
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        if (left < 5) left = 5;
        if (left + tooltipRect.width > window.innerWidth - 5) {
            left = window.innerWidth - tooltipRect.width - 5;
        }
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.opacity = '1';
    });
    document.body.addEventListener('mouseleave', e => {
        if (e.target.closest('[data-tooltip]')) {
            tooltip.style.opacity = '0';
        }
    }, true);
    document.documentElement.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
}

function toggleToolGroup(contentEl, headerEl) {
    contentEl.classList.toggle('hidden');
    headerEl.classList.toggle('expanded');
}


function setupEventListeners() {
    DOMElements.settingsBtn.addEventListener('click', () => {
        DOMElements.geminiApiKeyInput.value = appState.geminiApiKey;
        DOMElements.languageSelect.value = appState.language;
        DOMElements.settingsModal.classList.remove('hidden');
    });
    DOMElements.closeSettingsModalBtn.addEventListener('click', () => DOMElements.settingsModal.classList.add('hidden'));
    DOMElements.saveSettingsBtn.addEventListener('click', () => {
        appState.geminiApiKey = DOMElements.geminiApiKeyInput.value;
        appState.language = DOMElements.languageSelect.value;
        localStorage.setItem('geminiApiKey', appState.geminiApiKey);
        localStorage.setItem('language', appState.language);
        DOMElements.settingsModal.classList.add('hidden');
        updateButtonStates();
        showToast("Settings Saved");
    });
    DOMElements.campaignLoreBtn.addEventListener('click', () => {
        DOMElements.campaignLoreTextarea.value = appState.currentMap.campaignLore;
        DOMElements.campaignLoreModal.classList.remove('hidden');
    });
    DOMElements.closeCampaignLoreModalBtn.addEventListener('click', () => DOMElements.campaignLoreModal.classList.add('hidden'));
    DOMElements.saveCampaignLoreBtn.addEventListener('click', () => {
        appState.currentMap.campaignLore = DOMElements.campaignLoreTextarea.value;
        saveCampaignToLocal();
        DOMElements.campaignLoreModal.classList.add('hidden');
        showToast("Campaign Lore Saved");
    });
    DOMElements.newMapBtn.addEventListener('click', () => {
        if (confirm("Create a new blank map? Unsaved changes will be lost.")) {
            const width = parseInt(prompt("Enter map width:", "30"));
            const height = parseInt(prompt("Enter map height:", "20"));
            if (width && height > 0) {
                initBlankMap(width, height);
            } else {
                alert("Invalid dimensions.");
            }
        }
    });
    DOMElements.generateMapBtn.addEventListener('click', () => {
        DOMElements.newMapModal.classList.remove('hidden');
    });
    DOMElements.closeNewMapModalBtn.addEventListener('click', () => {
        DOMElements.newMapModal.classList.add('hidden');
    });
    DOMElements.randomSeedBtn.addEventListener('click', () => {
        DOMElements.mapSeedInput.value = generateRandomSeed();
    });
    DOMElements.createNewMapBtn.addEventListener('click', () => {
        const width = parseInt(DOMElements.mapWidthInput.value);
        const height = parseInt(DOMElements.mapHeightInput.value);
        let seed = DOMElements.mapSeedInput.value.trim();
        const mapType = DOMElements.mapTypeSelect.value;
        const elevation = parseInt(DOMElements.mapElevationSlider.value);
        const climate = parseInt(DOMElements.mapClimateSlider.value);
        if (!seed) {
            seed = generateRandomSeed();
        }
        if (width && height > 0) {
            initNewGeneratedMap({ width, height, seed, mapType, elevation, climate });
            DOMElements.newMapModal.classList.add('hidden');
        } else {
            alert("Invalid dimensions.");
        }
    });
    DOMElements.loadMapBtn.addEventListener('click', () => {
        if (confirm("Load from browser storage? Unsaved changes will be lost.")) {
            loadCampaignFromLocal();
            HexGrid.draw();
            showToast("Campaign Loaded");
        }
    });
    DOMElements.saveToFileBtn.addEventListener('click', saveCampaignToFile);
    DOMElements.loadFromFileBtn.addEventListener('click', () => {
        if (confirm("Load from file? Unsaved changes will be lost.")) {
            DOMElements.campaignFileInput.click();
        }
    });
    DOMElements.campaignFileInput.addEventListener('change', loadCampaignFromFile);
    DOMElements.compilePdfBtn.addEventListener('click', compileCampaignToPdf);
    DOMElements.randomTablesBtn.addEventListener('click', () => DOMElements.randomTableModal.classList.remove('hidden'));
    DOMElements.closeRandomTableModalBtn.addEventListener('click', () => DOMElements.randomTableModal.classList.add('hidden'));
    DOMElements.rollSelectedTableBtn.addEventListener('click', rollOnSelectedTable);
    DOMElements.copySelectedTableBtn.addEventListener('click', copyTableToClipboard);
    DOMElements.tableSearchInput.addEventListener('input', filterTableList);
    DOMElements.tableListContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const selected = DOMElements.tableListContainer.querySelector('.selected');
            if (selected) selected.classList.remove('selected');
            e.target.classList.add('selected');
            appState.selectedTablePath = e.target.dataset.path;
            DOMElements.selectedTableName.textContent = appState.selectedTablePath.replace(/\./g, ' / ');
            DOMElements.rollSelectedTableBtn.disabled = false;
            DOMElements.copySelectedTableBtn.disabled = false;
            DOMElements.editSelectedTableBtn.disabled = !appState.selectedTablePath.startsWith('my_tables');
            DOMElements.deleteSelectedTableBtn.disabled = !appState.selectedTablePath.startsWith('my_tables');
            displayTableInViewer(appState.selectedTablePath);
        }
    });
    DOMElements.addNewTableBtn.addEventListener('click', () => openTableEditor());
    DOMElements.editSelectedTableBtn.addEventListener('click', () => {
        if (appState.selectedTablePath) {
            openTableEditor(appState.selectedTablePath);
        }
    });
    DOMElements.deleteSelectedTableBtn.addEventListener('click', deleteCustomTable);
    DOMElements.cancelCustomTableBtn.addEventListener('click', () => DOMElements.customTableEditorModal.classList.add('hidden'));
    DOMElements.saveCustomTableBtn.addEventListener('click', saveCustomTable);
    DOMElements.cancelPathEditBtn.addEventListener('click', () => {
        DOMElements.pathEditorModal.classList.add('hidden');
        appState.editingPathId = null;
        appState.editingPathType = null;
    });

    DOMElements.savePathEditBtn.addEventListener('click', savePathDetails);
    DOMElements.cancelPathDeletionBtn.addEventListener('click', () => {
        DOMElements.pathDeletionModal.classList.add('hidden');
    });
    DOMElements.closeHexPanelBtn.addEventListener('click', () => {
        DOMElements.hexInfoPanel.classList.add('hidden');
        appState.selectedHex = null;
        HexGrid.setSelected(null);
        HexGrid.resize();
    });
    DOMElements.rollTablesBtn.addEventListener('click', () => {
        if (!appState.selectedHex) return;
        const hexData = appState.currentMap.hexes[appState.selectedHex];

        // --- NEW: Gather ALL Path Info ---
        const pathInfos = [];
        if (hexData.riverIds) {
            hexData.riverIds.forEach(id => {
                const river = appState.currentMap.rivers.find(r => r.id === id);
                if (river) pathInfos.push({ ...river, type: 'river' });
            });
        }
        if (hexData.roadIds) {
            hexData.roadIds.forEach(id => {
                const road = appState.currentMap.roads.find(r => r.id === id);
                if (road) pathInfos.push({ ...road, type: 'road' });
            });
        }
        // --- END of New Logic ---

        const tableContent = TableRoller.generateHexDescription(hexData, pathInfos);
        
        let displayText = `${tableContent.title.toUpperCase()}\n\n${tableContent.intro}\n\n${tableContent.details}`;
        
        if (tableContent.path) {
            displayText += `\n\n---\nPATH:\n${tableContent.path}`;
        }
        
        displayText += `\n\n---\nENCOUNTER: ${tableContent.encounter}\nDISCOVERY: ${tableContent.discovery}`;

        const currentNotes = appState.currentMap.hexes[appState.selectedHex].gmNotes || "";
        if (currentNotes) displayText += GM_NOTES_DELIMITER + currentNotes;
        
        DOMElements.hexContentTextarea.value = displayText;
        DOMElements.hexModalTextarea.value = displayText;
        appState.currentMap.hexes[appState.selectedHex].content = displayText.split(GM_NOTES_DELIMITER)[0];
        saveCampaignToLocal();
        showToast("Tables Rolled!");
    });
    DOMElements.weaveWithAiBtn.addEventListener('click', async () => {
        if (!appState.selectedHex || !appState.geminiApiKey) return;
        DOMElements.weaveWithAiBtn.disabled = true;
        DOMElements.weaveWithAiBtn.textContent = "Weaving...";
        const currentText = DOMElements.hexContentTextarea.value;
        const aiResponse = await Gemini.generateContentFromApi(
            appState.geminiApiKey, currentText, appState.currentMap.campaignLore, appState.language
        );
        DOMElements.hexContentTextarea.value = aiResponse;
        DOMElements.hexModalTextarea.value = aiResponse;
        appState.currentMap.hexes[appState.selectedHex].content = aiResponse.split(GM_NOTES_DELIMITER)[0];
        saveCampaignToLocal();
        DOMElements.weaveWithAiBtn.textContent = "Weave with AI";
        updateButtonStates();
    });
    DOMElements.editContentBtn.addEventListener('click', () => {
        DOMElements.hexContentTextarea.disabled = false;
        DOMElements.saveContentBtn.disabled = false;
        DOMElements.hexContentTextarea.focus();
    });
    DOMElements.saveContentBtn.addEventListener('click', () => {
        if (!appState.selectedHex) return;
        const fullText = DOMElements.hexContentTextarea.value;
        const parts = fullText.split(GM_NOTES_DELIMITER);
        appState.currentMap.hexes[appState.selectedHex].content = parts[0] || "";
        appState.currentMap.hexes[appState.selectedHex].gmNotes = parts[1] || "";
        saveCampaignToLocal();
        DOMElements.hexContentTextarea.disabled = true;
        DOMElements.saveContentBtn.disabled = true;
        showToast("Hex Content Saved");
    });

    // --- THIS IS THE CORRECTED EVENT LISTENER ---
    DOMElements.mapToolsSidebar.addEventListener('click', (e) => {
        const toolBtn = e.target.closest('.tool-btn[data-tool]');
        if (toolBtn) {
            // This line now correctly checks for data-terrain OR data-poi
            setActiveTool(toolBtn.dataset.tool, toolBtn.dataset.terrain || toolBtn.dataset.poi || null);
        }
    });
    // --- END OF CORRECTION ---

    DOMElements.pathsGroupToggle.addEventListener('click', () => {
        toggleToolGroup(DOMElements.pathsGroupContent, DOMElements.pathsGroupToggle);
    });
    DOMElements.terrainGroupToggle.addEventListener('click', () => {
        toggleToolGroup(DOMElements.terrainGroupContent, DOMElements.terrainGroupToggle);
    });
    DOMElements.poiGroupToggle.addEventListener('click', () => {
        toggleToolGroup(DOMElements.poiGroupContent, DOMElements.poiGroupToggle);
    });

    DOMElements.expandHexBtn.addEventListener('click', openHexModal);
    DOMElements.hexModalCloseBtn.addEventListener('click', () => {
        DOMElements.hexModal.classList.add('hidden');
    });
    DOMElements.generateRiverBtn.addEventListener('click', generateSmartRiver);
    DOMElements.generateRoadBtn.addEventListener('click', generateSmartRoad);
    DOMElements.canvas.addEventListener('mousedown', (e) => {
        if (e.button !== 0 || appState.activeTool === 'select' || appState.activeTool.startsWith('draw-')) return;
        
        appState.isPainting = true;
        const rect = DOMElements.canvas.getBoundingClientRect();
        const worldX = (e.clientX - rect.left - HexGrid.camera.x) / HexGrid.camera.zoom;
        const worldY = (e.clientY - rect.top - HexGrid.camera.y) / HexGrid.camera.zoom;

        if (appState.activeTool === 'paint') paintHexAt(worldX, worldY);
        if (appState.activeTool === 'place-poi' || appState.activeTool === 'remove-poi') placeOrRemovePoiAt(worldX, worldY);
    });

    DOMElements.filterGroupToggle.addEventListener('click', () => {
        toggleToolGroup(DOMElements.filterGroupContent, DOMElements.filterGroupToggle);
    });

    DOMElements.toggleAllPoisBtn.addEventListener('click', () => {
        const allPois = Object.keys(IconManager.getIcon('all')).filter(p => p !== 'default');
        const allButtons = DOMElements.poiFilterCheckboxes.querySelectorAll('button');
        
        const shouldShowAll = appState.visiblePOIs.size < allPois.length;

        if (shouldShowAll) {
            allPois.forEach(poi => appState.visiblePOIs.add(poi));
            allButtons.forEach(btn => btn.classList.add('active'));
        } else {
            appState.visiblePOIs.clear();
            allButtons.forEach(btn => btn.classList.remove('active'));
        }

        HexGrid.setVisiblePOIs(appState.visiblePOIs);
        HexGrid.draw();
        updateToggleAllButtonState();
    });

    DOMElements.canvas.addEventListener('mousemove', (e) => {
        if (!appState.isPainting) return;
        const rect = DOMElements.canvas.getBoundingClientRect();
        const worldX = (e.clientX - rect.left - HexGrid.camera.x) / HexGrid.camera.zoom;
        const worldY = (e.clientY - rect.top - HexGrid.camera.y) / HexGrid.camera.zoom;
        
        if (appState.activeTool === 'paint') paintHexAt(worldX, worldY);
        if (appState.activeTool === 'place-poi' || appState.activeTool === 'remove-poi') placeOrRemovePoiAt(worldX, worldY);
    });

    document.addEventListener('mouseup', (e) => {
        if (e.button !== 0) return;
        if (appState.isPainting) {
            appState.isPainting = false;
            saveCampaignToLocal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (appState.isDrawingPath) {
            if (e.key === 'Enter') {
                e.preventDefault();
                finalizeCurrentPath();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                resetPathDrawing();
                showToast("Path cancelled.");
            }
        }
    });
}

async function initializeApp() {
    DOMElements.loadingOverlay.style.display = 'flex';
    
    // --- NEW: Load icons first, as they are now a dependency for the UI ---
    await IconManager.loadIcons();

    loadCustomTables();
    populateTerrainBrushes();
    populatePoiBrushes(); // Now this will work correctly
    populateTableCompendium();
    makeModalInteractive();
    initializeTooltips();
    setupEventListeners();
    setActiveTool('select');
    populatePoiFilters();
    
    // The HexGrid no longer needs to load the icons, but it still needs to be initialized.
    await HexGrid.init(DOMElements.canvas, handleHexSelection);
    
    if (localStorage.getItem('hexscribbler_campaign')) {
        loadCampaignFromLocal();
    } else {
        DOMElements.newMapModal.classList.remove('hidden');
    }
    HexGrid.setVisiblePOIs(appState.visiblePOIs);
    HexGrid.draw();
    setTimeout(() => {
        DOMElements.loadingOverlay.style.display = 'none';
    }, 100);
}

initializeApp();