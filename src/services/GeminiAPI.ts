export class GeminiAPI {
    static async extractValueFromImage(base64Image: string) {
        const API_KEY = '' //Enter the Gemini API authentication key
        const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`

        interface GeminiAPIResponse {
            image_url: string
            guid: string
            value: number
        }

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `data:image/jpeg;base64,${base64Image}` 
                        }
                    ]
                }
            ]
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
        
            if (!response.ok) {
                throw new Error(`Error communicating with the Gemini API: ${response.status} - ${response.statusText}`)
            }
        
            const data = await response.json() as GeminiAPIResponse;
        
            return {
                image_url: data.image_url,
                guid: data.guid,
                value: data.value,
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error('Network error or request formatting error:', error.message)
            } else {
                throw new Error('An unknown error has occurred.')
            }
            throw error
        }
    }
}