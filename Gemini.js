// Gemini.js - The AI Story Weaver

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=";

async function generateContentFromApi(apiKey, textContent, campaignLore, language = 'English') {
    if (!apiKey) {
        return "ERROR: Gemini API key is missing. Please set it in the Settings menu.";
    }

    // --- RE-ENGINEERED PROMPT ---
    // Now takes freeform text as its primary input.

    let languageVariant = language;
    if (language.toLowerCase() === 'spanish') {
        languageVariant = 'Latin American Spanish';
    }

    let systemInstruction = `You are a creative OSR Game Master. Your task is to take a set of raw, structured notes for a fantasy RPG hex and rewrite them into an evocative, compelling location description.
- Your writing style is concise and focuses on actionable information for players.
- Do not break the fourth wall.
- Your output must be plain text, without any Markdown formatting (no '#', '*', '_', etc.).`;

    let taskInstruction = `**Task:** Rewrite and expand upon the following notes. Transform them into 2-3 paragraphs of immersive, atmospheric prose. Organize the information logically, starting with a strong title. Make it mysterious and intriguing for players. The final output must be plain text.`;

    if (language && language.toLowerCase() !== 'english') {
        systemInstruction = `You are a creative OSR Game Master, fluent in ${languageVariant}. Your task is to take a set of raw, structured notes for a fantasy RPG hex and rewrite them into an evocative, compelling location description natively in ${languageVariant}.
- Your writing style is concise and focuses on actionable information for players.
- Do not break the fourth wall.
- Your output must be plain text, without any Markdown formatting (no '#', '*', '_', etc.).`;
        
        taskInstruction = `**Task:** Rewrite and expand upon the following notes, writing natively and naturally in ${languageVariant}. Transform them into 2-3 paragraphs of immersive, atmospheric prose.
**CRITICAL:** Creatively adapt all proper names (e.g., 'Adwin's Meadow') into a ${languageVariant} fantasy equivalent.
The final output must be ONLY in ${languageVariant} and formatted as plain text. Start with a strong title.`;
    }

    let userPrompt = ``;
    if (campaignLore) {
        userPrompt += `**Campaign Lore Context:** "${campaignLore}"\n\n`;
    }
    userPrompt += `**Raw Hex Notes to Rewrite:**\n---\n${textContent}\n---\n\n`;
    userPrompt += taskInstruction;

    // API Call
    try {
        const response = await fetch(`${API_URL}${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "contents": [{ "parts": [{ "text": userPrompt }] }],
                "systemInstruction": { "parts": [{ "text": systemInstruction }] },
                "generationConfig": {
                    "temperature": 0.85, "topK": 40, "topP": 0.95, "maxOutputTokens": 1024,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `ERROR: API request failed. Status: ${response.status}. Details: ${errorData.error.message}`;
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            const finishReason = data.candidates[0].finishReason;
            if (finishReason && finishReason !== "STOP") {
                if (finishReason === "SAFETY") return "ERROR: Response blocked for safety reasons.";
            }
            let cleanText = data.candidates[0].content.parts[0].text;
            cleanText = cleanText.replace(/### |## |# /g, '').replace(/\*\*|\*|__/g, '');
            return cleanText;
        } else {
            return "ERROR: The API returned an empty or blocked response.";
        }

    } catch (error) {
        return "ERROR: Failed to connect to the Gemini API. Check network connection.";
    }
}

const Gemini = {
    generateContentFromApi
};

export default Gemini;