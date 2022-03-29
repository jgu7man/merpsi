import { Pipe, PipeTransform } from '@angular/core';
import { FireDoc } from '../models/firestore.model';

@Pipe({
  name: 'data'
})
export class DataPipe implements PipeTransform {

  transform(value: FireDoc<any>, ...args: unknown[]): unknown {
    return null;
  }

}
