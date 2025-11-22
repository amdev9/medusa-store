import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { externalApiStep } from "./externalApiRedisStep"

export interface IConvertWorkflowInput {
  amount: string;
  from: string;
  to: string;
}

const convertWorkflowInput = createWorkflow(
  "convert",
  function (input: IConvertWorkflowInput) {
    // const str2 = getCurrenciesStep() 
    const externalData = externalApiStep(input)

    return new WorkflowResponse({
      message: externalData,
    })
  }
)

export default convertWorkflowInput