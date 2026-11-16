<template>
    <div class="not-found">
        <div class="not-found-code text-gradient">404</div>
        <h1 class="not-found-title">{{ $filters.transFilter('text.page_not_found') }}</h1>
        <p class="not-found-text">{{ $filters.transFilter('text.page_not_found_hint') }}</p>
        <router-link :to="{name: 'home'}" class="btn btn-primary btn-lg btn-pill">
            <font-awesome-icon icon="fa-solid fa-house"/>
            {{ $filters.transFilter('btn.return_to_store') }}
        </router-link>
    </div>
</template>

<style scoped>
.not-found {
    max-width: 32rem;
    margin: 3rem auto;
    text-align: center;
}

.not-found-code {
    font-size: clamp(6rem, 4rem + 10vw, 10rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.06em;
}

.not-found-title {
    margin-top: 1rem;
    font-size: 1.75rem;
    font-weight: 800;
}

.not-found-text {
    margin-bottom: 2rem;
    color: var(--app-muted);
}
</style>
