import { FastifyInstance,FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify"
import { CreateMeasurementController } from "./controllers/CreateMeasurementController"
import { ConfirmMeasurementController } from "./controllers/ConfirmMeasurementController"
import { ListCustomerMeasurementsController } from "./controllers/ListCustomerMeasurementsController"


export async function routes(fastify:FastifyInstance, options: FastifyPluginOptions) {
    
    fastify.post("/measurement", async (request:FastifyRequest, reply:FastifyReply) =>{
        return new CreateMeasurementController().handle(request, reply)
    })
    fastify.patch("/confirm", async (request:FastifyRequest, reply:FastifyReply) =>{
        return new ConfirmMeasurementController().handle(request, reply)
    })

    fastify.get("/:customer_code/list", async (request:FastifyRequest, reply:FastifyReply) =>{
        return new ListCustomerMeasurementsController().handle(request, reply)
    })
}