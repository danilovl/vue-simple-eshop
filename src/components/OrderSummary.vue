<template>
    <aside class="summary surface">
        <h2 class="summary-title">{{ $filters.transFilter('text.order_summary') }}</h2>

        <ul v-if="showItems" class="summary-items">
            <li v-for="line in cartStore.lines" :key="String(line.product.id)">
                <img :src="line.product.image" :alt="line.product.title" width="48" height="48" loading="lazy"/>
                <span class="summary-item-title">
                    {{ line.product.title }}
                    <small>× {{ line.quantity }}</small>
                </span>
                <span class="summary-item-price">{{ $filters.currencyFilter(line.getTotalPrice()) }}</span>
            </li>
        </ul>

        <dl class="summary-rows">
            <div>
                <dt>{{ $filters.transFilter('text.items') }} ({{ cartStore.itemCount }})</dt>
                <dd>{{ $filters.currencyFilter(cartStore.totalPrice) }}</dd>
            </div>
            <div>
                <dt>{{ $filters.transFilter('text.shipping') }}</dt>
                <dd class="text-success">{{ $filters.transFilter('text.free') }}</dd>
            </div>
            <div class="summary-total">
                <dt>{{ $filters.transFilter('text.total') }}</dt>
                <dd>{{ $filters.currencyFilter(cartStore.totalPrice) }}</dd>
            </div>
        </dl>

        <slot/>

        <p class="summary-note">
            <font-awesome-icon icon="fa-solid fa-lock"/>
            {{ $filters.transFilter('text.secure_note') }}
        </p>
    </aside>
</template>

<script setup lang="ts">
import {useCartStore} from '@/store/module/cart'

withDefaults(defineProps<{
    showItems?: boolean
}>(), {
    showItems: false
})

const cartStore = useCartStore()
</script>

<style scoped lang="scss">
.summary {
    padding: 1.5rem;

    @media (min-width: 992px) {
        position: sticky;
        top: calc(var(--app-header-height) + 1.5rem);
    }
}

.summary-title {
    margin-bottom: 1.25rem;
    font-size: 1.125rem;
    font-weight: 800;
}

.summary-items {
    display: grid;
    gap: 0.875rem;
    margin: 0 0 1.25rem;
    padding: 0 0 1.25rem;
    list-style: none;
    border-bottom: 1px solid var(--app-border);

    li {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    img {
        width: 3rem;
        height: 3rem;
        flex-shrink: 0;
        object-fit: cover;
        border-radius: 0.625rem;
    }
}

.summary-item-title {
    flex: 1;
    min-width: 0;
    font-size: 0.875rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    small {
        color: var(--app-muted);
        font-weight: 500;
    }
}

.summary-item-price {
    font-size: 0.875rem;
    font-weight: 700;
}

.summary-rows {
    display: grid;
    gap: 0.75rem;
    margin: 0 0 1.5rem;

    > div {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }

    dt {
        color: var(--app-muted);
        font-weight: 500;
    }

    dd {
        margin: 0;
        font-weight: 700;
    }
}

.summary-total {
    padding-top: 0.875rem;
    border-top: 1px dashed var(--app-border);

    dt,
    dd {
        color: var(--app-heading) !important;
        font-size: 1.25rem;
        font-weight: 800;
    }
}

.summary-note {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0 0;
    color: var(--app-muted);
    font-size: 0.8125rem;
}
</style>
