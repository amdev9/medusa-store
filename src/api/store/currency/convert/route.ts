import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils"

import convertWorkflowInput from "../../../../workflows/convert"
import { isValidCurrency } from "../../../../utils/isValidCurrency";

export interface QueryFields {
  amount?: string;
  from?: string;
  to?: string;
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {

  if (!req.query.amount) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "The `amount` query parameter is required."
    )
  }

  if (!req.query.from) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "The `from` query parameter is required."
    )
  }

  if (!req.query.to) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "The `to` query parameter is required."
    )
  }

  const { amount, from: fromCountryCode, to: toCountryCode } = req.query as QueryFields;

  // TODO: fetch GET https://v6.exchangerate-api.com/v6/YOUR-API-KEY/codes and put into isValidCurrency
  if (!amount || isNaN(Number(amount))) {
    res.status(400).json({ message: 'Initial amount not defined or not valid' });
    return;
  }

  if (!fromCountryCode || !isValidCurrency(fromCountryCode)) {
    res.status(400).json({ message: 'Initial country code not found or have invalid format' });
    return;
  }
  if (!toCountryCode || !isValidCurrency(toCountryCode)) {
    res.status(400).json({ message: 'Result country code not defined or have invalid format' });
    return;
  }

  const { result, errors } = await convertWorkflowInput(req.scope)
    .run({
      input: {
        amount: amount,
        from: fromCountryCode,
        to: toCountryCode,
      },
      throwOnError: false,
    })

  if (errors.length) {
    return res.send({
      message: "Something unexpected with convert workflow happened.",
    })
  }

  res.send(result)
}

