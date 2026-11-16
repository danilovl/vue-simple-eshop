<template>
    <span class="rating" :aria-label="`${rating} / 5`">
        <font-awesome-icon
            v-for="star in 5"
            :key="star"
            :icon="star <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"
            class="rating-star"
            :class="{'is-empty': star > rating}"
        />
        <span v-if="count !== undefined" class="rating-count">({{ count }})</span>
    </span>
</template>

<script setup lang="ts">
defineProps<{
    rating: number
    count?: number
}>()
</script>

<style scoped>
.rating {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    font-size: 0.8125rem;
}

.rating-star {
    color: var(--app-star);
}

.rating-star.is-empty {
    color: var(--app-surface-3);
}

.rating-count {
    margin-left: 0.375rem;
    color: var(--app-muted);
    font-size: 0.8125rem;
}
</style>
