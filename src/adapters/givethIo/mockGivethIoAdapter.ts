import { GivethIoInterface } from './givethIoInterface';
import { CreateDonationRequest } from '../../types/requestResponses';
import { Application } from '../../entities/application';
import { generateRandomNumber } from '../../utils/utils';

export class MockGivethIoAdapter implements GivethIoInterface {
  createDonation(params: {
    inputData: CreateDonationRequest;
    application: Application;
  }): Promise<{ donationId: number }> {
    return Promise.resolve({ donationId: generateRandomNumber(10, 100) });
  }
}
