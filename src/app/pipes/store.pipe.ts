import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, find, map } from 'rxjs/operators';
import { FireDoc } from '../models/firestore.model';
import { iSede, SedeModel } from '../modules/admin/stores/sede.model';
import { SedesService } from '../modules/admin/stores/sedes.service';

@Pipe({
  name: 'store'
})
export class StorePipe implements PipeTransform {

  
  constructor (
    private _store: SedesService
  ){}

  transform(value: string, ...args: unknown[]): Observable<string> { 
    return this._store.listenAll().pipe(
      map< iSede[], string> ((store: iSede[]) => {
       let resp = store.find(( st:iSede ) => st.id == value)
       return resp ? resp.name : ''
      }),
    )
    //return this._store.listenAll()
  }

  // transform( type: SkillID, ...args:  ): Observable<iDetalleSkill[]> {
  //   return this._skills
  //   .list$.pipe(
  //       map( list => list?.filter( ( s: iDetalleSkill ) => s.tipo === type ) || [] ),
  //     )
  // }
}

function s<T>(s: any, arg1: (iSede: any) => any): import("rxjs").OperatorFunction<iSede[], iSede | null> {
  throw new Error('Function not implemented.');
}
