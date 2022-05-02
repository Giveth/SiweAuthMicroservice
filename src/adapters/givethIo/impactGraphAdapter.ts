import { Application } from "../../entities/application";
import { CreateDonationRequest } from "../../types/requestResponses";
import { GivethIoInterface } from "./givethIoInterface";
import { createBasicAuthentication } from "../../utils/authorizationUtils";
import axios from "axios";
import exp from "constants";
import { networkIds } from "../../utils/utils";
import { logger } from "../../utils/logger";
import { StandardError } from "../../types/StandardError";
import { errorMessagesEnum } from "../../utils/errorMessages";

const impactGraphBaseUrl = process.env.IMPACT_GRAPH_BASE_URL as string;

export class ImpactGraphAdapter implements GivethIoInterface {
  async createDonation(params: {
    inputData: CreateDonationRequest;
    application: Application;
  }): Promise<{ donationId: number }> {
    try {
      const basicAuth = createBasicAuthentication({
        secret: process.env.IMPACT_GRAPH_BASIC_AUTH_SECRET as string,
        username: process.env.IMPACT_GRAPH_BASIC_AUTH_USERNAME as string
      });
      const body = {
        fromWalletAddress: params.inputData.fromWalletAddress,
        toWalletAddress: params.inputData.toWalletAddress,
        valueUsd: params.inputData.priceUsd * params.inputData.amount,
        priceUsd: params.inputData.priceUsd,
        amount: params.inputData.amount,
        transactionId: params.inputData.txHash,
        transactionNetworkId: networkIds[params.inputData.network],
        isFiat: false,
        anonymous: params.inputData.anonymous,
        nonce: params.inputData.nonce,
        segmentNotified: false,
        currency: params.inputData.currency,

        //TODO we can support pending as well
        status: "verified",
        donationType: params.application.label
      };
      const result = await axios.post(
        `${impactGraphBaseUrl}/apigive/donations`,
        body,
        {
          headers: {
            authorization: basicAuth
          }
        }
      );
      return {
        donationId: result.data.id
      };
    } catch (e: any) {
      if (e.response && e.response.status === 400) {
        const error = new StandardError(errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR);
        error.description = e.response?.data?.message;
        throw  error;
      }
      logger.error("ImpactGraphAdapter.createDonation() error", e);
      throw e;
    }
  }
}
