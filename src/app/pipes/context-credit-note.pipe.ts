import { Pipe, PipeTransform } from '@angular/core';
import { iCreditNote } from '../modules/finances/credit-note/creditNote.model';
import { iDebitNote } from '../modules/finances/debit-note/debit-note.model';

@Pipe({
  name: 'contextCreditNote'
})
export class ContextCreditNotePipe implements PipeTransform {

  transform(value:  any, ...args: unknown[]): unknown {
    return Object.keys(value).indexOf('context') === -1 ? '-' : value.context;
  }

}
