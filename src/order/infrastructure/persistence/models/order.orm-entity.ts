import { RawClientInfoProps } from 'src/order/domain/value-objects/client-info.value-object';
import { MoneyProps } from 'src/shared/domain/value-objects/money.value-object';
import { OrderStatusEnum } from 'src/order/domain/value-objects/order-status.value-object';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class OrderOrmEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'jsonb' })
  budget!: MoneyProps;

  @Column()
  responses!: number;

  @Column()
  status!: OrderStatusEnum;

  @Column({ type: 'jsonb' })
  clientInfo!: RawClientInfoProps;

  @Column()
  @Index()
  externalId!: string;

  @Column()
  externalUrl!: string;
}
