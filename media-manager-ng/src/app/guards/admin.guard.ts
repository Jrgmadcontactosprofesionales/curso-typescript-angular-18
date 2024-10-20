import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';
import { UserType } from '../models/user.model';
import { map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  //console.log('--- adminGuard called!', route, state);
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  let currentUser$ = of(authService.currentUser);

  // IMPORTANTE: puede ser que cuando este guard se ejecute aún no se haya ejecutado nuestra lógica simulada de login
  // En ese caso la hacemos aquí
  if (authService.currentUser == null) {
    currentUser$ = authService.simulateLogin(UserType.Admin);
  }

  return currentUser$.pipe(
    map((user) => {
      const canContinue = !!user && user.userType === UserType.Admin;

      if (!canContinue) {
        console.warn('--- adminGuard: user unauthorized!');
        return router.createUrlTree(['']); // le devolvemos la ruta a donde debe redirigir
      }

      return canContinue;
    }),
  );

  /*
  const canContinue = !!authService.currentUser && authService.currentUser.userType === UserType.Admin;

  if (!canContinue) {
    console.warn('--- adminGuard: user unauthorized!');
    return router.createUrlTree(['']); // le devolvemos la ruta a donde debe redirigir
  }

  return canContinue;
  */
};
