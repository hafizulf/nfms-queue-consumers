export class SendEmailPayload {
  mailTo: string;
  mailSubject: string;
  mailBody: string;
  type: string;
  options?: any;
}
