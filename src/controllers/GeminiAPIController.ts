import { GeminiAPI } from '../services/GeminiAPI'

async function processImage(base64Image: string) {
    try {
        const result = await GeminiAPI.extractValueFromImage(base64Image)
        console.log('Image processed successfully:', result)
        return result

    } catch (error) {
        console.error('Error processing image:', (error as Error).message)
        throw error
    }
}
