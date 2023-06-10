import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!(control instanceof FormGroup)) {
            return null;
        }

        const startDateControl = control.get('start_date');
        const endDateControl = control.get('end_date');

        if (!startDateControl || !endDateControl) {
            return null; // form group is not ready yet
        }

        const startDate = startDateControl.value;
        const endDate = endDateControl.value;
        const today = new Date();
        const start = new Date(startDate)
        if (start.getTime() < today.setHours(0, 0, 0, 0)) {
            startDateControl.setErrors({ 'startDateInvalid': true });
        }

        if (new Date(endDate) < new Date(startDate)) {
            endDateControl.setErrors({ 'endDateInvalid': true });
        }

        return null;
    };
}