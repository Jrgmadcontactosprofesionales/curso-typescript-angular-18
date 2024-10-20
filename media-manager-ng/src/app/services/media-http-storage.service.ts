import { inject, Injectable } from '@angular/core';
import type { DeserializationFn, MediaStorageService, TypeOfChange } from '../models/media-service.model';
import { HttpClient } from '@angular/common/http';
import type { MediaCollection } from '../models/media-collection.model';
import { instanceToPlain } from 'class-transformer';
import type { Media } from '../models/media.model';
import { catchError, lastValueFrom, map, of, tap, type Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class MediaHttpStorageService implements MediaStorageService {
  private readonly _http = inject(HttpClient);

  private readonly _apiUrls: Record<string, string> = {
    'books': environment.booksApiUrl,
    'movies': environment.moviesApiUrl,
  };

  constructor() {
    //console.log(`Initializing media http storage service`);
  }

  saveItem<T extends Media>(
    collection: Readonly<MediaCollection<T>>,
    mediaType: string,
    typeOfChange: TypeOfChange = 'create-collection',
    collectionItemOrId?: T | string,
    collectionId?: string,
  ): Observable<void> {
    let endpoint = 'collections';

    if (typeOfChange === 'create-collection') {
      const serializedVersion = instanceToPlain(collection, { excludePrefixes: ['_'] });
      //console.log('Serialized version: ', serializedVersion);

      return this._http.post<void>(`${this._getUrlApi(mediaType)}${endpoint}`, serializedVersion).pipe(
        tap((value) => {
          //console.log(`Saved the ${collection.name} collection successfully! Saved value: `, value);
        }),
        catchError((err) => {
          console.error(`Failed to save the ${collection.name} collection with identifier ${collection.identifier}. Error: ${err}`);
          throw new Error(err);
        }),
      );
    }

    if (typeOfChange === 'create-collection-item' && collectionItemOrId) {
      endpoint = `${mediaType.toLowerCase()}s`;
      const serializedVersion = instanceToPlain(collectionItemOrId, { excludePrefixes: ['_'] });
      serializedVersion['collectionId'] = collectionId;
      //console.log('Serialized version: ', serializedVersion);

      return this._http.post<void>(`${this._getUrlApi(mediaType)}${endpoint}`, serializedVersion).pipe(
        tap((value) => {
          //console.log(`Saved the ${collection.name} collection successfully! Saved value: `, value);
        }),
        catchError((err) => {
          console.error(`Failed to save the ${collection.name} collection with identifier ${collection.identifier}. Error: ${err}`);
          throw new Error(err);
        }),
      );
    }

    if (typeOfChange === 'remove-collection-item' && collectionItemOrId) {
      endpoint = `${mediaType.toLowerCase()}s`;

      return this._http.delete<void>(`${this._getUrlApi(mediaType)}${endpoint}/${collectionItemOrId}`).pipe(
        tap((value) => {
          //console.log(
            //`Saved the item with id ${collectionItemOrId} successfully from collection with identifier ${collection.identifier}!`,
          //);
        }),
        catchError((err) => {
          console.error(
            `Failed to remove the item with id ${collection.name} from collection with identifier ${collection.identifier}. Error: ${err}`,
          );
          throw new Error(err);
        }),
      );
    }

    return of();
  }

  getItem<T extends Media>(identifier: string, deserializerFn: DeserializationFn<T>, mediaType: string): Observable<MediaCollection<T>> {
    const endpoint = `collections/${identifier}?_embed=${mediaType.toLowerCase()}s`;
    return this._http.get(`${this._getUrlApi(mediaType)}${endpoint}`).pipe(
      map((value) => {
        //console.log('Found the collection: ', value);

        const normalizedCollectionItems = (value as any)['books'].map((item: any) => {
          const { name, description, pictureLocation, genre, author, numberOfPages, id: identifier } = item; // TODO: definir interface para respuesta de API
          return { name, description, pictureLocation, genre, author, numberOfPages, identifier };
          // return { ...item, identifier: item.id }; // TODO: definir interface para respuesta de API
        });
        const { id: identifier, name, type } = value as any; // TODO: definir interface para respuesta de API
        const normalizedCollection = { identifier, name, type, collection: normalizedCollectionItems };

        // const normalizedCollection = { ...value, identifier: (value as any)['id'], collection: normalizedCollectionItems }; // TODO: definir interface para respuesta de API
        const retrievedCollection = deserializerFn(normalizedCollection);

        //console.log('Retrieved collection: ', retrievedCollection);
        return retrievedCollection;
      }),
      catchError((err) => {
        throw new Error(err); // dejar pasar el error
      }),
    );
  }

  getAllItems<T extends Media>(deserializerFn: DeserializationFn<T>, mediaType: string): Observable<MediaCollection<T>[]> {
    const endpoint = `collections?type=${mediaType.toLowerCase()}`;
    return this._http.get<any[]>(`${this._getUrlApi(mediaType)}${endpoint}`).pipe(
      map((collectionsArray) => {
        const retrievedCollections = collectionsArray.map((item) => {
          // const {id: identifier, name, type} = item; // TODO: definir interface para 'value'
          // const normalizedCollection = {identifier, name, type};
          const normalizedCollection = { ...item, identifier: item.id }; // TODO: definir interface para respuesta de API
          return deserializerFn(normalizedCollection);
        });

        //console.log('Retrieved collection: ', retrievedCollections);
        return retrievedCollections;
      }),
      catchError((err) => {
        console.error('Failed to retrieve the list of media collections. Error: ', err);
        throw new Error(err); // dejar pasar el error
      }),
    );
  }

  /**
   * Deletes a collection from DB
   */
  deleteItem(identifier: string, mediaType: string): Observable<void> {
    const endpoint = `collections`;
    return this._http.delete<void>(`${this._getUrlApi(mediaType)}${endpoint}/${identifier}`).pipe(
      tap(() => {
        //console.log(`Removed the ${identifier} collection successfully!`);
      }),
      catchError((err) => {
        console.error(`Failed to removed the ${identifier} collection`);
        throw new Error(err);
      }),
    );
  }

  private _getUrlApi(mediaType: string): string {
    const pluralMediaType = `${mediaType.toLowerCase()}s`; // pluralizamos el media type: 'book' -> 'books'
    return this._apiUrls[pluralMediaType];
  }

}
