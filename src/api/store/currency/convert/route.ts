import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import myWorkflow from "../../../../workflows/convert"

import { isValidCurrency } from "../../../../utils/isValidCurrency";

export interface QueryFields {
  amount?: string;
  from?: string;
  to?: string;
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // console.log(req.query)
  const { amount, from: fromCountryCode, to: toCountryCode } = req.query as {
    amount?: string;
    from?: string;
    to?: string;
  };

  // console.log("test -- ", amount, fromCountryCode, toCountryCode);

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

  const { result, errors } = await myWorkflow(req.scope)
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
      message: "Something unexpected happened. Please try again.",
    })
  }

  res.send(result)
}

