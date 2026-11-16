<template>
    <div class="result-card surface">
        <div class="result-icon">
            <font-awesome-icon icon="fa-solid fa-check"/>
        </div>
        <h1 class="result-title">{{ $filters.transFilter('text.thanks') }}!</h1>
        <p class="result-lead">{{ $filters.transFilter('text.order_placed') }}<span v-if="orderId"> · #{{ orderId }}</span></p>
        <p class="result-text">{{ $filters.transFilter('text.thanks_for_placing') }}</p>

        <router-link :to="{name: 'home'}" class="btn btn-primary btn-lg btn-pill">
            <font-awesome-icon icon="fa-solid fa-bag-shopping"/>
            {{ $filters.transFilter('btn.return_to_store') }}
        </router-link>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()

const orderId = computed((): string | null => typeof route.query.id === 'string' ? route.query.id : null)
</script>

<style scoped>
.result-card {
    max-width: 34rem;
    margin: 2rem auto;
    padding: 3rem 2rem;
    text-align: center;
}

.result-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    height: 5rem;
    margin-bottom: 1.5rem;
    border-radius: 50%;
    background: var(--app-success-soft);
    color: var(--bs-success);
    font-size: 2rem;
    box-shadow: 0 0 0 10px var(--app-success-soft);
    animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pop {
    from {
        transform: scale(0.4);
        opacity: 0;
    }
}

.result-title {
    font-size: 2rem;
    font-weight: 800;
}

.result-lead {
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
}

.result-text {
    margin-bottom: 2rem;
    color: var(--app-muted);
    white-space: pre-line;
}
</style>
