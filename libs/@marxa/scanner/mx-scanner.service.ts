import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MxScanner {

  openScanner$: Subject<any> = new Subject();
  codeScanned$: Subject<any> = new Subject();
  startScan$: Subject<null> = new Subject();
  constructor(
  ) { }


  scannedSuccess(result: any) {
    if (typeof result === 'string') {

    } else {

      this.codeScanned$.next(result)
    }
  }

  openScanner() {
    this.openScanner$.next()
    return this.openScanner$
  }

}
