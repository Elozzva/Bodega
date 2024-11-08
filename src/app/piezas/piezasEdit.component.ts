import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PiezaService } from '../pieza.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-pieza-edit',
  templateUrl: './piezasEdit.component.html',
  styleUrls: ['./piezasEdit.component.css']
})
export class PiezasEditComponent implements OnInit {
  pieza = {
    nombre: '',
    descripcion: '',
    stockMinimo: 10
  };
  piezaId: string;

  constructor(
    private piezaService: PiezaService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.piezaId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.piezaService.getPiezaById(this.piezaId).subscribe(
      (data) => {
        this.pieza = data;
      },
      (error) => {
        this.notificationService.showError('Error al cargar la pieza');
        console.error('Error al cargar la pieza', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.piezaService.updatePieza(this.piezaId, this.pieza).subscribe(
        () => {
            this.notificationService.showSuccess('Pieza actualizada con éxito');
            this.router.navigate(['/piezas']);
        },
        (error) => {
            this.notificationService.showError('Error al actualizar la pieza');
            console.error('Error al actualizar la pieza', error);
        }
      );
    }
  }
}