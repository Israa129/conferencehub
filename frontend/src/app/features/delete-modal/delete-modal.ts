import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-delete-modal',
  imports: [],
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.scss',
})
export class DeleteModal {
  @Input() isOpen = false;
  @Input() title = 'Confirmer la suppression';
  @Input() message = 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.';
  @Input() itemName = '';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}


