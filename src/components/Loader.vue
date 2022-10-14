<template>
    <div v-if="loaderStore.isLoading" class="d-flex justify-content-center spinner-loading">
        <div class="spinner-border">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useLoaderStore} from '@/store/module/loader'

const loaderStore = useLoaderStore()
</script>
