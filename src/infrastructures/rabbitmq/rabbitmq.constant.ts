export const RABBITMQ_EXCHANGES = {
  AUTH_EVENTS: 'auth.events',
  DEAD_LETTER_AUTH_EVENTS: 'auth.events.dlx',
};

export const RABBITMQ_EXCHANGE_TYPE = {
  TOPIC: 'topic',
};

export const RABBITMQ_QUEUES = {
  MAIL: {
    REGISTER: 'mailer.send.register.queue',
    FORGOT_PASSWORD: 'mailer.send.reset.queue',
    _DLQ: {
      REGISTER: 'mailer.send.register.dlq',
      FORGOT_PASSWORD: 'mailer.send.reset.dlq',
    },
  }
};

export const RABBITMQ_ROUTING_KEYS = {
  MAIL: {
    REGISTER: 'mailer.send.register',
    FORGOT_PASSWORD: 'mailer.send.reset',
  }
};
