import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { iStub, TYPE_STUB } from '../stub.model';
import { StubService } from '../stub.service';

@Component({
  selector: 'app-stub-selector',
  templateUrl: './stub-selector.component.html',
  styleUrls: ['./stub-selector.component.scss']
})
export class StubSelectorComponent implements OnInit {

  @Input() type: TYPE_STUB = 'sale'
  @Output() onSelect: EventEmitter<any> = new EventEmitter

  constructor(
    public stub: StubService
  ) { }

  ngOnInit(): void {
    this.stub.list$.pipe(
      ).subscribe( list => {
        let stubList: iStub[] = []
        list.forEach(d => {
            if (d.active && d.currentIndex < d.endIndex && d.type === this.type) {
              stubList.push(d)
            }
          })
          this.stub.stubList$.next(stubList)
      }) 
  }

  selectStub(data: MatSelectChange){
    console.log(data.value);
    
    const stub = this.stub.selectStub(data.value)
    this.onSelect.emit(stub)
  }

}
