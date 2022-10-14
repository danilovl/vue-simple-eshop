<template>
    <div class="mb-3">
        <div class="col-4">
            <span class="btn btn-success me-3">
                {{ $filters.transFilter('btn.admin') }}
            </span>

            <router-link :to="{name: 'admin_product_list'}" class="btn btn-warning me-3">
                {{ $filters.transFilter('btn.products') }}
            </router-link>

            <router-link :to="{name: 'admin_order_list'}" class="btn btn-primary">
                {{ $filters.transFilter('btn.orders') }}
            </router-link>
        </div>
    </div>
    <div>
        <router-view/>
    </div>
</template>
