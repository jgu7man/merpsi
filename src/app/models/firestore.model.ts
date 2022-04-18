import firebase from 'firebase/app'

export type FireDoc<T> = firebase.firestore.DocumentSnapshot<T>
export type FireRef<T> = firebase.firestore.DocumentReference<T>
export type FireTime = firebase.firestore.Timestamp

export const createDate = ( date: Date ) => firebase.firestore.Timestamp.fromDate( date )
export const firePush = ( value: any ) => firebase.firestore.FieldValue.arrayUnion( value )
export const txn = firebase.firestore().runTransaction