import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NoteCredit, ProductNoteModel } from '../../credit-note/creditNote.model';
import { FooterService } from '../footer-invoice/footer.service';
import { FooterCreditoDebitoService } from './footer-notes.service';

@Component({
  selector: 'app-footer-notes',
  templateUrl: './footer-notes.component.html',
  styleUrls: ['./footer-notes.component.scss']
})
export class FooterCreditoDebitoComponent implements OnInit {

  formFooter: FormGroup = new FormGroup({
    discount: new FormControl(0),
    shipping: new FormControl(0),
  })
  @Input() concept?:NoteCredit.context

  
  constructor(
    public foot: FooterCreditoDebitoService,
  ) { }

  ngOnInit(): void {
    
  }

}
