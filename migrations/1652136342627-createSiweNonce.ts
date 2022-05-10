import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class createSiweNonce1652136342627 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'siwe_nonce',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true, // Auto-increment
            generationStrategy: 'increment',
          },
          {
            name: 'nonce',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'expirationDate',
            type: 'timestamp without time zone',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp without time zone',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp without time zone',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'siwe_nonce',
      new TableIndex({
        name: 'IDX_SIWE_NONCE_NONCE',
        columnNames: ['nonce'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('siwe_nonce');
  }
}
