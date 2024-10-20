import { Component, inject } from '@angular/core';
import { BookService } from '../../services/book.service';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { BookListComponent } from '../book-list/book-list.component';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [KeyValuePipe, BookListComponent, CdkAccordionModule, AsyncPipe],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.css'
})
export class CollectionListComponent {

  constructor(){
    this.bookCollections$.pipe(
      takeUntilDestroyed(), // BUENA PRÁCTICA: asegura que nos desuscribirnos del observable cuando el componente se destruye!
    ).subscribe({
      next: (valor) => {
        //console.log('El valor de next3: ', valor.entries() )
      },
      error: (err) => {
        //console.log('El valor de error3: ' + err);
      },
      complete: () => {
        //console.log('El valor de complete3');
      },
    });
  }
 
  private readonly _bookService = inject(BookService);

  public bookCollections$ = this._bookService.bookCollections$;

  public bookCollectionsSignal = toSignal(this._bookService.bookCollections$);
  
  // alternativamente, se puede convertir Singal en Observable y viceversa
  //public bookCollectionsSignal = this._bookService.bookCollectionsSignal;
  //public bookCollections$ = toObservable(this._bookService.bookCollectionsSignal);

  removeBookCollection(identifier: string): void {
    this._bookService.removeBookCollection(identifier);
  }

  removeBook(collectionIdentifier: string, bookIdentifier: string) {
    this._bookService.removeBook(collectionIdentifier, bookIdentifier);
  }

}
