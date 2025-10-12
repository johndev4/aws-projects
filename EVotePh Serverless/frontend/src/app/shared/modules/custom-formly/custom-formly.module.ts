import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { DefaultFormlyWrapper } from './wrappers/default/default.formly-wrapper';
import { CheckboxFormlyField } from './types/checkbox/checkbox.formly-field';

@NgModule({
  declarations: [DefaultFormlyWrapper, CheckboxFormlyField],
  imports: [
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'custom-checkbox',
          component: CheckboxFormlyField,
          defaultOptions: { defaultValue: false },
        },
      ],
      wrappers: [
        {
          name: 'custom-default-wrapper',
          component: DefaultFormlyWrapper,
        },
      ],
    }),
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
  ],
  exports: [FormlyModule],
})
export class CustomFormlyModule {}
