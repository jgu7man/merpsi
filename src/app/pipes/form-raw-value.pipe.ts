import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'formRawValue'
})
export class FormRawValuePipe implements PipeTransform {

  transform(form: FormGroup, ...args: unknown[]): any {
    return form.getRawValue();
  }

}
