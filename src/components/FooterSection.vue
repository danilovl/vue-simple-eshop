<template>
    <footer class="app-footer">
        <div class="container">
            <div class="row g-4 py-5">
                <div class="col-lg-5">
                    <router-link :to="{name: 'home'}" class="footer-brand">
                        <span class="brand-mark">
                            <font-awesome-icon icon="fa-solid fa-bag-shopping"/>
                        </span>
                        {{ $filters.transFilter('app.name') }}
                    </router-link>
                    <p class="mt-3 mb-0 footer-about">{{ $filters.transFilter('text.footer_about') }}</p>
                </div>
                <div class="col-6 col-lg-3 offset-lg-1">
                    <h2 class="footer-title">{{ $filters.transFilter('text.shop') }}</h2>
                    <ul class="footer-links">
                        <li><router-link :to="{name: 'home'}">{{ $filters.transFilter('nav.catalog') }}</router-link></li>
                        <li><router-link :to="{name: 'favorite'}">{{ $filters.transFilter('text.favorites') }}</router-link></li>
                        <li><router-link :to="{name: 'cart'}">{{ $filters.transFilter('text.cart') }}</router-link></li>
                    </ul>
                </div>
                <div class="col-6 col-lg-3">
                    <h2 class="footer-title">{{ $filters.transFilter('text.account') }}</h2>
                    <ul class="footer-links">
                        <li><router-link :to="{name: 'login'}">{{ $filters.transFilter('btn.login') }}</router-link></li>
                        <li><router-link :to="{name: 'admin_product_list'}">{{ $filters.transFilter('text.dashboard') }}</router-link></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <span>&copy; {{ year }} {{ $filters.transFilter('app.name') }}</span>
                <span class="footer-perks">
                    <span><font-awesome-icon icon="fa-solid fa-truck-fast"/> {{ $filters.transFilter('perk.free_shipping') }}</span>
                    <span><font-awesome-icon icon="fa-solid fa-shield-halved"/> {{ $filters.transFilter('perk.secure_payment') }}</span>
                </span>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped lang="scss">
.app-footer {
    flex-shrink: 0;
    background: var(--app-footer-bg);
    color: var(--app-footer-color);
}

.footer-brand {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    color: #fff;
    font-weight: 800;
    font-size: 1.125rem;
    text-decoration: none;

    &:hover {
        color: #fff;
        text-decoration: none;
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
}

.footer-about {
    max-width: 22rem;
}

.footer-title {
    margin-bottom: 1rem;
    color: #fff;
    font-size: 0.8125rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.footer-links {
    margin: 0;
    padding: 0;
    list-style: none;

    li + li {
        margin-top: 0.5rem;
    }

    a {
        color: var(--app-footer-color);
        text-decoration: none;
        transition: color 0.15s ease;

        &:hover {
            color: #fff;
        }
    }
}

.footer-bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 0;
    border-top: 1px solid rgba(148, 163, 184, 0.15);
    font-size: 0.875rem;
}

.footer-perks {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 1.25rem;
}
</style>
