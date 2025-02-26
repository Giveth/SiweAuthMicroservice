import { BlacklistedAddress } from "../entities/blacklistedAddress";

async function isBlacklisted(walletAddress: string): Promise<boolean> {
    const result = await BlacklistedAddress.query(
        `SELECT 1 FROM blacklisted_address WHERE LOWER(public_address) = LOWER($1) LIMIT 1`,
        [walletAddress]
    );
    return result.length > 0;
}

async function addToBlacklist(walletAddress: string): Promise<void> {
    await BlacklistedAddress.query(
        `INSERT INTO blacklisted_address (public_address) VALUES ($1)`,
        [walletAddress.toLowerCase()]
    );
}
