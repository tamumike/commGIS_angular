import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SymbologyResolverService implements Resolve<any> {

constructor(private router: Router) { }

resolve(route: ActivatedRouteSnapshot) {
  return route.params['id'];
}
}
