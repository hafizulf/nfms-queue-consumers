export const RABBITMQ_EXCHANGES = {
  AUTH_EVENTS: 'auth.events',
};

export const RABBITMQ_EXCHANGE_TYPE = {
  TOPIC: 'topic',
};

export const RABBITMQ_QUEUES = {
  MAIL: {
    REGISTER: 'mailer.send.register.queue',
    FORGOT_PASSWORD: 'mailer.send.reset.queue',
  }
};

export const RABBITMQ_ROUTING_KEYS = {
  MAIL: {
    REGISTER: 'mailer.send.register',
    FORGOT_PASSWORD: 'mailer.send.reset',
  }
};
