import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MxImportDialog, MxStorage } from '@marxa/storage';
import firebase from 'firebase/app'
import { MxBatchErrorModel } from './batch.model';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  batchArray: (firebase.firestore.WriteBatch)[] = [];
  batchIndex:  number = 0;
  batchAmount: number = 0;
  count: number = 0;
  batchLength: number = 0;

  constructor (
    private _afs: AngularFirestore,
    private _storage: MxStorage,
    private _dialog: MatDialog,
  ) {
  }

  async init( batchLength: number ) {
    this._storage.recordsLength = this.batchLength = batchLength
    this.batchArray.push( this._afs.firestore.batch() );
    this._dialog.open( MxImportDialog, {
      minWidth: '50%',
      maxWidth: '80%',
      disableClose: true
    } )
    return
  }

  async set(
    documentRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>,
    data: Partial<firebase.firestore.DocumentData>,
    options: firebase.firestore.SetOptions
  ) {
    try {
      this.count = this._storage.recordsReaded$.getValue();
      this.count++;
      this.batchAmount++

      this._storage.importState$.next( `Guardando ${ Math.floor(( this.count * 100 ) / this.batchLength )}%` )

      this.batchArray[ this.batchIndex ].set( documentRef, data, options );
      this._storage.recordsReaded$.next( this.count )

      await this.waitFor( this.batchAmount >= 499 ? 1000 : 50 )
      await this._counting()

      return
    } catch ( error: any ) {
      console.error(error);
      this._storage.closeImportDialog$.next()
      this._storage.recordsReaded$.next( this.count )
      error[ 'record' ] = data
      throw new MxBatchErrorModel(`ERROR en registro ${ this.count + 1 }: ` + error.message, error)
    }
  }

  async update(
    documentRef: firebase.firestore.DocumentReference<any>,
    data: firebase.firestore.UpdateData
  ) {
    try {
      this.count = this._storage.recordsReaded$.getValue();
      this.count++;
      this.batchAmount++

      this._storage.importState$.next( `Guardando ${ Math.floor(( this.count * 100 ) / this.batchLength )}%` )
      this.batchArray[ this.batchIndex ].update(documentRef, data);
      this._storage.recordsReaded$.next( this.count )

      await this.waitFor( this.batchAmount >= 499 ? 1000 : 50 )
      await this._counting()
      return
    } catch ( error: any ) {
      console.error(error);
      this._storage.closeImportDialog$.next()
      this._storage.recordsReaded$.next( this.count )
      error[ 'record' ] = data
      throw new MxBatchErrorModel(`ERROR en registro ${ this.count + 1 }: ` + error.message, error)
    }
  }

  async delete(
    documentRef: firebase.firestore.DocumentReference<any>
  ) {
    try {
      this.count = this._storage.recordsReaded$.getValue();
      this.count++;
      this.batchAmount++

      this._storage.importState$.next(
        `Guardando ${ Math.floor( ( this.count * 100 ) / this.batchLength ) }%` )
      this.batchArray[ this.batchIndex ].delete(documentRef );
      this._storage.recordsReaded$.next( this.count )

      await this.waitFor( this.batchAmount >= 499 ? 1000 : 50 )
      await this._counting()
      return
    } catch ( error: any ) {
      console.error(error);
      this._storage.closeImportDialog$.next()
      this._storage.recordsReaded$.next( this.count )
      error[ 'record' ] = documentRef.path
      throw new MxBatchErrorModel(`ERROR en registro ${ this.count + 1 }: ` + error.message, error)
    }
  }

  private async _counting() {
    try {

      console.log( this.batchLength , this.count, this.batchLength === this.count  )
      if ( this.batchAmount >= 499 ) {
        console.log( `Se llenó el lote ${this.batchIndex}: ${this.batchAmount}` )

        this._storage.importState$.next( `Cargando a base de datos: Lote ${ this.batchIndex + 1 }` )
        await this.batchArray[ this.batchIndex ].commit()
        this.batchArray.push(this._afs.firestore.batch());
        this.batchIndex++;
        this.batchAmount = 0
        await this.waitFor( 2000 )

      } else if ( this.batchLength === this.count ) {
        console.log( 'Se completó la cantidad de registros: '+ this.count )
        this._storage.importState$.next( `Cargando a base de datos: Lote ${ this.batchIndex + 1 }` )
        await this.batchArray[ this.batchIndex ].commit()
        this.batchArray = []
        this.batchIndex = 0;
        this.batchAmount = 0
        await this.waitFor( 2000 )

        this._storage.importState$.next(`${this.batchLength} registros cargados`)
        this._storage.recordsReaded$.next( 0 )
        this._storage.uploadComplete$.next()
      }
      return
    } catch ( error ) {
      console.error( error )
      throw error
    }
  }

  async commitRest() {
    if ( this.batchAmount < 499 ) {
      const lastBatchIndex = this.batchArray.length - 1
      this._storage.importState$.next( `Cargando último lote` )
      await this.batchArray[lastBatchIndex].commit()
      await this.waitFor(2000)
    }
  }

  async runBigBatch( records: iBatchRecord[] ) {
    console.log( records )
    const batchArray: (firebase.firestore.WriteBatch)[] = [];
    batchArray.push( this._afs.firestore.batch() );
    let batchIndex:  number = 0;
    let batchAmount: number = 0;
    let count: number = 0;

    this._storage.recordsLength = records.length
    this._dialog.open( MxImportDialog, {
      minWidth: '50%',
      maxWidth: '80%',
      disableClose: true
    } )

    try {
      await this.asyncForEach( records,
        async ( record: iBatchRecord, index: number ) => {
          try {

            // UPDATE COUNT
            count = this._storage.recordsReaded$.getValue();
            count++;
            batchAmount++
            this._storage.importState$.next( `Procesando fila ${ count }` )

            console.log( record.writeKind, record.data )

            // READ RECORD
            switch (record.writeKind) {
              case 'set':
                batchArray[batchIndex].set(record.documentRef, {...record.data}, { merge: true})
                break;

              case 'update':
                batchArray[batchIndex].update(record.documentRef, {...record.data})
                break;

              case 'delete':
                batchArray[batchIndex].delete(record.documentRef,)
                break;
            }

            this._storage.recordsReaded$.next(count)
            await this.waitFor( 50 )
            console.log( count, records.length )

            // COMMIT CURRENT FULL BATCH
            if ( batchAmount === 499 ) {
              this._storage.importState$.next( `Cargando a base de datos: Lote ${ batchIndex +1 }` )
              await batchArray[batchIndex].commit()
              batchArray.push(this._afs.firestore.batch());
              batchIndex++;
              batchAmount = 0
              await this.waitFor(2000)
            }

            return
        } catch (error: any) {
          this._storage.closeImportDialog$.next()
          this._storage.recordsReaded$.next( count )
          error[ 'record' ] = record
          console.error(error)
          throw new MxBatchErrorModel(`ERROR en registro ${index + 1 }: `+ error.message, error)
        }
        } )

        if ( count === records.length ) {
          console.log( 'Cargando' )
          this._storage.importState$.next( `Cargando a base de datos: Lote ${ batchIndex + 1 }` )
          await batchArray[ batchIndex ].commit()
          await this.waitFor(2000)
        }


      this._storage.importState$.next(`${count} registros cargados`)
      this._storage.recordsReaded$.next( count )
      this._storage.uploadComplete$.next()
      this._storage.clearDropzone$.next()
    } catch (error: any) {
      console.error(error)
      this._storage.recordsReaded$.next( count )
      this._storage.importState$.next(`Error, sólo se cargaron ${count}`)
      this._storage.clearDropzone$.next()
      this._storage.closeImportDialog$.next()
      this._storage.recordsReaded$.next( 0 )
      if ( 'message' in error ) throw error
      else throw new MxBatchErrorModel(`ERROR en registro ${ this.count }: ` + error.message, error)
    }
  }

  /** Create a delay in promises
   * @param {number} ms Miliseconds to waitFor
   */
   private waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));


   /** Generate a promise that iterates any array or Map
    * @param {(any[] | Map<number, any>)} array Any array or Map
    * @param {*} callback Function to do
    */
   private async asyncForEach<T>( array: T[] | Map<number, T>,
     callback: ( item: T, i: number, a?: T[] ) => any ) {
     if (Array.isArray(array)) {
       for (let index = 0; index < array.length; index++) {
         await callback(array[index], index, array);
       }
     } else {
       for (let index = 0; index < array.size; index++) {
         await callback(array.get(index) as T, index);
       }
     }
   }
}



export interface iBatchRecord {
  writeKind: 'set' | 'update' | 'delete',
  documentRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>,
  data?: Partial<firebase.firestore.DocumentData>,
}
