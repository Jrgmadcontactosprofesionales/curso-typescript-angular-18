import { Directive, ElementRef, EventEmitter, HostListener, inject, Output, Renderer2, type OnInit } from '@angular/core';

@Directive({
  selector: 'button[type=button]',
  standalone: true,
  host: {
    '[class.is-hovered]': 'isHovered',
    '[style.borderRadius]': '"10px"',
    '[style.color]': '"white"',
    '[style.fontSize]': '"1rem"',
    '[style.fontWeight]': '"bold"',
  }
})
export class CustomButtonDirective implements OnInit {
  public isHovered = false;

  //private _elRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  //private _renderer = inject(Renderer2);

  @Output()
  public buttonHovered = new EventEmitter<boolean>();

  @HostListener('click', ['$event', '$event.srcElement'])
   public onClick(event: MouseEvent, element: HTMLButtonElement): void {
    //console.log('Button clicked!', event, element);
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    ////console.log('Mouse enter!');
    //this._elRef.nativeElement.classList.add('is-hovered');
    //this._renderer.addClass(this._elRef.nativeElement, 'is-hovered');
    this.isHovered = true;
    this.buttonHovered.emit(true);
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    //console.log('Mouse leave!');
    //this._elRef.nativeElement.classList.remove('is-hovered');
    //this._renderer.removeClass(this._elRef.nativeElement, 'is-hovered');
    this.isHovered = false;
    this.buttonHovered.emit(false);
  }

  ngOnInit(): void {
     //console.log('appCustomButton onInit!');
     // this._elRef.nativeElement.style.backgroundColor = 'red';
     /*this._elRef.nativeElement.style.borderRadius = '10px';
     this._elRef.nativeElement.style.color = 'white';
     this._elRef.nativeElement.style.fontSize = '1rem';
     this._elRef.nativeElement.style.fontWeight = 'bold';*/
  }
}
