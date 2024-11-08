import { Directive, Input, TemplateRef, ViewContainerRef, Type } from '@angular/core';

@Directive({
  selector: '[ngIfInstanceof]'
})
export class NgIfInstanceofDirective {
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  @Input() set ngIfInstanceof(condition: any) {
    if (typeof condition === 'string') {
      const expectedType = condition.split(':')[1].trim() as unknown as Type<any>;
      const isInstanceOf = (condition as any) instanceof expectedType;

      if (isInstanceOf) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    } else {
      console.error('ngIfInstanceof debe ser una cadena de texto');
      // Puedes agregar aquí una lógica adicional para manejar este caso, como por ejemplo,
      // mostrar un mensaje de error al usuario o realizar alguna otra acción.
    }
  }
}