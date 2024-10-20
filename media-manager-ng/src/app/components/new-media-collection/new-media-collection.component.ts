import type { OnChanges, SimpleChanges } from '@angular/core';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
  type ValidationErrors,
  type ValidatorFn,
} from '@angular/forms';
import { CollectionNameValidator } from '../../validators/collection-name.validator';
import { JsonPipe } from '@angular/common';
import { FormatTextPipe } from '../../pipes/format-text.pipe';
import { BookService } from '../../services/book.service';

export function invalidCharsValidator(regexToTest: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = regexToTest.test(control.value);

    if (isValid) {
      return null;
    } else {
      return {
        invalidChars: { value: control.value },
      };
    }
  };
}

const REGEX_NO_INVALID_CHARS = /^[^-*.,]*$/;

@Component({
  selector: 'app-new-media-collection',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormatTextPipe, JsonPipe],
  templateUrl: './new-media-collection.component.html',
  styleUrl: './new-media-collection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewMediaCollectionComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  // En ocasiones es mas conveniente usar un setter para desencadenar una lógica cuando cambia el valor de una input en concreto
  // en lugar de usar ngOnChanges, ya que ese hook contiene la información de TODOS los inputs que hayan cambiado (si se da el caso)
  @Input()
  public set inputName(value: string) {
    this.collectionName.setValue(value);
  }

  @Output()
  public reloadClicked = new EventEmitter<string>();

  @Output()
  public collectionCreated = new EventEmitter<string>();

  /*@ViewChild('nameInput')
  public nameInput: ElementRef<HTMLInputElement> | null = null;*/

  // private _cdRef = inject(ChangeDetectorRef);
  private _collectionNameValidator = inject(CollectionNameValidator);

  /*private sería lo mismo que #*/ #bookService = inject(BookService);

  public collectionName = new FormControl('', {
    nonNullable: true,
    validators: [
      // síncronos
      Validators.minLength(4),
      Validators.required,
      invalidCharsValidator(REGEX_NO_INVALID_CHARS),
    ],
    // IMPORTANTE: al poner el validador asíncrono, debemos pasar el contexto de la clase del mismo validador para que pueda acceder a sus propiedades
    // asyncValidators: [this._collectionNameValidator.validate.bind(this._collectionNameValidator)], // asíncronos
    updateOn: 'change', // las validaciones solo se ejecutarán cuando el control pierda el foco
  });

  constructor() {
    this.collectionName.statusChanges.subscribe((status) => {
      //console.log('Collection name status changed: ', status);
      /*//console.log('touched: ', this.collectionName.touched);
      //console.log('untouched: ', this.collectionName.untouched);
      //console.log('pristine: ', this.collectionName.pristine);
      //console.log('dirty: ', this.collectionName.dirty);*/
    });
  }

  public ngOnInit() {
    ////console.log('ngOnInit called!');
  }

  public ngAfterViewInit(): void {
    ////console.log('ngAfterViewInit called!');
    /*if (this.nameInput) {
      this.nameInput.nativeElement.value = this.name;
    }*/
  }

  public ngOnChanges(changes: SimpleChanges): void {
    ////console.log('ngOnChanges called!', changes);
  }

  public ngOnDestroy() {
    ////console.log('ngOnDestroy called!');
  }

  public createBookCollection() {
    ////console.log('Creating a new book collection...');
    if (!this.collectionName.valid) {
      console.warn('dato invalido', this.collectionName.value);
    }
    
    this.#bookService.createBookCollection(this.collectionName.value).then(()=> {
      this.collectionCreated.emit(this.collectionName.value);
      this.collectionName.reset('');
    });

  }

  public reloadBookCollections() {
    //console.log('Reloading book collections...');
    this.reloadClicked.emit('some data');
    this._resetInput();
  }

  /*public onNameChange(newValue: string) {
    this.inputName = newValue;
    //console.log('Name changed:', this.inputName);
  }*/

  private _resetInput() {
    //console.log('Resetting the form...');
    this.collectionName.reset();
    //setTimeout(() => {
    ////console.log('X secs delay...');
    //this.inputName = 'default value';
    //this.collectionName.setValue('inicio')
    //this.collectionName.reset(); // reset() es más conveniente para que que los estados 'touched' y 'dirty' vuelvan a su estado inicial
    //this._cdRef.markForCheck(); // ya no es necesario esto porque el FormControl se encarga de avisar a Angular de los cambios
    //}, 2000);
  }
}
