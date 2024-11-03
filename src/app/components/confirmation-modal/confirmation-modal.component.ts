import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirm Application</h4>
      <button type="button" class="close" aria-label="Close" (click)="cancel()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to submit your application for "{{ jobTitle }}"?</p>
      <p>Name: {{ applicantData.name }}</p>
      <p>Email: {{ applicantData.email }}</p>
      <p>Phone: {{ applicantData.phone }}</p>
      <p>School: {{ applicantData.school }}</p>
      <p>Grade: {{ applicantData.grade }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="confirm()">Confirm</button>
      <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
    </div>
  `
})
export class ConfirmationModalComponent {
  @Input() applicantData: any;
  @Input() jobTitle: string='';

  constructor(public activeModal: NgbActiveModal) {}

  openModal() {
    // Add inert attribute to background content when modal opens
    document.getElementById('backgroundContent')?.setAttribute('inert', '');
    // Set focus to the modal
    const modal = document.querySelector('.modal') as HTMLElement;
    modal?.focus();
  }
  
  closeModal() {
    // Remove inert attribute when modal closes
    document.getElementById('backgroundContent')?.removeAttribute('inert');
  }

  confirm() {
     // Display submission complete message
     alert('Your submission is complete.');
     this.activeModal.close('confirm');
  }

  cancel() {
    this.activeModal.dismiss('cancel');
  }
}
