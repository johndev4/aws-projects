import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-checkbox',
  standalone: false,
  templateUrl: './checkbox.formly-field.html',
  styleUrl: './checkbox.formly-field.scss',
})
export class CheckboxFormlyField extends FieldType<FieldTypeConfig> {
  constructor() {
    super();
  }
}
