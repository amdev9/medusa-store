import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { calculateTotalRes, ExternalApiResponse } from "../utils/calculateTotalRes";


interface ExternalApiStepInput {
    // Define any input parameters if necessary, e.g., filters
    amount: string;
    from?: string;
    to?: string;
}

const EXTERNAL_URL = "https://v6.exchangerate-api.com/v6/";

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

        const externalFetchURL = `${EXTERNAL_URL}${process.env.EXTERNAL_API_KEY}/pair/${input.from}/${input.to}`

        const result = await fetch(externalFetchURL);

        if (result.ok) {
            const externalResponseData: ExternalApiResponse = await result.json();

            await cachingModuleService.set({
                key: cacheKey,
                data: externalResponseData,
            })

            const totalRes = calculateTotalRes(input.amount, externalResponseData)

            return new StepResponse(totalRes)
        }
    }
)
