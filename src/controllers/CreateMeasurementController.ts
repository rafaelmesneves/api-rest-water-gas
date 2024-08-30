import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateMeasurementService } from '../services/CreateMeasurementService'

class CreateMeasurementController {

    async handle(request: FastifyRequest, reply: FastifyReply) {

        const { image, customer_code, measure_datetime, measure_type } = request.body as {
            image: string
            customer_code: string
            measure_datetime: Date
            measure_type: 'WATER' | 'GAS';
        }
 
        const measurementService = new CreateMeasurementService()

        try {
            const measurement = await measurementService.execute({
                image,
                customer_code,
                measure_datetime,
                measure_type
            })
            reply.send(measurement)

        } catch (error) {
            reply.status(400).send({})
        }
    }
}

export { CreateMeasurementController }
