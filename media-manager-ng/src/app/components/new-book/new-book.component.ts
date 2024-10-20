import { Component, effect, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Genre } from '../../constants/genre.constants';
import { Book } from '../../models/book.model';
import { AsyncPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import { BookService } from '../../services/book.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, KeyValuePipe, AsyncPipe],
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.css',
})
export class NewBookComponent implements OnInit {
  private readonly _bookService = inject(BookService);
  private readonly _currentRoute = inject(ActivatedRoute);

  public bookCollectionsSignal = this._bookService.bookCollectionsSignal;

  @Output()
  created: EventEmitter<Book> = new EventEmitter<Book>();

  myForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    genre: new FormControl('', [Validators.required]),
    numberOfPages: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    pictureLocation: new FormControl(''),
    description: new FormControl(''),
    collection: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  genres: string[] = [];

  constructor() {
    // Es recomendable crear los effect en el constructor (aunque es posible crearlos en otro sitio si fuese necesario)
    // https://angular.dev/guide/signals#injection-context
    effect(() => {
      const collectionsMap = this.bookCollectionsSignal();

      if (collectionsMap.size > 0) {
        const collections = Array.from(collectionsMap.values());
        this.myForm.controls.collection.setValue(collections[0].identifier);
      }
    });
  }

  ngOnInit() {
    for (const genreKey of Object.keys(Genre)) {
      this.genres.push(genreKey);
    }

    this.myForm.controls.pictureLocation.disable();

    // Por defecto selccionamos la primera colección
    // Si el usuario lo decide, puede elegir la colección que quiera
    /*of(true)
      .pipe(
        tap(() => {
          this._bookService.reloadBookCollections();
        }),
        delay(500),
        tap(() => {
          this.bookCollections = this._bookService.bookCollections;
          if (this.bookCollections.size > 0) {
            const collections = Array.from(this.bookCollections.values());
            this.myForm.controls.collection.setValue(collections[0].identifier);
          }
        }),
      )
      .subscribe();*/

    // Ahora podemos reemplazar el bloque de código de arriba porque ya podemos coger el listado de colecciones desde el resolver
    /*this.bookCollections = this._currentRoute.snapshot.data['collections'];
    if (this.bookCollections.size > 0) {
      const collections = Array.from(this.bookCollections.values());
      this.myForm.controls.collection.setValue(collections[0].identifier);
    }*/

    /*this._bookService.bookCollections$.subscribe((bookCollections) => {
      if (bookCollections.size > 0) {
        const collections = Array.from(bookCollections.values());
        this.myForm.controls.collection.setValue(collections[0].identifier);
      }
    });*/

    this.myForm.statusChanges.subscribe((status) => {
      //console.log('myForm status changed: ', status);
      /*//console.log('touched: ', this.myForm.touched);
      //console.log('untouched: ', this.myForm.untouched);
      //console.log('pristine: ', this.myForm.pristine);
      //console.log('dirty: ', this.myForm.dirty);*/
    });
  }

  createBook(): void {
    if (this.myForm.valid) {
      const rawValue: any = this.myForm.getRawValue();

      for (const key of Object.keys(rawValue)) {
        rawValue[key] = rawValue[key] === null ? undefined : rawValue[key];
      }

      const bookToCreate: Book = new Book(
        rawValue.name,
        rawValue.description === null ? undefined : rawValue.description,
        rawValue.pictureLocation === null ? undefined : rawValue.pictureLocation,
        Genre[rawValue.genre as keyof typeof Genre],
        rawValue.author,
        rawValue.numberOfPages,
      );

      this._bookService.createBook(this.myForm.controls.collection.value, bookToCreate).then(() =>{
        this.created.emit(bookToCreate);
        this.myForm.reset();
      });

    }
  }
}
