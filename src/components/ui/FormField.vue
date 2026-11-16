<template>
    <div class="form-field" :class="{'has-error': errors.length > 0}">
        <label :for="id" class="form-label">{{ label }}</label>
        <slot :invalid="errors.length > 0"/>
        <div v-for="error of errors" :key="error" class="invalid-feedback d-block">
            <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="me-1"/>
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    id: string
    label: string
    errors?: string[]
}>(), {
    errors: () => []
})
</script>

<style scoped>
.form-field + .form-field {
    margin-top: 1.125rem;
}

.invalid-feedback {
    font-weight: 500;
}
</style>
