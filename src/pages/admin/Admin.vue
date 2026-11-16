<template>
    <div>
        <div class="page-header">
            <div>
                <h1>{{ $filters.transFilter('text.dashboard') }}</h1>
                <p>{{ $filters.transFilter('text.dashboard_hint') }}</p>
            </div>
            <nav class="segmented" aria-label="Admin">
                <router-link :to="{name: 'admin_product_list'}" :class="{active: route.name === 'admin_product'}">
                    <font-awesome-icon icon="fa-solid fa-box-open"/>
                    {{ $filters.transFilter('btn.products') }}
                </router-link>
                <router-link :to="{name: 'admin_order_list'}">
                    <font-awesome-icon icon="fa-solid fa-receipt"/>
                    {{ $filters.transFilter('btn.orders') }}
                </router-link>
            </nav>
        </div>

        <router-view v-slot="{ Component }">
            <suspense>
                <component :is="Component" v-if="Component" :key="route.fullPath"/>
            </suspense>
        </router-view>
    </div>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'

const route = useRoute()
</script>
