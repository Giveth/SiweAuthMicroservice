import { GivethService } from '../entities/givethService';

export const findGivethServiceByLabel = async (
  label: string,
): Promise<GivethService | null> => {
  return GivethService.createQueryBuilder()
    .where(`"serviceLabel" = :label`, {
      label: label,
    })
    .getOne();
};
