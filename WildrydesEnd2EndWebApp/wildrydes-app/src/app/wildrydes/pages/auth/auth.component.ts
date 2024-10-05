import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `<mat-spinner></mat-spinner>`,
  styles: ``,
})
export class AuthComponent {}
