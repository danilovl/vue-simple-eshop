<template>
    <div class="d-flex flex-wrap justify-content-center">
        <h4 class="shadow-lg p-3 mb-5 bg-body rounded">
            {{ $filters.transFilter('text.empty') }}
        </h4>
    </div>
    <div class="d-flex flex-wrap justify-content-center">
        <router-link :to="{name: 'home'}" class="btn btn-success">
            {{ $filters.transFilter('btn.return_to_store') }}
        </router-link>
    </div>
</template>
