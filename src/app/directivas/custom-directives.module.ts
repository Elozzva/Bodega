import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIfInstanceofDirective } from './ng-if-instanceof.directive';

@NgModule({
  declarations: [NgIfInstanceofDirective],
  imports: [CommonModule],
  exports: [NgIfInstanceofDirective]
})
export class CustomDirectiveModule { }