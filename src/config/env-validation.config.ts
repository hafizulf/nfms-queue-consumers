import { z, ZodError } from 'zod';

export const formatEnvErrors = (error: ZodError) => {
  return error.issues.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
}

export const EnvValidationSchema = z.object({
  APP_PORT: z
    .string()
    .regex(/^\d+$/, { message: 'PORT must be a number' })
    .transform(Number),
  RABBITMQ_URI: z.string(),
  MAIL_FROM: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
});

export const EnvValidationOptions = {
  strict: true,
  abortEarly: false,
};

export type Env = z.infer<typeof EnvValidationSchema>;
