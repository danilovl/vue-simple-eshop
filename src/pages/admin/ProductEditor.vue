<template>
    <h2 class="text-center">
        {{ $filters.transFilter(editMode ? 'btn.edit' : 'btn.create_product') }}
    </h2>

    <div class="row ">
        <div class="col-sm-8 mx-auto">
            <form disabled="disabled">
                <div v-if="product.id" class="mb-3">
                    <label class="form-label">
                        ID (Not Editable)
                    </label>
                    <input v-if="editMode" v-model="product.id" disabled type="text" class="form-control">
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('text.title') }}
                    </label>
                    <input v-model="product.title" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of titleErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('text.description') }}
                    </label>
                    <input v-model="product.description" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of descriptionErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('text.price') }}
                    </label>
                    <input v-model="product.price" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of priceErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('text.image') }}
                    </label>
                    <input v-model="product.image" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of imageErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>

                <img
                    v-if="product.image"
                    :src="product.image"
                    alt="product image"
                    height=200
                    width=200
                />
            </form>

            <div class="mt-3">
                <router-link :to="{ name: 'admin_product_list'}" class="btn btn-warning me-3">
                    {{ $filters.transFilter('btn.cancel') }}
                </router-link>

                <router-link
                    v-if="product.id"
                    class="btn btn-success me-3"
                    :to="{ name: 'product_detail', params: { id: product.id }}"
                >
                    {{ $filters.transFilter('btn.detail') }}
                </router-link>

                <button class="btn btn-primary" @click="handleSave">
                    {{ $filters.transFilter(editMode ? 'btn.save_changes' : 'btn.create_product') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useVuelidate} from '@vuelidate/core'
import {required, decimal} from '@vuelidate/validators'
import {useProductsStore} from '@/store/module/products'
import {ProductModel} from '@/model/product-model'
import {computed} from 'vue'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()

const product = reactive({
    id: null,
    title: '',
    description: '',
    price: 0,
    rating: 0,
    ratingCount: 0,
    image: ''
})
let editMode: boolean = route.params.op === 'edit'

if (editMode) {
    const loadProduct = async (): Promise<any> => {
        const productModel: ProductModel = await productsStore.getProduct(Number(route.params.id))
        Object.assign(product, productModel)
    }
    loadProduct()
}

const addProduct = productsStore.addProduct
const updateProduct = productsStore.updateProduct

const rules = {
    title: {
        required
    },
    description: {
        required
    },
    price: {
        required,
        decimal
    },
    image: {
        required
    }
}

const v$ = useVuelidate(rules, product)

const titleErrors = computed((): string[] => {
    const errors: string[] = []
    if (!v$.value.title.$dirty) {
        return errors
    }

    if (v$.value.title.required.$invalid) {
        errors.push('Title is required.')
    }

    return errors
})

const descriptionErrors = computed((): string[] => {
    const errors: string[] = []
    if (!v$.value.description.$dirty) {
        return errors
    }

    if (v$.value.description.required.$invalid) {
        errors.push('Description is required.')
    }

    return errors
})

const priceErrors = computed((): string[] => {
    const errors: string[] = []
    if (!v$.value.price.$dirty) {
        return errors
    }

    if (v$.value.price.required.$invalid) {
        errors.push('Price is required.')
    }

    if (v$.value.price.decimal.$invalid) {
        errors.push('Price is number.')
    }

    return errors
})

const imageErrors = computed((): string[] => {
    const errors: string[] = []
    if (!v$.value.image.$dirty) {
        return errors
    }

    if (v$.value.image.required.$invalid) {
        errors.push('Image is required.')
    }

    return errors
})

const handleSave = async (): Promise<any> => {
    v$.value.$touch()

    if (v$.value.$invalid) {
        return
    }

    const productModel: ProductModel = new ProductModel(
        product.id,
        product.title,
        product.description,
        product.price,
        product.rating,
        product.ratingCount,
        product.image,
    )

    if (editMode) {
        await updateProduct(productModel)
    } else {
        await addProduct(productModel)
    }

    await router.push({name: 'admin_product_list'})
}
</script>
