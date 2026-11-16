<template>
    <div class="skeleton-card" aria-hidden="true">
        <span class="skeleton skeleton-media"></span>
        <div class="skeleton-body">
            <span class="skeleton" style="width: 40%; height: 0.75rem"></span>
            <span class="skeleton" style="width: 85%; height: 1rem"></span>
            <span class="skeleton" style="width: 100%; height: 0.75rem"></span>
            <span class="skeleton" style="width: 70%; height: 0.75rem"></span>
            <div class="skeleton-footer">
                <span class="skeleton" style="width: 30%; height: 1.5rem"></span>
                <span class="skeleton" style="width: 40%; height: 2rem; border-radius: 999px"></span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.skeleton-card {
    overflow: hidden;
    border: 1px solid var(--app-border);
    border-radius: var(--app-radius);
    background: var(--app-surface);
}

.skeleton-media {
    aspect-ratio: 4 / 3;
    border-radius: 0;
}

.skeleton-body {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding: 1rem 1.125rem 1.125rem;
}

.skeleton-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
}
</style>
