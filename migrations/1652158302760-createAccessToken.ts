import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class createAccessToken1652158302760 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'access_token',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true, // Auto-increment
            generationStrategy: 'increment',
          },
          {
            name: 'jwt',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'jti',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'publicAddress',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'issuer',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'expirationDate',
            type: 'timestamp without time zone',
            isNullable: false,
          },
          {
            name: 'isBlacklisted',
            type: 'boolean',
            isNullable: false,
            default: 'false',
          },
          {
            name: 'isExpired',
            type: 'boolean',
            isNullable: false,
            default: 'false',
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
      'access_token',
      new TableIndex({
        name: 'IDX_ACCESS_TOKEN_JWT',
        columnNames: ['jwt'],
      }),
    );
    await queryRunner.createIndex(
      'access_token',
      new TableIndex({
        name: 'IDX_ACCESS_TOKEN_JTI',
        columnNames: ['jti'],
      }),
    );

    await queryRunner.addColumn(
      'access_token',
      new TableColumn({
        name: 'givethServiceId',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'access_token',
      new TableForeignKey({
        columnNames: ['givethServiceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'giveth_service',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('access_token');
    const foreignKey = table!.foreignKeys.find(
      fk => fk.columnNames.indexOf('givethServiceId') !== -1,
    );
    if (foreignKey)
      await queryRunner.dropForeignKey('access_token', foreignKey);
    await queryRunner.dropColumn('access_token', 'givethServiceId');
    await queryRunner.dropTable('access_token');
  }
}
