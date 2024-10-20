import { Expose, Type } from 'class-transformer';
import { Media } from './media.model';

export class MediaCollection<T extends Media> {
  private _identifier: string;
  private _name: string = '';
  private _typeName: string = '';
  private _collection: ReadonlyArray<T> = [];

  private readonly _type: Function;

  constructor(type: Function, typeName: string, name?: string, identifier?: string) {
    this._type = type;
    this._typeName = typeName;

    if (name) {
      this._name = name;
    }

    if (identifier) {
      this._identifier = identifier;
    } else {
      // esto solo es un ejemplo, en un proyecto real es mejor utilizar UUIDs
      // https://www.npmjs.com/package/uuid
      this._identifier = Math.random().toString(36).substr(2, 9);
    }
  }

  @Expose()
  get identifier() {
    return this._identifier;
  }

  set identifier(identifier: string) {
    this._identifier = identifier;
  }

  /**
   * Creamos este getter para que la versión serializada del objeto tenga el campo 'id' al igual que esta definido en nuestro API de Json Server
   */
  @Expose()
  get id() {
    return this._identifier;
  }

  @Expose()
  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  /**
   * Creamos este getter para que la versión serializada del objeto tenga el campo 'type' al igual que esta definido en nuestro API de Json Server
   */
  @Expose()
  get type(): string {
    return this._typeName.toLowerCase();
  }

  @Expose()
  @Type((options) => {
    if (options) {
      return (options.newObject as MediaCollection<T>)._type;
    } else {
      throw new Error('Cannot not determine the type because the options object is null or undefined');
    }
  })
  get collection(): ReadonlyArray<T> {
    return this._collection;
  }

  set collection(collection: ReadonlyArray<T>) {
    this._collection = collection;
  }

  addMedia(media: Readonly<T>) {
    if (media) {
      this._collection = this._collection.concat(media);
    }
  }

  removeMedia(itemId: string) {
    if (itemId) {
      this._collection = this._collection.filter((item) => {
        return item.identifier !== itemId;
      });
    }
  }
}
