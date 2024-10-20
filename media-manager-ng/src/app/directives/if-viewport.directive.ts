import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Directive, inject, Input, type OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appIfViewport]',
  standalone: true,
})
export class IfViewportDirective implements OnInit {

  @Input('appIfViewport')
  public viewport: keyof typeof Breakpoints = "Large";

  @Input()
  public appIfViewportElse?: TemplateRef<any>;

  private _viewportMatched = false;

  private readonly _breakpointObserver = inject(BreakpointObserver);
  private readonly _vcRef = inject(ViewContainerRef);
  private readonly _templateRef = inject<TemplateRef<any>>(TemplateRef);

  public ngOnInit(): void {
    this._breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe((breakpointChanges) => {
      // console.warn('Viewport change detected!', breakpoints);
      const watchedBreakpoint = Breakpoints[this.viewport];
      //console.log(`Watching viewport ${watchedBreakpoint}`, breakpointChanges.breakpoints);

      const breakpoints = breakpointChanges.breakpoints;

      for (const key in breakpoints) {
        if (key === watchedBreakpoint) {
          this._viewportMatched = breakpoints[key] === true;
          if (this._viewportMatched) {
            console.warn(`Viewport ${this.viewport} matches: ${this._viewportMatched}`);
            this._updateView(this._viewportMatched);
            break;
          }
        }
      }

      if (!this._viewportMatched) {
        this._updateView(false);
      }
    });
  }

  private _updateView(viewportMatched: boolean) {
    this._vcRef.clear();

    if (viewportMatched) {
      this._vcRef.createEmbeddedView(this._templateRef);
    } else if (this.appIfViewportElse) {
      this._vcRef.createEmbeddedView(this.appIfViewportElse);
    }
  };
}
