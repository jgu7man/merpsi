import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StubModel } from '../../../shared/stubs/stub.model';
import { StubService } from '../stub.service';

@Component({
  selector: 'app-stub-form-create',
  templateUrl: './stub-form-create.component.html',
  styleUrls: ['./stub-form-create.component.scss']
})
export class StubFormCreateComponent implements OnInit, OnDestroy {

  @Input() value?: StubModel
  currentIndex = 0

  @Output() saved: EventEmitter<any> = new EventEmitter()
  public stubForm = new FormGroup({
    starIndex: new FormControl('', [Validators.required]),
    endIndex: new FormControl('', [Validators.required]),
    currentIndex: new FormControl(0),
    prefix: new FormControl(''),
    name: new FormControl(''),
    active: new FormControl(''),
    type: new FormControl('')
  })


  constructor(
    private _stub: StubService,
  ) { }

  ngOnInit(): void {
    if (this.value) {
      let { index, ...value } = this.value
      this.stubForm.patchValue({ ...value })
      this.stubForm.controls.starIndex.disable()
      this.stubForm.controls.endIndex.disable()
      this.stubForm.controls.prefix.disable()
      this.stubForm.controls.type.disable()
    }
    this.stubForm.controls.currentIndex.disable()
  }

  onSubmit() {
    if (this.value) {
      this._stub.update({
        ...this.stubForm.getRawValue(),
        index: this.value.index
      })
      this.saved.emit()
      console.info('guardado update')
    } else {
      this._stub.add(this.stubForm.value)
      console.info('guardado add')
      this.saved.emit()
    }
    this.clean()

  }
  clean() {
    this.stubForm.patchValue({
      starIndex: '',
      endIndex: '',
      currentIndex: '',
      prefix: '',
      name: '',
      active: '',
      type: ''
       })
  }

  ngOnDestroy(): void {
   this.clean()
  }

}
