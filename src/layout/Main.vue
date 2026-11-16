<template>
    <div class="app-shell">
        <Loader/>
        <a class="skip-link" href="#main-content" @click.prevent="skipToContent">Skip to content</a>
        <header-section/>

        <main id="main-content" class="app-main" tabindex="-1">
            <div class="container">
                <router-view v-slot="{ Component }">
                    <suspense>
                        <component :is="Component" v-if="Component"/>
                    </suspense>
                </router-view>
            </div>
        </main>

        <footer-section/>
        <Alert/>
    </div>
</template>

<script setup lang="ts">
import FooterSection from '@/components/FooterSection.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import Alert from '@/components/Alert.vue'
import Loader from '@/components/Loader.vue'

const skipToContent = (): void => {
    const main = document.getElementById('main-content')
    main?.focus()
    main?.scrollIntoView()
}
</script>

<style scoped>
.app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.app-main {
    flex: 1 0 auto;
    padding: 2rem 0 4rem;
}

.skip-link {
    position: absolute;
    left: 1rem;
    top: -3rem;
    z-index: 2000;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: var(--bs-primary);
    color: #fff;
    transition: top 0.2s ease;
}

.skip-link:focus {
    top: 1rem;
}
</style>
