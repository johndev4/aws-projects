import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
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
