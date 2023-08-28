import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateUser1693214462254 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: `uuid_generate_v4()`
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: 'email',
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: 'photo',
                        type: 'text',
                        isNullable: true,
                    },
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable("users")
    }

}
