import { BattleResult } from "../types";

// Cloudflare Worker Proxy URL - kein API-Key mehr nötig!
const WORKER_URL = "https://gemini-proxy.fischervorchdorf.workers.dev/";

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            const base64Content = base64Data.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Content,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const analyzeBattle = async (image1: File, image2: File): Promise<BattleResult> => {
    // Timeout after 60 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Die Analyse dauert zu lange.')), 60000);
    });

    const battlePromise = async (): Promise<BattleResult> => {
        try {
            const imagePart1 = await fileToGenerativePart(image1);
            const imagePart2 = await fileToGenerativePart(image2);

            const systemInstruction = `
Du bist ein kreativer Battle-Analyst. Analysiere die beiden Bilder und stelle fest, wer in einem Kampf gewinnen würde.

WICHTIGE REGELN:
- TIERE vs TIERE: Direkter Kampf (z.B. Hai vs Tiger, Mistkäfer vs Regenwurm)
- OBJEKTE (Werkzeuge/Waffen): Ein Mensch benutzt sie (z.B. Messer = Mensch mit Messer)
- FAHRZEUGE: Kollision bei mittlerer Geschwindigkeit (z.B. Auto vs Traktor)
- MISCHUNGEN: Kreativ interpretieren (z.B. Hund vs Mensch mit Messer)

Gib deine Antwort als JSON zurück:
{
  "combatant1": {
    "name": "Hai",
    "description": "Ein gefährlicher Meeresräuber mit scharfen Zähnen",
    "stats": {"strength": 85, "speed": 70, "defense": 60, "agility": 65, "intelligence": 40, "stamina": 75},
    "strengths": ["Starker Biss", "Schnell im Wasser", "Gut gepanzert"],
    "weaknesses": ["Nur im Wasser effektiv", "Langsam an Land", "Benötigt Wasser"]
  },
  "combatant2": { /* gleiche Struktur */ },
  "winner": 1,
  "winProbability": 75,
  "scenarios": [
    {"title": "Im Wasser", "description": "Der Hai dominiert komplett", "advantage": 1},
    {"title": "An Land", "description": "Der Tiger hat klaren Vorteil", "advantage": 2}
  ],
  "verdict": "Im Wasser gewinnt der Hai klar (95%), an Land der Tiger (99%). Overall: Kommt auf Umgebung an!"
}

Stats: 0-100, sinnvoll für Kontext. Sei kreativ aber plausibel!
`;

            const prompt = "Analysiere diese beiden Kontrahenten und erstelle eine Battle-Auswertung. Gib JSON zurück.";

            // Cloudflare Worker Proxy Request
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [imagePart1, imagePart2, { text: prompt }]
                    }],
                    systemInstruction: {
                        parts: [{ text: systemInstruction }]
                    },
                    generationConfig: {
                        temperature: 0.7,
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Worker request failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            console.log("AI Response:", text);

            // Try to parse JSON
            let parsed: any;
            try {
                const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
                const jsonText = jsonMatch ? jsonMatch[1] : text;
                parsed = JSON.parse(jsonText);
            } catch (parseError) {
                console.error("JSON parse failed:", parseError);
                throw new Error("KI-Antwort konnte nicht verarbeitet werden");
            }

            // Validate structure
            if (!parsed.combatant1 || !parsed.combatant2 || !parsed.winner) {
                throw new Error("Ungültiges Antwortformat von der KI");
            }

            return parsed as BattleResult;

        } catch (error) {
            console.error("Battle analysis failed:", error);
            throw error;
        }
    };

    return Promise.race([battlePromise(), timeoutPromise]);
};
