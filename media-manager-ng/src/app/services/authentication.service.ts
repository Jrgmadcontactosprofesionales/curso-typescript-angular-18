import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User, UserType } from '../models/user.model';
import { delay, map, of, retry, timer, type Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _http = inject(HttpClient);

  private _currentUser: User | null = null;

  public get currentUser(): User | null {
    return this._currentUser;
  }

  simulateLogin(desiredUserType?: UserType): Observable<User> {
    console.log('---- simulateLogin');

    if (environment.storageType === 'local') {
      const mockUser: User = {
        id: '1',
        password: '123',
        username: 'Alguien desconocido',
        userType: UserType.Admin,
      };
      return of(mockUser);
    }

    return this._http.get<User[]>(`${environment.usersApiUrl}users`).pipe(
      map((users) => {
        if (desiredUserType) {
          return users.find((user) => user.userType === desiredUserType) as User;
        }

        this._currentUser = this._getRandomUser(users);
        //console.log('Simulating user login => user:', this._currentUser);
        return this._currentUser;
      }),
      retry({
        count: 3,
        delay: (error: any, retryCount: number) => {
          //console.log('---- retry, intento ', retryCount, error);
          return timer(Math.pow(retryCount, retryCount) * 1000); // retrasar 1seg más cada reintento
        },
      }),
    );
  }

  private _getRandomUser(array: User[]): User {
    return array[this._generateRandomInt(array.length - 1)];
  }

  private _generateRandomInt(maxValue: number): number {
    const positiveMaxValue = Math.max(0, maxValue);
    return Math.trunc(Math.random() * (positiveMaxValue + 1));
  }
}
