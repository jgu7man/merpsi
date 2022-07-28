import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FooterNoteModel } from '../../credit-note/creditNote.model';

@Injectable({
  providedIn: 'root'
})
export class FooterCreditoDebitoService {

  footer$ = new BehaviorSubject<FooterNoteModel | null>(null)

  constructor(
  ) { }
}
