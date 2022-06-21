import { Pipe, PipeTransform } from '@angular/core';
import { iCreditNote } from '../modules/finances/credit-note/creditNote.model';
import { iDebitNote } from '../modules/finances/debit-note/debit-note.model';

@Pipe({
  name: 'isCreditNote'
})
export class IsCreditNotePipe implements PipeTransform {

  transform(value: iCreditNote | iDebitNote , ...args: unknown[]): string {
    return Object.keys(value).indexOf('context') === -1 ? 'Nota de Débito ' : 'Nota de Crédito'
  }

}
