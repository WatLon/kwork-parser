import { Order } from 'src/order/domain/entities/order.entity';
import { OrderOrmEntity } from '../models/order.orm-entity';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.value-object';
import { ClientInfo } from 'src/order/domain/value-objects/client-info.value-object';
import { Money } from 'src/shared/domain/value-objects/money.value-object';
import { OrderDescription } from 'src/order/domain/value-objects/order-description.value-object';
import { OrderTitle } from 'src/order/domain/value-objects/order-title.value-object';
import { UniqueEntityID } from 'src/shared/kernel/unique-entity-id';
import { Result } from 'src/shared/kernel/result';
import { Url } from 'src/order/domain/value-objects/url.value-object';

export class OrderMapper {
  static toDomain(OrderOrmEntity: OrderOrmEntity): Order {
    const titleResult = OrderTitle.create(OrderOrmEntity.title);
    const descriptionResult = OrderDescription.create(
      OrderOrmEntity.description,
    );
    const budgetResult = Money.create(OrderOrmEntity.budget);
    const externalUrlResult = Url.create(OrderOrmEntity.externalUrl);
    const clientInfoResult = ClientInfo.createFromRawData(
      OrderOrmEntity.clientInfo,
    );
    const statusResult = OrderStatus.create(OrderOrmEntity.status);

    const combinedResult = Result.combine([
      titleResult,
      descriptionResult,
      budgetResult,
      clientInfoResult,
      statusResult,
      externalUrlResult,
    ]);

    if (combinedResult.isFailure) {
      throw new Error(
        `Could not map order from persistence. Errors: ${combinedResult.error}`,
      );
    }

    return Order.reconstitute(
      {
        title: titleResult.value,
        description: descriptionResult.value,
        budget: budgetResult.value,
        clientInfo: clientInfoResult.value,
        status: statusResult.value,
        responses: OrderOrmEntity.responses,
        externalId: OrderOrmEntity.externalId,
        externalUrl: externalUrlResult.value,
      },
      new UniqueEntityID(OrderOrmEntity.id),
    );
  }

  static toPersistence(order: Order): OrderOrmEntity {
    const id = order.id.toString();
    const title = order.title.value;
    const description = order.description.value;
    const budget = order.budget.getProps();
    const clientInfo = {
      name: order.clientInfo.name,
      projectCount: order.clientInfo.projectCount,
      hiringRate: order.clientInfo.hiringRate.value,
    };
    const status = order.status.value;
    const responses = order.responses;
    const externalId = order.externalId;
    const externalUrl = order.externalUrl.value;
    return {
      id,
      title,
      description,
      budget,
      clientInfo,
      status,
      responses,
      externalId,
      externalUrl,
    };
  }
}
