<template>
    <div class="cart-line">
        <router-link :to="detailRoute" class="cart-line-image" tabindex="-1" aria-hidden="true">
            <img :src="line.product.image" :alt="line.product.title" width="96" height="72" loading="lazy"/>
        </router-link>

        <div class="cart-line-info">
            <router-link :to="detailRoute" class="cart-line-title">{{ line.product.title }}</router-link>
            <span class="cart-line-unit">
                {{ $filters.currencyFilter(line.product.price) }} {{ $filters.transFilter('text.each') }}
            </span>
        </div>

        <div class="qty-stepper">
            <button
                type="button"
                :aria-label="$filters.transFilter('btn.remove_from_cart')"
                :disabled="line.quantity <= 1"
                @click="emit('quantity', line.quantity - 1)"
            >
                <font-awesome-icon icon="fa-solid fa-minus"/>
            </button>
            <input
                type="number"
                min="1"
                step="1"
                :value="line.quantity"
                :aria-label="$filters.transFilter('text.quantity')"
                @change="sendChangeEvent"
            />
            <button
                type="button"
                :aria-label="$filters.transFilter('btn.add_to_cart')"
                @click="emit('quantity', line.quantity + 1)"
            >
                <font-awesome-icon icon="fa-solid fa-plus"/>
            </button>
        </div>

        <div class="cart-line-total">{{ $filters.currencyFilter(line.getTotalPrice()) }}</div>

        <button
            type="button"
            class="btn-icon btn-icon-danger"
            :aria-label="$filters.transFilter('btn.delete')"
            :title="$filters.transFilter('btn.delete')"
            @click="emit('remove', line)"
        >
            <font-awesome-icon icon="fa-solid fa-trash-can"/>
        </button>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {BasketModel} from '@/model/basket-model'

const props = defineProps<{
    line: BasketModel
}>()

const emit = defineEmits<{
    quantity: [value: number]
    remove: [line: BasketModel]
}>()

const detailRoute = computed(() => ({name: 'product_detail', params: {id: props.line.product.id}}))

const sendChangeEvent = (event: Event): void => {
    const input = event.target as HTMLInputElement
    const value = Math.floor(Number(input.value))
    const quantity = Number.isFinite(value) && value > 0 ? value : 1

    emit('quantity', quantity)
    input.value = String(quantity)
}
</script>

<style scoped lang="scss">
.cart-line {
    display: grid;
    grid-template-columns: auto 1fr auto auto auto;
    align-items: center;
    gap: 1rem 1.25rem;
    padding: 1.25rem 0;

    & + & {
        border-top: 1px solid var(--app-border);
    }

    @media (max-width: 767.98px) {
        grid-template-columns: auto 1fr auto;
        grid-template-areas:
            'image info remove'
            'image qty total';

        .cart-line-image { grid-area: image; }
        .cart-line-info { grid-area: info; }
        .qty-stepper { grid-area: qty; justify-self: start; }
        .cart-line-total { grid-area: total; }
        .btn-icon { grid-area: remove; }
    }
}

.cart-line-image img {
    display: block;
    width: 6rem;
    height: 4.5rem;
    object-fit: cover;
    border-radius: 0.75rem;
    background: var(--app-surface-2);
}

.cart-line-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
}

.cart-line-title {
    color: var(--app-heading);
    font-weight: 700;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
        color: var(--bs-primary);
    }
}

.cart-line-unit {
    color: var(--app-muted);
    font-size: 0.875rem;
}

.qty-stepper button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.cart-line-total {
    min-width: 6rem;
    font-weight: 800;
    text-align: right;
}
</style>
