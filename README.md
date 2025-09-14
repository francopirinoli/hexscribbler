# Hexscribbler
### An OSR Hexcrawl Campaign Manager

Hexscribbler is a comprehensive, web-based tool for Old School Renaissance (OSR) Game Masters that streamlines the creation and management of dynamic hexcrawl campaigns. It combines a powerful procedural map generator with a deep, customizable random table system and AI-powered narrative weaving to create a living campaign tool that minimizes GM prep time while maximizing emergent story opportunities.

## Github Pages Link:

---

## Core Features

Hexscribbler is built around four main components that work together to provide an end-to-end solution for hexcrawl creation and management.

### 1. The Hexmap Creator
Create the foundational geography of your campaign world with advanced procedural generation or fine-grained manual control.

*   **Advanced Procedural Generation:** Generate unique worlds using a text-based seed. Control the world's feel with sliders for **Elevation** (Flat <> Mountainous) and **Climate** (Dry <> Wet).
*   **Diverse Map Presets:** Choose from a wide selection of map types that alter landmass formation, including Continent, Archipelago, Pangea, Inland Sea, and more.
*   **Terrain & POI Painting:** Manually "paint" terrain and Points of Interest directly onto the map using an intuitive toolset. Add or remove POIs with a single click.
*   **Smart Path Generation:** Manually draw rivers and roads, or use the one-click "Smart Generation" buttons which employ an A* pathfinding algorithm to create plausible rivers (from high elevation to water) and roads (connecting settlements).

### 2. The Dynamic Hex Content Generator
Bring your world to life with unique, on-the-fly content for any hex on the map.

*   **Template-Driven Descriptions:** A powerful, multi-layered random table system generates rich, narrative descriptions for any hex based on its biome and Point of Interest.
*   **AI Story Weaver:** With a single click, send the generated text to the Gemini LLM to have it rewritten and elaborated upon, creating immersive, atmospheric prose in multiple languages.
*   **Campaign Lore Integration:** A dedicated section for high-level campaign lore provides context for the AI, ensuring its generated content is thematically consistent with your world.

### 3. The Random Table Compendium
The engine that powers the content generation is fully exposed to the user for maximum customization.

*   **Browse & Search:** A dedicated modal allows you to browse and search the entire library of hundreds of built-in random tables.
*   **View, Roll, & Copy:** View the complete contents of any table, roll for a random result, or copy the formatted table to your clipboard for use in your notes.
*   **Complete Custom Table Editor:**
    *   **Add:** Create your own random tables with custom categories and entries.
    *   **Edit:** Modify your custom tables at any time.
    *   **Delete:** Remove tables you no longer need.
    *   All custom tables are saved to the browser's local storage and are seamlessly integrated into the content generation engine.

### 4. Campaign Management & Portability
Manage your campaign data with robust tools for saving, loading, and exporting.

*   **Browser Storage:** Automatically saves your entire campaign state to your browser's local storage for quick and easy access.
*   **JSON Export/Import:** Save your entire campaign to a local `.json` file for backup or sharing. Load a campaign from a file to restore its state completely.
*   **Advanced PDF Compiler:** Generate a professional, multi-page, printable PDF of your campaign notes, including:
    *   A full-page **Dungeon Master's Map** with all POIs and hex numbers.
    *   A full-page **Player's Map** with POIs and numbers hidden.
    *   A comprehensive **Rivers and Roads Index** with names, descriptions, and the hexes they cross.
    *   Detailed, formatted descriptions for every hex that has content.

## Technology Stack

*   **Core:** Vanilla JavaScript (ES6 Modules)
*   **Rendering:** HTML5 Canvas API
*   **Styling:** Custom internal stylesheet with minimal Tailwind CSS for layout.
*   **AI Integration:** Google Gemini API
*   **Persistence:** Browser Local Storage
*   **Libraries:** jsPDF for PDF compilation.

## Local Setup & Installation

Hexscribbler is a client-side application built with vanilla JavaScript modules. To run it locally, you need to serve the files from a local web server (opening `index.html` directly from the file system will not work due to browser security policies regarding JS modules).

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/hexscribbler.git
    cd hexscribbler
    ```

2.  **Serve the files:** The easiest way is to use Python's built-in HTTP server.
    *   If you have Python 3:
        ```bash
        python -m http.server
        ```
    *   If you have Python 2:
        ```bash
        python -m SimpleHTTPServer
        ```

3.  **Open in your browser:** Navigate to `http://localhost:8000` in your web browser.

## Future Development Roadmap

The next major planned feature is the **User Onboarding & Help System**, which will include a "first visit" tutorial modal to guide new users.

Further stretch goals include:
*   **Layers Functionality:** Add controls to toggle the visibility of rivers and roads on the map.
*   **Image Support:** Implement the ability to paste image URLs into the hex modal and have them render.
*   **Expanded Random Tables:** Continue adding more content tables for even greater variety.
