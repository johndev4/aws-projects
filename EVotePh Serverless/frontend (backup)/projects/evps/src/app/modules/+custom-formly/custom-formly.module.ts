import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CheckboxComponent } from './types/checkbox/checkbox.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { BallotFormWrapperComponent } from './wrappers/ballot-form-wrapper/ballot-form-wrapper.component';

@NgModule({
  declarations: [CheckboxComponent, BallotFormWrapperComponent],
  imports: [
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'custom-checkbox',
          component: CheckboxComponent,
          defaultOptions: { defaultValue: false },
        },
      ],
      wrappers: [
        {
          name: 'custom-ballot-form-wrapper',
          component: BallotFormWrapperComponent,
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
