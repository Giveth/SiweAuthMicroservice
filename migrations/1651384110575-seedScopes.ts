import { MigrationInterface, QueryRunner } from 'typeorm';
import { scopeLabels } from '../src/services/scopeService';

export class seedScopesInLocalDb1651384110575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            INSERT INTO scope(
            id, label, description)
            VALUES (1, '${scopeLabels.CREATE_DONATION}', 'Create donation in impact-graph db');
          `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM scope');
  }
}
