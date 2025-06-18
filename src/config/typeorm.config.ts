import { registerAs } from '@nestjs/config';
import { OrderOrmEntity } from 'src/order/infrastructure/persistence/models/order.orm-entity';
import { DataSourceOptions } from 'typeorm';

export default registerAs(
  'database',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT as string, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [OrderOrmEntity],
    synchronize: true,
    logging: ['error'],
  }),
);
