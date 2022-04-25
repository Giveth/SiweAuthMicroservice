import { Application } from "../entities/application";
import { CreateDonationRequest } from "../types/requestResponses";

export const createDonation = async (
  params: {
    inputData: CreateDonationRequest,
    application: Application
  }
):Promise<number>=>{
  throw new Error('not implemented' + JSON.stringify(params))
}
