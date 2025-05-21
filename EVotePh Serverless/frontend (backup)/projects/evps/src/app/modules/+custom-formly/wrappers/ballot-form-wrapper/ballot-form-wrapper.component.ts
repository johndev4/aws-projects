import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'lib-ballot-form-wrapper',
  standalone: false,
  templateUrl: './ballot-form-wrapper.component.html',
  styleUrl: './ballot-form-wrapper.component.scss',
})
export class BallotFormWrapperComponent extends FieldWrapper implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
}
