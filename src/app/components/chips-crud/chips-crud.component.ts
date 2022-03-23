import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { COMMA, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';


@Component({
  selector: 'app-chips-crud',
  templateUrl: './chips-crud.component.html',
  styleUrls: ['./chips-crud.component.scss']
})
export class ChipsCrudComponent implements OnInit {

  @Input() label: string = ''
  @Input() hint: string = 'Escribe una palabra y agrega presionando COMA o TAB para que se agreguen a la lista.'
  @Input() listValue: any[] = []
  @Input() placeholder: string = ''

  @Output() change: EventEmitter<any[]> = new EventEmitter();

  readonly separatorKeysCodes = [ COMMA, TAB ] as const;

  constructor() { }

  ngOnInit(): void {
  }

  remove(item: any) {
    let index = this.listValue.indexOf(item);
    if (index >= 0) {
      this.listValue.splice(index, 1);
    }

    // this.enableForm = true;
  }

  add(event: MatChipInputEvent,) {
    const value = (event.value || '').trim();
    if (value !== '') {
      this.listValue.push(value);
      event.input.value = '';
    }
  }

}
