import prismaClient from "../prisma" 
import { GeminiAPI } from "./GeminiAPI"
import { validateBase64 } from "../utils/validateBase64"

interface CreateMeasurementProps {
    image: string
    customer_code: string
    measure_datetime: Date
    measure_type: 'WATER' | 'GAS'
}

class CreateMeasurementService {
    async execute({
        image,
        customer_code,
        measure_datetime,
        measure_type
    }: CreateMeasurementProps) {

        if (!image || !validateBase64(image)) {
            throw new Error("Invalid image. Must be a valid base64.")
        }

        if (!customer_code || !measure_datetime || !measure_type) {
            throw new Error("All fields must be filled.")
        }

        const existingMeasurement = await prismaClient.measurement.findFirst({
            where: {
                customerId: customer_code,
                measure_type,
                measure_datetime: {
                    gte: new Date(new Date(measure_datetime).setDate(1)), 
                    lte: new Date() 
                }
            }
        })

        if (existingMeasurement) {
            throw new Error("There is already a reading for this type of measurement this month.")
        }

        let geminiResponse
        try {
            geminiResponse = await GeminiAPI.extractValueFromImage(image);
        } catch (error) {
            console.error("Error communicating with the Gemini API:", (error as Error).message)
            throw new Error("Failed to get image value. Try again later.")
        }

        if (!geminiResponse) {
            throw new Error("Failed to obtain image value.")
        }

        const measurement = await prismaClient.measurement.create({
            data: {
                image_url: geminiResponse.image_url, 
                guid: geminiResponse.guid, 
                value: geminiResponse.value, 
                customerId: customer_code,
                measure_datetime,
                measure_type,
            }
        })

        return measurement
    }
}

export { CreateMeasurementService }
