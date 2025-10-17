export enum EmailPurpose {
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export class MessageRegisterEmail {
  email: string;
  purpose: EmailPurpose;
  verifyUrl: string;
  expiresAt: string;
}

export class SendEmailPayload {
  mailTo: string;
  mailSubject: string;
  mailBody: string;
  type: string;
  options?: any;
}
