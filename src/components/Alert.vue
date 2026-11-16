<template>
    <div class="toast-stack" aria-live="polite">
        <transition-group name="toast">
            <div
                v-for="alert in alertStore.alerts"
                :key="alert.id"
                class="app-toast"
                :class="variant(alert.type).className"
                role="status"
            >
                <span class="app-toast-icon">
                    <font-awesome-icon :icon="variant(alert.type).icon"/>
                </span>
                <span class="app-toast-text">{{ alert.text }}</span>
                <button
                    type="button"
                    class="app-toast-close"
                    :aria-label="$filters.transFilter('btn.close')"
                    @click="alertStore.removeAlert(alert.id)"
                >
                    <font-awesome-icon icon="fa-solid fa-xmark"/>
                </button>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import AlertConstant from '@/constant/alert-constant'
import {useAlertStore} from '@/store/module/alert'

type Variant = {
    icon: string;
    className: string;
}

const alertStore = useAlertStore()

const INFO_VARIANT: Variant = {icon: 'fa-solid fa-circle-info', className: 'is-info'}

const variants: Record<string, Variant> = {
    [AlertConstant.SUCCESS]: {icon: 'fa-solid fa-circle-check', className: 'is-success'},
    [AlertConstant.INFO]: INFO_VARIANT,
    [AlertConstant.WARNING]: {icon: 'fa-solid fa-triangle-exclamation', className: 'is-warning'},
    [AlertConstant.ERROR]: {icon: 'fa-solid fa-circle-exclamation', className: 'is-error'}
}

const variant = (type: string): Variant => variants[type] ?? INFO_VARIANT
</script>

<style scoped lang="scss">
.toast-stack {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: min(24rem, calc(100vw - 2rem));
    pointer-events: none;
}

.app-toast {
    --accent: var(--bs-primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 0.875rem 0.875rem 1rem;
    border: 1px solid var(--app-border);
    border-left: 4px solid var(--accent);
    border-radius: 0.875rem;
    background: var(--app-surface);
    box-shadow: var(--app-shadow-lg);
    pointer-events: auto;

    &.is-success { --accent: var(--bs-success); }
    &.is-info { --accent: var(--bs-info); }
    &.is-warning { --accent: var(--bs-warning); }
    &.is-error { --accent: var(--bs-danger); }
}

.app-toast-icon {
    color: var(--accent);
    font-size: 1.125rem;
}

.app-toast-text {
    flex: 1;
    font-weight: 500;
}

.app-toast-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border: 0;
    border-radius: 0.5rem;
    background: transparent;
    color: var(--app-muted);
    cursor: pointer;

    &:hover {
        background: var(--app-surface-2);
        color: var(--bs-body-color);
    }
}

.toast-enter-active,
.toast-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(24px);
}
</style>
