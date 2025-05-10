import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { S3Service } from '../../../services/s3.service';

@Component({
  selector: 'app-personal-storage',
  imports: [],
  standalone: true,
  templateUrl: './personal-storage.component.html',
  styleUrl: './personal-storage.component.scss',
})
export class PersonalStorageComponent implements OnInit {
  private readonly oidcidcSecurityService = inject(OidcSecurityService);
  private readonly http = inject(HttpClient);
  private readonly s3Service = inject(S3Service);

  ngOnInit(): void {
    this.s3Service.listUserFiles();

    // this.http
    //   .get('https://jsonplaceholder.typicode.com/todos/1')
    //   .subscribe((s) => {
    //     console.log('http result:', s);
    //   });
  }

  logoffAndRevokeTokens(): void {
    this.oidcidcSecurityService.logoffAndRevokeTokens().subscribe((result) => {
      console.log('logoff and revoke result:', result);
    });
  }

  logout(): void {
    this.oidcidcSecurityService.logoff().subscribe((result) => {
      console.log('logoff result:', result);
    });
  }
}
