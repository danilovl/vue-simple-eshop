<template>
    <div class="empty-state">
        <div class="empty-icon">
            <font-awesome-icon :icon="icon"/>
        </div>
        <h2 class="empty-title">{{ $filters.transFilter(title) }}</h2>
        <p class="empty-text">{{ $filters.transFilter(text) }}</p>
        <slot>
            <router-link :to="{name: 'home'}" class="btn btn-primary btn-pill">
                <font-awesome-icon icon="fa-solid fa-arrow-left"/>
                {{ $filters.transFilter('btn.return_to_store') }}
            </router-link>
        </slot>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    icon?: string
    title?: string
    text?: string
}>(), {
    icon: 'fa-solid fa-box-open',
    title: 'text.empty',
    text: 'text.empty_hint'
})
</script>

<style scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 28rem;
    margin: 2rem auto;
    padding: 3rem 1.5rem;
    text-align: center;
}

.empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    height: 5rem;
    margin-bottom: 1.5rem;
    border-radius: 1.5rem;
    background: var(--app-primary-soft);
    color: var(--bs-primary);
    font-size: 2rem;
}

.empty-title {
    font-size: 1.375rem;
    font-weight: 800;
}

.empty-text {
    margin-bottom: 1.5rem;
    color: var(--app-muted);
}
</style>
