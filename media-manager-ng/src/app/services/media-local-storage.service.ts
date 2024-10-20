import { Injectable } from '@angular/core';
import type { Media } from '../models/media.model';
import type { MediaCollection } from '../models/media-collection.model';
import { instanceToPlain } from 'class-transformer';
import type { DeserializationFn, MediaStorageService, TypeOfChange } from '../models/media-service.model';
import localForage from 'localforage';
import { catchError, from, map, tap, type Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaLocalStorageService implements MediaStorageService {
  // Map que contiene los almacenes de datos de localForage para cada tipo de objeto
  private readonly _stores = new Map<string, LocalForage>();

  constructor() {
    //console.log(`Initializing media local storage service`);
  }

  saveItem<T extends Media>(
    collection: Readonly<MediaCollection<T>>,
    mediaType: string,
    typeOfChange?: TypeOfChange,
    collectionItemOrId?: T | string,
    collectionId?: string,
  ): Observable<void> {
    const serializedVersion = instanceToPlain(collection, { excludePrefixes: ['_'] });
    //console.log('Serialized version: ', serializedVersion);

    const store = this._getStore(mediaType);

    return from(store.setItem(collection.identifier, serializedVersion)).pipe(
      tap((value) => {
        //console.log(`Saved the ${collection.name} collection successfully! Saved value: `, value);
      }),
      map(() => {
        return undefined;
      }),
      catchError((err) => {
        console.error(`Failed to save the ${collection.name} collection with identifier ${collection.identifier}. Error: ${err}`);
        throw new Error(err); // aunque también podemos gestionar el error aquí y devolver un valor por defecto
      }),
    );
  }

  getItem<T extends Media>(identifier: string, deserializerFn: DeserializationFn<T>, mediaType: string): Observable<MediaCollection<T>> {
    const store = this._getStore(mediaType);
    return from(store.getItem<any>(identifier)).pipe(
      map((value) => {
        //console.log('Found the collection: ', value);

        const retrievedCollection = deserializerFn(value);

        //console.log('Retrieved collection: ', retrievedCollection);
        return retrievedCollection;
      }),
      catchError((err) => {
        throw new Error(err); // dejar pasar el error
      }),
    );
  }

  getAllItems<T extends Media>(deserializerFn: DeserializationFn<T>, mediaType: string): Observable<MediaCollection<T>[]> {
    let accumulator: MediaCollection<T>[] = [];
    const store = this._getStore(mediaType);
    return from(
      store.iterate((value: string, key) => {
        const retrievedCollection = deserializerFn(value);
        accumulator.push(retrievedCollection);
      }),
    ).pipe(
      map((_value) => {
        return accumulator;
      }),
      catchError((err) => {
        console.error('Failed to retrieve the list of media collections. Error: ', err);
        throw new Error(err); // dejar pasar el error
      }),
    );
  }

  deleteItem(identifier: string, mediaType: string): Observable<void> {
    const store = this._getStore(mediaType);
    return from(store.removeItem(identifier)).pipe(
      tap(() => {
        //console.log(`Removed the ${identifier} collection successfully!`);
      }),
      catchError((err) => {
        console.error(`Failed to removed the ${identifier} collection`);
        throw new Error(err);
      }),
    );
  }

  private _getStore(type: string): LocalForage {
    if (!this._stores.has(type)) {
      // cada tipo de Media tiene su propio almacén de datos: https://github.com/localForage/localForage
      // las opciones de inicialización se describen aquí: https://localforage.github.io/localForage/#settings-api-config
      this._stores.set(
        type,
        localForage.createInstance({
          name: 'mediaManager',
          version: 1.0,
          storeName: `media-man-${type}`, // añadimos el nombre del tipo al nombre del almacén de objetos
          description: 'MediaManager data store',
        }),
      );
    }

    return this._stores.get(type) as LocalForage;
  }
}
