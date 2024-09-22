import { CanActivateFn } from '@angular/router';

export const publicHomeRedirectGuard: CanActivateFn = (route, state) => {
  window.location.href = 'wildrydes.html';
  return false; // prevents Angular from continuing to load the route
};
