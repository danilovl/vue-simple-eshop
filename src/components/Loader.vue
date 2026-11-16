<template>
    <transition name="loader-fade">
        <div v-if="loaderStore.isLoading" class="top-loader" role="progressbar" aria-label="Loading">
            <span class="top-loader-bar"></span>
        </div>
    </transition>
</template>

<script setup lang="ts">
import {useLoaderStore} from '@/store/module/loader'

const loaderStore = useLoaderStore()
</script>

<style scoped>
.top-loader {
    position: fixed;
    inset: 0 0 auto;
    z-index: 2000;
    height: 3px;
    overflow: hidden;
    background: var(--app-primary-soft);
}

.top-loader-bar {
    position: absolute;
    inset: 0 auto 0 0;
    width: 40%;
    background: var(--app-gradient);
    border-radius: 999px;
    animation: loader-slide 1.1s ease-in-out infinite;
}

@keyframes loader-slide {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(260%);
    }
}

.loader-fade-enter-active,
.loader-fade-leave-active {
    transition: opacity 0.3s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
    opacity: 0;
}
</style>
