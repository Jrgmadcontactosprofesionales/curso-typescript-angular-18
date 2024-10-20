import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewMediaCollectionComponent } from './components/new-media-collection/new-media-collection.component';
import { CustomButtonDirective } from './directives/custom-button.directive';
import { IfViewportDirective } from './directives/if-viewport.directive';
import { FormatTextPipe } from './pipes/format-text.pipe';
import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  KeyValuePipe,
  LowerCasePipe,
  NgFor,
  PercentPipe,
  SlicePipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { NewBookComponent } from './components/new-book/new-book.component';
import { BooksPageComponent } from './pages/books-page/books-page.component';
import { AuthenticationService } from './services/authentication.service';
import { UserType } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NewMediaCollectionComponent,
    CustomButtonDirective,
    IfViewportDirective,
    FormatTextPipe,
    TitleCasePipe,
    PercentPipe,
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    JsonPipe,
    SlicePipe,
    KeyValuePipe,
    NgFor,
    LowerCasePipe,
    UpperCasePipe,
    NewBookComponent,
    BooksPageComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'media-manager-ng';
  showComponent = true;
  prueba = 'valor inicial desde app component';

  private _authService = inject(AuthenticationService);

  constructor() {
    setTimeout(() => {
      this.prueba = 'otro valor dinamico';
    }, 3000);

    this._authService.simulateLogin(UserType.Admin).subscribe();
  }

  public toggleComponent() {
    this.showComponent = !this.showComponent;
  }

  public onCollectionReload(data: unknown) {
    //console.log('AppComponent: Collection reload event received', data);
  }

  public onButtonHovered(isHovered: boolean) {
    //console.log('button is hovered', isHovered);
  }
}
