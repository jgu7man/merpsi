import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StubModel } from '../../stub.model';
import { StubService } from '../../stub.service';

@Component({
  selector: 'app-stub-form-create',
  templateUrl: './stub-form-create.component.html',
  styleUrls: ['./stub-form-create.component.scss']
})
export class StubFormCreateComponent implements OnInit {
  
  @Input() value?: StubModel

  @Output() save: EventEmitter<any> = new EventEmitter()
  public stubForm = new FormGroup( {
    starIndex: new FormControl( '', [ Validators.required ] ),
    endIndex: new FormControl( '', [ Validators.required ] ),
    currentIndex: new FormControl( 0),
    prefix: new FormControl( '' ),
    name: new FormControl( '' ),
    active: new FormControl( '')
  })

 
  constructor(
    private _stub: StubService,
  ) { }

  ngOnInit(): void {
    if ( this.value ) {
      let {index, ...value} = this.value
      this.stubForm.patchValue( { ...value })
      this.stubForm.controls.currentIndex.disable()
    }
  }

  onSubmit(){
    if ( this.value){
      this._stub.update({...this.stubForm.value,
                            index: this.value.index})
    }else {
      this._stub.add(this.stubForm.value)
      this.save.emit()
    }

  }

}
