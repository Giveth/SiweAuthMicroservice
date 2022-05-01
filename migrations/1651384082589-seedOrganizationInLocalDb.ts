import { MigrationInterface, QueryRunner } from 'typeorm';
import { SEED_DATA } from '../test/testUtils';

export class seedOrganizationInLocalDb1651384082589
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!['development', 'test'].includes(process.env.NODE_ENV as string)) {
      console.log(
        'We just seed organization in development and test environments',
      );
      return;
    }
    await queryRunner.query(`
            INSERT INTO public.organization(
            id, name, label, website, "isVerified", "isActive")
            VALUES (${SEED_DATA.firstOrganization.id}, '${SEED_DATA.firstOrganization.name}', '${SEED_DATA.firstOrganization.label}', '${SEED_DATA.firstOrganization.website}', true, true);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            DELETE FROM organization
        `,
    );
  }
}
