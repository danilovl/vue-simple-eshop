import type {BaseValidation, ErrorObject} from '@vuelidate/core'
import transFilter from '@/filter/trans-filter'

function errorToMessage(error: ErrorObject): string {
    const params = error.$params as Record<string, unknown>

    switch (error.$validator) {
        case 'required':
            return transFilter('validation.required')
        case 'maxLength':
            return `${transFilter('validation.max_length')} ${params.max}`
        case 'minLength':
            return `${transFilter('validation.min_length')} ${params.min}`
        case 'email':
            return transFilter('validation.email')
        case 'decimal':
        case 'minValue':
            return transFilter('validation.number')
        case 'url':
            return transFilter('validation.url')
        case 'checked':
            return transFilter('validation.must_agree')
        default:
            return String(error.$message)
    }
}

export function fieldErrors(field: BaseValidation | undefined): string[] {
    if (!field || !field.$dirty) {
        return []
    }

    return field.$errors.map(errorToMessage)
}
