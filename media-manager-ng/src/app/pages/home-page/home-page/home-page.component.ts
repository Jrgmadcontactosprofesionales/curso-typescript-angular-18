import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  private readonly _router = inject(Router)

  // modo manual de navegar, en caso de no quere usar la directiva 'routerLink'
  public navigateTo(route: string) {
    this._router.navigate([route]);
  }
}
