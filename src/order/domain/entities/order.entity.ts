import { ClientInfo } from '../value-objects/client-info.value-object';
import { Money } from '../../../shared/domain/value-objects/money.value-object';
import { OrderDescription } from '../value-objects/order-description.value-object';
import { OrderTitle } from '../value-objects/order-title.value-object';
import { AggregateRoot } from 'src/shared/kernel/aggregate-root.base';
import { UniqueEntityID } from 'src/shared/kernel/unique-entity-id';
import {
  OrderStatus,
  OrderStatusEnum,
} from '../value-objects/order-status.value-object';
import { Result } from 'src/shared/kernel/result';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderApprovedEvent } from '../events/order-approved.event';
import { OrderRejectedEvent } from '../events/order-rejected.event';
import { Url } from '../value-objects/url.value-object';

export interface CreateOrderProps {
  title: OrderTitle;
  description: OrderDescription;
  budget: Money;
  responses: number;
  clientInfo: ClientInfo;
  externalId: string;
  externalUrl: Url;
}

export interface OrderProps {
  title: OrderTitle;
  description: OrderDescription;
  budget: Money;
  responses: number;
  clientInfo: ClientInfo;
  status: OrderStatus;
  externalId: string;
  externalUrl: Url;
}

export interface CreateFromRawDataOrderProps {
  title: string;
  description: string;
  budgetText: string;
  responses: number;
  clientName: string;
  clientProjectCount: number;
  clientHiringRate: number;
  externalId: string;
  externalUrl: string;
}

export class Order extends AggregateRoot<OrderProps> {
  private constructor(props: OrderProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static reconstitute(props: OrderProps, id: UniqueEntityID): Order {
    return new Order(props, id);
  }

  public static create(props: CreateOrderProps): Result<Order> {
    const orderProps: OrderProps = {
      ...props,
      status: OrderStatus.create(OrderStatusEnum.UNVIEWED).value,
    };

    const order = new Order(orderProps);

    order.addDomainEvent(
      new OrderCreatedEvent(order.id, {
        title: order.title.value,
        description: order.description.value,
        budget: order.budget.getProps(),
        responses: order.responses,
        clientInfo: {
          name: order.clientInfo.name,
          projectCount: order.clientInfo.projectCount,
          hiringRate: order.clientInfo.hiringRate.value,
        },
      }),
    );

    return Result.ok(order);
  }

  public static createFromRawData(
    rawData: CreateFromRawDataOrderProps,
  ): Result<Order> {
    const titleResult = OrderTitle.create(rawData.title);
    const descriptionResult = OrderDescription.create(rawData.description);
    const responses = rawData.responses;
    const budgetResult = Money.createFromString(rawData.budgetText);
    const externalUrlResult = Url.create(rawData.externalUrl);
    const clientInfoResult = ClientInfo.createFromRawData({
      name: rawData.clientName,
      projectCount: rawData.clientProjectCount,
      hiringRate: rawData.clientHiringRate,
    });

    const combinedResult = Result.combine([
      titleResult,
      descriptionResult,
      clientInfoResult,
      budgetResult,
      externalUrlResult,
    ]);

    if (combinedResult.isFailure) {
      return Result.fail(
        'Could not create order from raw data: ' + combinedResult.error,
      );
    }

    return Order.create({
      title: titleResult.value,
      description: descriptionResult.value,
      clientInfo: clientInfoResult.value,
      budget: budgetResult.value,
      responses,
      externalId: rawData.externalId,
      externalUrl: externalUrlResult.value,
    });
  }

  public approve(): Result<void> {
    if (!this.props.status.isUnviewed())
      return Result.fail('Order is not unviewed');
    this.props.status = OrderStatus.create(OrderStatusEnum.APPROVED).value;

    this.addDomainEvent(
      new OrderApprovedEvent(this.id, {
        title: this.title.value,
        description: this.description.value,
        budget: this.budget.getProps(),
        responses: this.responses,
        clientInfo: {
          name: this.clientInfo.name,
          projectCount: this.clientInfo.projectCount,
          hiringRate: this.clientInfo.hiringRate.value,
        },
        externalUrl: this.externalUrl.value,
      }),
    );
    return Result.ok();
  }

  public reject(): Result<void> {
    if (!this.props.status.isUnviewed()) {
      return Result.fail('Order is not unviewed');
    }

    this.props.status = OrderStatus.create(OrderStatusEnum.REJECTED).value;

    this.addDomainEvent(
      new OrderRejectedEvent(this.id, {
        title: this.title.value,
        description: this.description.value,
        budget: this.budget.getProps(),
        responses: this.responses,
        clientInfo: {
          name: this.clientInfo.name,
          projectCount: this.clientInfo.projectCount,
          hiringRate: this.clientInfo.hiringRate.value,
        },
      }),
    );
    return Result.ok();
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get title(): OrderTitle {
    return this.props.title;
  }
  get description(): OrderDescription {
    return this.props.description;
  }
  get budget(): Money {
    return this.props.budget;
  }
  get clientInfo(): ClientInfo {
    return this.props.clientInfo;
  }
  get status(): OrderStatus {
    return this.props.status;
  }

  get externalId(): string {
    return this.props.externalId;
  }

  get externalUrl(): Url {
    return this.props.externalUrl;
  }

  get responses(): number {
    return this.props.responses;
  }
}
