import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { iSede } from '../modules/admin/stores/sede.model';
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
  }
}
