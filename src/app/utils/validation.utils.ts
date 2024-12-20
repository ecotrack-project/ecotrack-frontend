import { FormControl, Validators } from '@angular/forms';
import { FormGroupDirective, NgForm } from '@angular/forms';

// Funzione per creare un controllo di validazione email
export function createEmailFormControl(): FormControl {
    return new FormControl('', [
        Validators.required,
        Validators.email,
    ]);
}

// Funzione per creare un controllo di validazione password
export function createPasswordFormControl(): FormControl {
    return new FormControl('', [
        Validators.required,
        Validators.minLength(8),
    ]);
}
