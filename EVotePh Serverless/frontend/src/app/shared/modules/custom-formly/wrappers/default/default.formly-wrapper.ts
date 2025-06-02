import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-default',
  standalone: false,
  templateUrl: './default.formly-wrapper.html',
  styleUrl: './default.formly-wrapper.scss',
})
export class DefaultFormlyWrapper extends FieldWrapper implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
}
