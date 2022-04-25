export type CreateDonationRequest = {
  amount: number,
  currency: string,
  priceUsd: number
  fromWalletAddress: string,
  toWalletAddress: string,
  txHash: string,
  network: 'ropsten' | 'mainnet' | 'gnosis'
}
export type CreateDonationResponse = {
  donationId: number
}
