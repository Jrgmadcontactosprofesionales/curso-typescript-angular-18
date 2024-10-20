import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import type { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollectionNameValidator implements AsyncValidator {
  private _breakpointobserver = inject(BreakpointObserver);

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    //console.log('--- breakpointObserver', this._breakpointobserver);
    // simulamos la llamada asíncrona usando una Promise
    // En un proyecto real, esta función debería hacer una llamada a un servicio (lógica asíncrona)
    const validationPromise = new Promise<ValidationErrors | null>((resolve, _reject) => {
      setTimeout(() => {
        if (control.value === 'pepe') {
          resolve({ invalidCollectionName: true });
        } else {
          resolve(null);
        }
      }, 2000);
    });

    return validationPromise;
  }
}
