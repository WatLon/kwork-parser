export const INJECTION_TOKENS = {
  ORDER_PARSER: 'IOrderParser',
  ORDER_REPOSITORY: 'IOrderRepository',
  TRANSACTION: 'ITransaction',
  EVENT_BUS: 'IEventBus',
  NOTIFICATION_CHANNELS: 'INotificationChannels[]',
  ORDER_INGESTION_POLICY: 'IOrderIngestionPolicy',
  AI_SERVICE: 'IAiService',
} as const;
