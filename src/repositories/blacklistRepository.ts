import { BlacklistedAddress } from '../entities/blacklistedAddress';

export const isBlacklisted = async (
  walletAddress: string,
): Promise<boolean> => {
  const result = await BlacklistedAddress.query(
    `SELECT 1 FROM "blacklisted_address" WHERE LOWER("publicAddress") = LOWER($1) LIMIT 1`,
    [walletAddress],
  );
  return !!result[0];
};
