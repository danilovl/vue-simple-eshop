<template>
    <router-view v-slot="{ Component }">
        <suspense>
            <component :is="Component" v-if="Component"/>
        </suspense>
    </router-view>
</template>
