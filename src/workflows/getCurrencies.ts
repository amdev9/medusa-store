import { StepResponse, createStep } from "@medusajs/workflows-sdk";
import { Modules } from "@medusajs/framework/utils"

interface GetCurrenciesStepInput {
  // Define any input parameters if necessary, e.g., filters
  codes?: string[];
}

// TODO: implement instead isValidCurrency
export const getCurrenciesStep = createStep(
  "get-currencies-step",
  async (input: GetCurrenciesStepInput, { container }) => {

    const currencyModuleService = container.resolve(Modules.CURRENCY)

    const currencies = await currencyModuleService.listCurrencies(
      { code: input.codes }, // Apply filters from input
      { take: 50, skip: 0 } // Configure pagination if needed
    );

    return new StepResponse(currencies);
  }
);
