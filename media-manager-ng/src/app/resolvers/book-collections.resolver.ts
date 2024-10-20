import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BookService } from '../services/book.service';
import { delay, map, of, tap } from 'rxjs';
import type { MediaCollection } from '../models/media-collection.model';
import type { Book } from '../models/book.model';

export const bookCollectionsResolver: ResolveFn<Map<string, MediaCollection<Book>>> = (route, state) => {
  /*
  const bookService = inject(BookService);

  return bookService.reloadBookCollections().pipe(
    map(() => {
      const bookCollections = bookService.bookCollections;
      if (bookCollections.size > 0) {
        return bookCollections;
      }

      return new Map();
    }),
  );
  */

  return new Map(); // aunque realmente no nos interesa este valor de retorno porque ya no estamos usando el resolver ;)
};
