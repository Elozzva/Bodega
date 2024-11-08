import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  // Mostrar un mensaje de éxito
  showSuccess(message: string): void {
    alert(`Éxito: ${message}`);
  }

  // Mostrar un mensaje de error
  showError(message: string): void {
    alert(`Error: ${message}`);
  }
}
