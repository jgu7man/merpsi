import firebase from 'firebase/app'

export type FireDoc<T> = firebase.firestore.DocumentSnapshot<T>
export type FireRef<T> = firebase.firestore.DocumentReference<T>
export type FireTime<T> = firebase.firestore.Timestamp
