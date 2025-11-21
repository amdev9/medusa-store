import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import Decimal from "decimal.js"

interface ExternalApiStepInput {
    // Define any input parameters if necessary, e.g., filters
    amount: string;
    from?: string;
    to?: string;
}

interface ExternalApiResponse {
    result: string,
    documentation: string,
    terms_of_use: string,
    time_last_update_unix: number,
    time_last_update_utc: string,
    time_next_update_unix: number,
    time_next_update_utc: string,
    base_code: string,
    target_code: string,
    conversion_rate: number,
    conversion_result: number
}

function calculateTotalRes(amount: string, data: ExternalApiResponse): string {
    // console.log("data", data)
    const price = new Decimal(amount);
    const conversion_rate = new Decimal(data.conversion_rate);

    // console.log("conversion_rate", conversion_rate)
    const total = price.times(conversion_rate);
    const totalRes = total.toFixed(2)
    return totalRes;
}

export const externalApiStep = createStep(
    "external-api-step",
    async (input: ExternalApiStepInput, { container }) => {
        const cachingModuleService = container.resolve(Modules.CACHING)

        const cacheKey = await cachingModuleService.computeKey({ from: input.from, to: input.to })
        const cachedValue = await cachingModuleService.get({ key: cacheKey });

        if (cachedValue) {
            const totalRes = calculateTotalRes(input.amount, cachedValue)

            return new StepResponse(totalRes)
        }

        // console.log(process.env.EXTERNAL_API_KEY)
        const fetchString = `https://v6.exchangerate-api.com/v6/${process.env.EXTERNAL_API_KEY}/pair/${input.from}/${input.to}`
        // console.log("fetchString", fetchString);
        const result = await fetch(fetchString);
        // console.log("result", result)
        if (result.ok) {
            const data = await result.json();

            await cachingModuleService.set({
                key: cacheKey,
                data: data,
            })

            const totalRes = calculateTotalRes(input.amount, data)

            return new StepResponse(totalRes)
        }
    }
)
