<template>
    <footer class="text-muted py-5 footer-height bg-dark">
        <div class="container">
            <p class="float-end mb-1">
                <span href="#">&copy; {{ getYear }}</span>
            </p>
        </div>
    </footer>
</template>

<script setup lang="ts">
import {computed} from 'vue'

const getYear = computed((): number => new Date().getFullYear())
</script>

<style scoped>
.footer-height {
    height: 200px !important;
}
</style>
