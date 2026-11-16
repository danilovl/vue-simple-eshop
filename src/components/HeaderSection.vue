<template>
    <header class="app-header" :class="{'is-scrolled': scrolled}">
        <div class="container">
            <div class="header-row">
                <router-link :to="{name: 'home'}" class="brand" :aria-label="$filters.transFilter('app.name')">
                    <span class="brand-mark">
                        <font-awesome-icon icon="fa-solid fa-bag-shopping"/>
                    </span>
                    <span class="brand-name">{{ $filters.transFilter('app.name') }}</span>
                </router-link>

                <nav class="header-nav d-none d-lg-flex" aria-label="Main">
                    <router-link :to="{name: 'home'}" class="header-link" exact-active-class="active">
                        {{ $filters.transFilter('nav.catalog') }}
                    </router-link>
                    <router-link
                        v-if="authStore.isAuthenticated"
                        :to="{name: 'admin_product_list'}"
                        class="header-link"
                        :class="{active: route.path.startsWith('/admin')}"
                    >
                        {{ $filters.transFilter('btn.admin') }}
                    </router-link>
                </nav>

                <product-search class="header-search d-none d-md-flex"/>

                <div class="header-actions">
                    <language-flag/>
                    <theme-toggle/>
                    <heart-favorite-summary/>
                    <cart-summary/>
                    <profile-bar/>
                </div>
            </div>

            <product-search class="d-md-none pb-3"/>
        </div>
    </header>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import CartSummary from '@/components/CartSummary.vue'
import HeartFavoriteSummary from '@/components/button/HeartFavoriteSummary.vue'
import ProfileBar from '@/components/ProfileBar.vue'
import LanguageFlag from '@/components/LanguageFlag.vue'
import ProductSearch from '@/components/ProductSearch.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import {useAuthStore} from '@/store/module/auth'

const authStore = useAuthStore()
const route = useRoute()
const scrolled = ref<boolean>(false)

const onScroll = (): void => {
    scrolled.value = window.scrollY > 8
}

onMounted((): void => {
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
})

onBeforeUnmount((): void => window.removeEventListener('scroll', onScroll))
</script>

<style scoped lang="scss">
.app-header {
    position: sticky;
    top: 0;
    z-index: 1030;
    background: var(--app-header-bg);
    backdrop-filter: saturate(180%) blur(14px);
    -webkit-backdrop-filter: saturate(180%) blur(14px);
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &.is-scrolled {
        border-bottom-color: var(--app-border);
        box-shadow: 0 8px 24px -16px rgba(15, 23, 42, 0.35);
    }
}

.header-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-height: var(--app-header-height);
}

.brand {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    color: var(--app-heading);
    font-weight: 800;
    font-size: 1.125rem;
    letter-spacing: -0.02em;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
        text-decoration: none;
        color: var(--app-heading);
    }
}

.brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.75rem;
    background: var(--app-gradient);
    color: #fff;
    box-shadow: 0 8px 18px -8px rgba(124, 58, 237, 0.8);
}

.header-nav {
    gap: 0.25rem;
}

.header-link {
    padding: 0.5rem 0.75rem;
    border-radius: 0.625rem;
    color: var(--app-muted);
    font-weight: 600;
    text-decoration: none;
    transition: background-color 0.15s ease, color 0.15s ease;

    &:hover,
    &.active {
        color: var(--bs-body-color);
        background: var(--app-surface-2);
        text-decoration: none;
    }
}

.header-search {
    flex: 1 1 auto;
    max-width: 28rem;
    margin-left: auto;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
}

.header-search + .header-actions {
    margin-left: 0;
}

@media (max-width: 575.98px) {
    .brand-name {
        display: none;
    }
}
</style>
