import firebase from 'firebase/app'

export interface iMail {
  to: string,
  message: iMailMessage,
  delivery?: iMailResponse,
}

export interface iMailMessage{
  subject: string,
  text?: string;
  html?: string;
}

export interface iMailResponse {
  attempts: number,
  endTime: firebase.firestore.Timestamp,
  error: string,
  leaseExpireTime: firebase.firestore.Timestamp | null,
  startTime: firebase.firestore.Timestamp,
  state: string,
}
