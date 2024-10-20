import { plainToClassFromExist } from 'class-transformer';
import { MediaCollection } from '../models/media-collection.model';
import type { Media } from '../models/media.model';
import { MEDIA_STORAGE_SERVICE, type MediaService, type TypeOfChange } from '../models/media-service.model';
import { inject } from '@angular/core';
import { catchError, lastValueFrom, map, type Observable } from 'rxjs';

export abstract class MediaServiceImpl<T extends Media> implements MediaService<T> {
  private readonly _mediaStorageService = inject(MEDIA_STORAGE_SERVICE);

  abstract mediaTypeName: string;

  constructor(private _type: Function) {
    //console.log(`Initializing media service for ${_type.name}`);
  }

  deserializeCollection = (serializedCollection: any): MediaCollection<T> => {
    return plainToClassFromExist<MediaCollection<T>, any>(new MediaCollection<T>(this._type, this.mediaTypeName), serializedCollection);
  };

  loadMediaCollection(identifier: string): Observable<MediaCollection<T>> {
    //console.log(`Trying to load media collection with the following identifier: ${identifier}`);

    return this._mediaStorageService.getItem(identifier, this.deserializeCollection, this.mediaTypeName);
  }

  saveMediaCollection(
    collection: Readonly<MediaCollection<T>>,
    typeOfChange: TypeOfChange = 'create-collection',
    collectionItemOrId?: T | string,
    collectionId?: string,
  ) {
    if (!collection) {
      throw new Error('The list cannot be null or undefined!');
    }

    //console.log(`Saving media collection with the following name ${collection.name}`);
    return lastValueFrom(this._mediaStorageService.saveItem(collection, this.mediaTypeName, typeOfChange, collectionItemOrId, collectionId));
  }

  getMediaCollectionIdentifiersList(): Observable<string[]> {
    //console.log('Retrieving the list of media collection identifiers');

    return this._mediaStorageService.getAllItems(this.deserializeCollection, this.mediaTypeName).pipe(
        map((collections) => {
          return collections.map((collection) => collection.identifier);
        }),
        catchError((err) => {
          throw new Error(err); // dejar pasar el error
        }),
      );
  }

  removeMediaCollection(identifier: string) {
    if (!identifier || '' === identifier.trim()) {
      throw new Error('The identifier must be provided!');
    }

    //console.log(`Removing media collection with the following identifier ${identifier}`);

    return lastValueFrom(this._mediaStorageService.deleteItem(identifier, this.mediaTypeName));
  }

  displayErrorMessage(errorMessage: string) {
    if (!errorMessage) {
      throw new Error('An error message must be provided!');
    }
    alert(errorMessage); // mala experiencia de usuario, pero ignoremos esto por ahora
  }
}
