import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FooterNoteModel } from '../../credit-note/creditNote.model';
import { TaxesService } from '../../taxes/taxes.service';

@Injectable({
  providedIn: 'root'
})
export class FooterCreditoDebitoService {

  footer$ = new BehaviorSubject<FooterNoteModel | null>(null)

  constructor(
    private _taxes: TaxesService
  ) { }
}
