import type {RouteRecordRaw} from 'vue-router'
import {createRouter, createWebHashHistory} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '',
        meta: {
            display: true,
            title: 'Main Menu'
        },
        component: (): Promise<any> => import('@/layout/Main.vue'),
        children: [
            {
                path: '',
                name: 'home',
                meta: {
                    display: true,
                    title: 'Home Page - Example App'
                },
                component: (): Promise<any> => import('@/pages/Home.vue')
            },
            {
                path: 'products',
                component: (): Promise<any> => import('@/layout/Default.vue'),
                children: [
                    {
                        path: '/',
                        name: 'product_list',
                        meta: {
                            display: true,
                            title: 'Product list'
                        },
                        component: (): Promise<any> => import('@/pages/Home.vue')
                    },
                    {
                        path: 'detail/:id(\\d+)',
                        name: 'product_detail',
                        meta: {
                            display: true,
                            title: 'Product detail'
                        },
                        component: (): Promise<any> => import('@/pages/product/ProductDetail.vue')
                    }
                ]
            },
            {
                path: '/cart',
                name: 'cart',
                meta: {
                    display: true,
                    title: 'Shopping cart '
                },
                component: (): Promise<any> => import('@/pages/cart/ShoppingCart.vue')
            },
            {
                path: '/favorite',
                name: 'favorite',
                meta: {
                    display: true,
                    title: 'Favorite cart '
                },
                component: (): Promise<any> => import('@/pages/favorite/FavoriteCart.vue')
            },
            {
                path: '/order',
                name: 'order',
                meta: {
                    display: true,
                    title: 'Checkout cart '
                },
                component: (): Promise<any> => import('@/pages/order/Order.vue')
            },
            {
                path: '/order-thanks',
                name: 'order_thanks',
                meta: {
                    display: true,
                    title: 'Order thanks'
                },
                component: (): Promise<any> => import('@/pages/order/OrderThanks.vue')
            },
            {
                path: '/login',
                name: 'login',
                component: (): Promise<any> => import('@/pages/admin/Authentication.vue')
            },
            {
                path: '/admin',
                name: 'admin',
                component: (): Promise<any> => import('@/pages/admin/Admin.vue'),
                beforeEnter(to, from, next) {
                    const loggedIn = localStorage.getItem('user-token')
                    if (loggedIn) {
                        next()
                    } else {
                        next('/login')
                    }
                },
                children: [
                    {
                        path: 'products/:op(create|edit)/:id(\\d+)?',
                        name: 'admin_product',
                        meta: {
                            display: true,
                            title: 'Admin create/edit'
                        },
                        component: (): Promise<any> => import('@/pages/admin/ProductEditor.vue')
                    },
                    {
                        path: 'products',
                        name: 'admin_product_list',
                        meta: {
                            display: true,
                            title: 'Admin product list'
                        },
                        component: (): Promise<any> => import('@/pages/admin/ProductAdmin.vue')
                    },
                    {
                        path: 'orders',
                        name: 'admin_order_list',
                        meta: {
                            display: true,
                            title: 'Admin order list'
                        },
                        component: (): Promise<any> => import('@/pages/admin/OrderAdmin.vue')
                    }
                ]
            }
        ]
    },
    {
        path: '',
        meta: {
            display: false
        },
        component: (): Promise<any> => import('@/layout/Main.vue'),
        children: [
            {
                path: '/error',
                name: 'error',
                meta: {
                    display: false,
                    title: 'Error Page'
                },
                component: (): Promise<any> => import('@/pages/Error404.vue')
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/error'
    }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  }

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => {
    return el.parentNode === null ? null : el.parentNode.removeChild(el)
  })

  if (!nearestWithMeta) {
    return next()
  }

  nearestWithMeta.meta.metaTags
      .map((tagDef: any): Element => {
        const tag = document.createElement('meta')

        Object.keys(tagDef).forEach(key => {
          tag.setAttribute(key, tagDef[key])
        })

        tag.setAttribute('data-vue-router-controlled', '')

        return tag
      })
      .forEach((tag: Element): Element => document.head.appendChild(tag))

  next()
})

export default router
