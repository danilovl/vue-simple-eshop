import type {RouteRecordRaw} from 'vue-router'
import {createRouter, createWebHashHistory} from 'vue-router'
import {useAuthStore} from '@/store/module/auth'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/layout/Main.vue'),
        children: [
            {
                path: '',
                name: 'home',
                meta: {
                    display: true,
                    title: 'Home Page - Example App'
                },
                component: () => import('@/pages/Home.vue')
            },
            {
                path: 'products',
                component: () => import('@/layout/Default.vue'),
                children: [
                    {
                        path: '',
                        name: 'product_list',
                        meta: {
                            display: true,
                            title: 'Product list'
                        },
                        component: () => import('@/pages/Home.vue')
                    },
                    {
                        path: 'detail/:id(\\d+)',
                        name: 'product_detail',
                        meta: {
                            display: true,
                            title: 'Product detail'
                        },
                        component: () => import('@/pages/product/ProductDetail.vue')
                    }
                ]
            },
            {
                path: 'cart',
                name: 'cart',
                meta: {
                    display: true,
                    title: 'Shopping cart'
                },
                component: () => import('@/pages/cart/ShoppingCart.vue')
            },
            {
                path: 'favorite',
                name: 'favorite',
                meta: {
                    display: true,
                    title: 'Favorite cart'
                },
                component: () => import('@/pages/favorite/FavoriteCart.vue')
            },
            {
                path: 'order',
                name: 'order',
                meta: {
                    display: true,
                    title: 'Checkout cart'
                },
                component: () => import('@/pages/order/Order.vue')
            },
            {
                path: 'order-thanks',
                name: 'order_thanks',
                meta: {
                    display: true,
                    title: 'Order thanks'
                },
                component: () => import('@/pages/order/OrderThanks.vue')
            },
            {
                path: 'login',
                name: 'login',
                meta: {
                    title: 'Login'
                },
                component: () => import('@/pages/admin/Authentication.vue')
            },
            {
                path: 'admin',
                name: 'admin',
                redirect: {name: 'admin_product_list'},
                meta: {
                    requiresAuth: true
                },
                component: () => import('@/pages/admin/Admin.vue'),
                children: [
                    {
                        path: 'products/:op(create|edit)/:id(\\d+)?',
                        name: 'admin_product',
                        meta: {
                            display: true,
                            title: 'Admin create/edit'
                        },
                        component: () => import('@/pages/admin/ProductEditor.vue')
                    },
                    {
                        path: 'products',
                        name: 'admin_product_list',
                        meta: {
                            display: true,
                            title: 'Admin product list'
                        },
                        component: () => import('@/pages/admin/ProductAdmin.vue')
                    },
                    {
                        path: 'orders',
                        name: 'admin_order_list',
                        meta: {
                            display: true,
                            title: 'Admin order list'
                        },
                        component: () => import('@/pages/admin/OrderAdmin.vue')
                    }
                ]
            },
            {
                path: 'error',
                name: 'error',
                meta: {
                    display: false,
                    title: 'Error Page'
                },
                component: () => import('@/pages/Error404.vue')
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: {name: 'error'}
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }

        if (to.name === from.name && to.path === from.path) {
            return false
        }

        return {top: 0}
    }
})

router.beforeEach(async (to) => {
    if (!to.matched.some(record => record.meta.requiresAuth)) {
        return true
    }

    const authStore = useAuthStore()
    await authStore.initializeAuthenticate()

    if (!authStore.isAuthenticated) {
        return {name: 'login', query: {redirect: to.fullPath}}
    }

    return true
})

router.afterEach((to) => {
    const nearestWithTitle = to.matched.slice().reverse().find(record => record.meta.title)
    const nearestWithMeta = to.matched.slice().reverse().find(record => record.meta.metaTags)

    if (nearestWithTitle?.meta.title) {
        document.title = nearestWithTitle.meta.title
    }

    document.querySelectorAll('[data-vue-router-controlled]').forEach(el => el.remove())

    nearestWithMeta?.meta.metaTags?.forEach((tagDef: Record<string, string>): void => {
        const tag = document.createElement('meta')

        Object.entries(tagDef).forEach(([key, value]) => tag.setAttribute(key, value))
        tag.setAttribute('data-vue-router-controlled', '')

        document.head.appendChild(tag)
    })
})

export default router
