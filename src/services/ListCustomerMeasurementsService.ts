import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface ListCustomerMeasurementsProps {
  customer_code: string
  measure_type?: string
}

class ListCustomerMeasurementsService {
  async execute({ customer_code, measure_type }: ListCustomerMeasurementsProps) {

    if (measure_type && !["WATER", "GAS"].includes(measure_type.toUpperCase())) {
      throw new Error("INVALID_TYPE: Measurement type not allowed")
    }

    const measures = await prisma.measurement.findMany({
      where: {
        customerId: customer_code,
        measure_type: measure_type ? measure_type.toUpperCase() : undefined,
      },
      select: {
        uuid: true,
        measure_datetime: true,
        measure_type: true,
        confirmed: true,
        image_url: true,
      },
    })

    if (measures.length === 0) {
      throw new Error("MEASURES_NOT_FOUND: No readings found")
    }

    return {
      customer_code,
      measures: measures.map(measure => ({
        measure_uuid: measure.uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.confirmed,
        image_url: measure.image_url,
      })),
    }
  }
}

export { ListCustomerMeasurementsService }
