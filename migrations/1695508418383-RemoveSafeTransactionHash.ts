import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveSafeTransactionHash1695508418383
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('multisig_session');
    if (!table) return;

    const safeTransactionHashColumnExists = table.columns.some(
      c => c.name === 'safeTransactionHash',
    );
    if (safeTransactionHashColumnExists) {
      await queryRunner.dropColumn('multisig_session', 'safeTransactionHash');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('multisig_session');
    if (!table) return;

    const safeTransactionHashColumnExists = table.columns.some(
      c => c.name === 'safeTransactionHash',
    );
    if (!safeTransactionHashColumnExists) {
      await queryRunner.addColumn(
        'multisig_session',
        new TableColumn({
          name: 'safeTransactionHash',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }
  }
}
