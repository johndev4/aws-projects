import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  appName = 'E-Vote PH';
  // constructor(private oidcSecurityService: OidcSecurityService) {}
  // ngOnInit(): void {
  //   this.oidcSecurityService.checkAuth().subscribe((loginResponse) => {
  //     const { isAuthenticated } = loginResponse ?? {};
  //     console.log('authenticated:', isAuthenticated ? '✔' : '❌');
  //   });
  // }
}
