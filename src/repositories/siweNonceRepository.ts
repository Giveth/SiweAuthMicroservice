import { SiweNonce } from '../entities/siweNonce';

export const findNonce = async (nonce: string): Promise<SiweNonce | null> => {
  return SiweNonce.createQueryBuilder('siweNonce')
    .where(`"siweNonce".nonce = :nonce`, { nonce: nonce })
    .getOne();
};
