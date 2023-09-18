<template>
    <header-section/>
    <Alert/>

    <main>
        <div class="album py-5 bg-light">
            <div class="container container-min-height">
                <Loader/>
                <router-view/>
            </div>
        </div>
    </main>

    <footer-section/>
</template>

<script setup lang="ts">
import FooterSection from '@/components/FooterSection.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import Alert from '@/components/Alert.vue'
import Loader from '@/components/Loader.vue'
</script>

<style scoped>
.container-min-height {
    min-height: 50vh;
}
</style>
