import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { calculateTotalRes, ExternalApiResponse } from "../utils/calculateTotalRes";


interface ExternalApiStepInput {
    // Define any input parameters if necessary, e.g., filters
    amount: string;
    from?: string;
    to?: string;
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
            const data: ExternalApiResponse = await result.json();

            await cachingModuleService.set({
                key: cacheKey,
                data: data,
            })

            const totalRes = calculateTotalRes(input.amount, data)

            return new StepResponse(totalRes)
        }
    }
)
