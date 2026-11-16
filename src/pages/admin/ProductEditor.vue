<template>
    <form class="row g-4" novalidate @submit.prevent="handleSave">
        <div class="col-lg-7">
            <div class="surface surface-padded">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
                    <h2 class="h4 fw-extrabold m-0">
                        {{ $filters.transFilter(editMode ? 'btn.edit' : 'btn.create_product') }}
                    </h2>
                    <span v-if="editMode && product.id" class="badge rounded-pill text-bg-light">#{{ product.id }}</span>
                </div>
                <p class="text-secondary mb-4">{{ $filters.transFilter('text.product_editor_hint') }}</p>

                <form-field id="product-title" :label="$filters.transFilter('text.title')" :errors="titleErrors" v-slot="{invalid}">
                    <input id="product-title" v-model.trim="product.title" type="text" class="form-control" :class="{'is-invalid': invalid}">
                </form-field>

                <form-field id="product-description" :label="$filters.transFilter('text.description')" :errors="descriptionErrors" v-slot="{invalid}">
                    <textarea id="product-description" v-model.trim="product.description" rows="5" class="form-control" :class="{'is-invalid': invalid}"></textarea>
                </form-field>

                <div class="row g-3 mt-0">
                    <div class="col-md-5">
                        <form-field id="product-price" :label="$filters.transFilter('text.price')" :errors="priceErrors" v-slot="{invalid}">
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input id="product-price" v-model.number="product.price" type="number" min="0" step="0.01" class="form-control" :class="{'is-invalid': invalid}">
                            </div>
                        </form-field>
                    </div>
                    <div class="col-md-7">
                        <form-field id="product-image" :label="$filters.transFilter('text.image')" :errors="imageErrors" v-slot="{invalid}">
                            <input id="product-image" v-model.trim="product.image" type="url" placeholder="https://" class="form-control" :class="{'is-invalid': invalid}">
                        </form-field>
                    </div>
                </div>

                <div class="d-flex flex-wrap gap-2 mt-4 pt-2">
                    <button type="submit" class="btn btn-primary btn-pill" :disabled="saving || (editMode && !loaded)">
                        <span v-if="saving" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <font-awesome-icon v-else icon="fa-solid fa-check"/>
                        {{ $filters.transFilter(editMode ? 'btn.save_changes' : 'btn.create_product') }}
                    </button>
                    <router-link :to="{ name: 'admin_product_list'}" class="btn btn-ghost btn-pill">
                        {{ $filters.transFilter('btn.cancel') }}
                    </router-link>
                    <router-link
                        v-if="product.id"
                        class="btn btn-ghost btn-pill ms-auto"
                        :to="{ name: 'product_detail', params: { id: product.id }}"
                    >
                        <font-awesome-icon icon="fa-solid fa-eye"/>
                        {{ $filters.transFilter('btn.view') }}
                    </router-link>
                </div>
            </div>
        </div>

        <div class="col-lg-5">
            <div class="preview">
                <div class="preview-label">{{ $filters.transFilter('text.preview') }}</div>
                <product-card :product="previewProduct"/>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import {reactive, computed, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useVuelidate} from '@vuelidate/core'
import {required, decimal, minValue, url} from '@vuelidate/validators'
import {useProductsStore} from '@/store/module/products'
import {ProductModel} from '@/model/product-model'
import type {ProductId} from '@/model/product-model'
import ProductCard from '@/components/ProductCard.vue'
import FormField from '@/components/ui/FormField.vue'
import {fieldErrors} from '@/helper/validation'
import transFilter from '@/filter/trans-filter'

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/simple-shop-preview/640/480'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()

const product = reactive({
    id: null as ProductId | null,
    title: '',
    description: '',
    price: 0,
    rating: 0,
    ratingCount: 0,
    image: ''
})

const editMode: boolean = route.params.op === 'edit'
const loaded = ref<boolean>(!editMode)
const saving = ref<boolean>(false)

if (editMode) {
    const productModel = await productsStore.getProduct(Number(route.params.id))
    if (productModel === null) {
        await router.replace({name: 'admin_product_list'})
    } else {
        Object.assign(product, productModel)
        loaded.value = true
    }
}

const previewProduct = computed((): ProductModel => new ProductModel(
    product.id ?? 0,
    product.title || transFilter('text.title'),
    product.description || transFilter('text.description'),
    Number(product.price) || 0,
    product.rating,
    product.ratingCount,
    product.image || PLACEHOLDER_IMAGE
))

const rules = {
    title: {
        required
    },
    description: {
        required
    },
    price: {
        required,
        decimal,
        minValue: minValue(0)
    },
    image: {
        required,
        url
    }
}

const v$ = useVuelidate(rules, product)

const titleErrors = computed((): string[] => fieldErrors(v$.value.title))
const descriptionErrors = computed((): string[] => fieldErrors(v$.value.description))
const priceErrors = computed((): string[] => fieldErrors(v$.value.price))
const imageErrors = computed((): string[] => fieldErrors(v$.value.image))

const handleSave = async (): Promise<void> => {
    if (saving.value) {
        return
    }

    v$.value.$touch()
    if (v$.value.$invalid) {
        return
    }

    const productModel = new ProductModel(
        product.id,
        product.title,
        product.description,
        Number(product.price),
        product.rating,
        product.ratingCount,
        product.image
    )

    saving.value = true

    try {
        const success = editMode
            ? await productsStore.updateProduct(productModel)
            : await productsStore.addProduct(productModel)

        if (success) {
            await router.push({name: 'admin_product_list'})
        }
    } finally {
        saving.value = false
    }
}
</script>

<style scoped lang="scss">
.preview {
    max-width: 22rem;

    @media (min-width: 992px) {
        position: sticky;
        top: calc(var(--app-header-height) + 1.5rem);
    }
}

.preview-label {
    margin-bottom: 0.75rem;
    color: var(--app-muted);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.preview :deep(.product-card) {
    pointer-events: none;
}
</style>
