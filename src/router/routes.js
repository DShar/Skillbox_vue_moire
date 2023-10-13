import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderInfoPage from '@/pages/OrderInfoPage.vue';

const routes = [
    {
      path: "/",
      name: "main",
      component: MainPage,
    },
    {
      path: "/catalog/:categoryId",
      name: "category",
      component: MainPage,
    },
    {
      path: "/product/:id",
      name: "product",
      component: ProductPage,
    },
    {
      path: "/cart",
      name: "cart",
      component: CartPage,
    },
    {
      name: 'order',
      component: OrderPage,
      path: '/order',
    },
    {
    name: 'orderInfo',
    component: OrderInfoPage,
    path: '/order/:id',
    },
    {
      path: '/not-found',
      alias: "*",
      name: "not-found",
      component: NotFoundPage,
    },
];

export default routes;