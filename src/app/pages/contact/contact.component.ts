import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  // Field signals
  name    = signal('');
  email   = signal('');
  subject = signal('');
  message = signal('');

  // Touch tracking
  nameTouched    = signal(false);
  emailTouched   = signal(false);
  subjectTouched = signal(false);
  messageTouched = signal(false);

  // Submission state
  submitted = signal(false);

  // Computed validation
  nameError = computed(() =>
    this.nameTouched() && !this.name().trim() ? 'Name is required' : ''
  );

  emailError = computed(() => {
    if (!this.emailTouched()) return '';
    if (!this.email().trim()) return 'Email is required';
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email()) ? '' : 'Invalid email address';
  });

  subjectError = computed(() =>
    this.subjectTouched() && !this.subject() ? 'Please select a subject' : ''
  );

  messageError = computed(() =>
    this.messageTouched() && this.message().trim().length < 10
      ? 'Message must be at least 10 characters'
      : ''
  );

  get formValid(): boolean {
    return (
      !!this.name().trim() &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email()) &&
      !!this.subject() &&
      this.message().trim().length >= 10
    );
  }

  handleSubmit(): void {
    // Mark all fields as touched to trigger validation display
    this.nameTouched.set(true);
    this.emailTouched.set(true);
    this.subjectTouched.set(true);
    this.messageTouched.set(true);

    if (this.formValid) {
      this.submitted.set(true);
    }
  }
}
