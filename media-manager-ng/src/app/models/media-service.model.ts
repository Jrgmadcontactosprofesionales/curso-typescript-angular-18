import type { Observable } from 'rxjs';
import type { MediaCollection } from './media-collection.model';
import type { Media } from './media.model';
import { InjectionToken } from '@angular/core';

export type DeserializationFn<T extends Media> = (serializedCollection: any) => MediaCollection<T>;

export type TypeOfChange = 'create-collection-item' | 'remove-collection-item' | 'create-collection' | 'remove-collection';

export interface MediaService<T extends Media> {
  loadMediaCollection(identifier: string): Observable<MediaCollection<T>>;

  saveMediaCollection(
    collection: Readonly<MediaCollection<T>>,
    typeOfChange?: TypeOfChange,
    collectionItemOrId?: T | string,
    collectionId?: string,
  ): Promise<void>;

  getMediaCollectionIdentifiersList(): Observable<string[]>;

  removeMediaCollection(identifier: string): Promise<void>;

  deserializeCollection(serializedCollection: any): Readonly<MediaCollection<T>>;
}

export interface MediaStorageService {
  getItem<T extends Media>(getItem: string, deserializerFn: DeserializationFn<T>, mediaType: string): Observable<MediaCollection<T>>;

  saveItem<T extends Media>(
    collection: Readonly<MediaCollection<T>>,
    mediaType: string,
    typeOfChange?: TypeOfChange,
    collectionItemOrId?: T | string,
    collectionId?: string,
  ): Observable<void>;

  deleteItem(identifier: string, mediaType: string): Observable<void>;

  getAllItems<T extends Media>(deserializerFn: DeserializationFn<T>, mediaType: string): Observable<MediaCollection<T>[]>;
}

export const MEDIA_STORAGE_SERVICE = new InjectionToken<MediaStorageService>('MediaStorageService');
