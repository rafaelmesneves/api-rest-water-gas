import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface ConfirmMeasurementProps {
  measure_uuid: string
  confirmed_value: number
}

class ConfirmMeasurementService {
  async execute({ measure_uuid, confirmed_value }: ConfirmMeasurementProps) {

    if (!measure_uuid || typeof measure_uuid !== "string") {
      throw new Error("INVALID_DATA: measure_uuid invalid")
    }
    if (typeof confirmed_value !== "number" || isNaN(confirmed_value)) {
      throw new Error("INVALID_DATA: confirmed_value invalid")
    }

    const measurement = await prisma.measurement.findUnique({
      where: { uuid: measure_uuid },
    })

    if (!measurement) {
      throw new Error("MEASURE_NOT_FOUND: Reading not found");
    }

    if (measurement.confirmed) {
      throw new Error(
        "CONFIRMATION_DUPLICATE: Reading already confirmed previously"
      )
    }

    const updatedMeasurement = await prisma.measurement.update({
      where: { uuid: measure_uuid },
      data: { confirmed_value, confirmed: true },
    })

    return updatedMeasurement;
  }
}

export { ConfirmMeasurementService }
