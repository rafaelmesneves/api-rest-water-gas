import { FastifyRequest, FastifyReply } from "fastify"
import { ConfirmMeasurementService } from "../services/ConfirmMeasurementService"

class ConfirmMeasurementController {

  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { measure_uuid, confirmed_value } = request.body as {
      measure_uuid: string
      confirmed_value: number
    }

    const confirmMeasurementService = new ConfirmMeasurementService()

    try {
      const result = await confirmMeasurementService.execute({
        measure_uuid,
        confirmed_value,
      })
      reply.status(200).send({ success: true })

    } catch (error) {
      const message = (error as Error).message

      if (message.startsWith("INVALID_DATA")) {
        reply.status(400).send({
          error_code: "INVALID_DATA",
          error_description: message,
        })

      } else if (message.startsWith("MEASURE_NOT_FOUND")) {
        reply.status(404).send({
          error_code: "MEASURE_NOT_FOUND",
          error_description: message,
        })

      } else if (message.startsWith("CONFIRMATION_DUPLICATE")) {
        reply.status(409).send({
          error_code: "CONFIRMATION_DUPLICATE",
          error_description: message,
        })

      } else {
        reply.status(500).send({
          error_code: "SERVER_ERROR",
          error_description: "Server Error",
        })
      }
    }
  }
}

export { ConfirmMeasurementController };
