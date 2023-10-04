import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddExpirationDateResetToMultisigSession1696397559095
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'multisig_session',
      new TableColumn({
        name: 'approvalExpirationDate',
        type: 'date',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('multisig_session', 'approvalExpirationDate');
  }
}
