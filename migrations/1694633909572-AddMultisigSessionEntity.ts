import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddMultisigSessionEntity1694633909572
  implements MigrationInterface
{
  name = 'AddMultisigSessionEntity1694633909572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'multisig_session',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'multisigAddress',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'safeTransactionMessage',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'safeTransactionHash',
            type: 'varchar',
          },
          {
            name: 'network',
            type: 'int',
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'expirationDate',
            type: 'timestamp',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          {
            columnNames: ['safeTransactionHash', 'network'],
            isUnique: true,
          },
          {
            columnNames: ['multisigAddress'],
          },
          {
            columnNames: ['safeTransactionHash'],
          },
          {
            columnNames: ['network'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('multisig_session');
  }
}
