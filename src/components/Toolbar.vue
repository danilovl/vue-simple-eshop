<template>
    <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
                <router-link :to="{name: 'home'}" class="navbar-brand d-flex align-items-center">
                    <font-awesome-icon icon="fa-solid fa-house"/>
                </router-link>
            </li>
        </ul>

        <heart-favorite-summary/>
        <cart-summary/>
        <product-search/>
        <language-flag/>
        <profile-bar/>
    </div>
</template>

<script setup lang="ts">
import CartSummary from '@/components/CartSummary.vue'
import HeartFavoriteSummary from '@/components/button/HeartFavoriteSummary.vue'
import ProfileBar from '@/components/ProfileBar.vue'
import LanguageFlag from '@/components/LanguageFlag.vue'
import ProductSearch from '@/components/ProductSearch.vue'
</script>
