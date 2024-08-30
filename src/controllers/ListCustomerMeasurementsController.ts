import { FastifyRequest, FastifyReply } from "fastify"
import { ListCustomerMeasurementsService } from "../services/ListCustomerMeasurementsService"

class ListCustomerMeasurementsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { customer_code } = request.params as { customer_code: string };
    const { measure_type } = request.query as { measure_type?: string };

    const listCustomerMeasurementsService = new ListCustomerMeasurementsService()

    try {
      const result = await listCustomerMeasurementsService.execute({
        customer_code,
        measure_type,
      })

      reply.status(200).send(result)
    } catch (error) {
        const message = (error as Error).message

      if (message.startsWith("INVALID_TYPE")) {
        reply.status(400).send({
          error_code: "INVALID_TYPE",
          error_description: message,
        })

      } else if (message.startsWith("MEASURES_NOT_FOUND")) {
        reply.status(404).send({
          error_code: "MEASURES_NOT_FOUND",
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

export { ListCustomerMeasurementsController }
