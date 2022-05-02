import { CreateDonationRequest } from "../../types/requestResponses";
import { Application } from "../../entities/application";

export interface GivethIoInterface {
  createDonation( params: {
    inputData: CreateDonationRequest;
    application: Application;
  }): Promise<{donationId: number}>
}
