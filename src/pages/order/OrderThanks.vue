<template>
    <div>
        <h2>
            {{ $filters.transFilter('text.thanks') }}!
        </h2>
        <p>{{ $filters.transFilter('text.thanks_for_placing') }}</p>

        <router-link :to="{name: 'home'}" class="btn btn-success">
            {{ $filters.transFilter('btn.return_to_store') }}
        </router-link>
    </div>
</template>
