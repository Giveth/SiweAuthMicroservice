import { MigrationInterface, QueryRunner } from 'typeorm';
import { SEED_DATA } from '../test/testUtils';
import { scopeLabels } from '../src/services/scopeService';

export class seedApplicationInLocalDb1651384117660
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!['development', 'test'].includes(process.env.NODE_ENV as string)) {
      console.log(
        'We just seed organization in development and test environments',
      );
      return;
    }
    await queryRunner.query(
      `
         INSERT INTO public.application(
         id, label, name, secret, logo,scopes, "isActive", "organizationId")
         VALUES (1, '${SEED_DATA.firstApplication.label}', '${SEED_DATA.firstApplication.name}', '${SEED_DATA.firstApplication.secret}', '${SEED_DATA.firstApplication.logo}', ARRAY ['${scopeLabels.CREATE_DONATION}'] , true, 1);
         `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            DELETE FROM application
        `,
    );
  }
}
