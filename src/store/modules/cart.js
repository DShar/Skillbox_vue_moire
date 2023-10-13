import axios from 'axios';
import { API_BASE_URL, NULL_IMG_URL } from '@/config';

const moduleCart = {
    state: () => ({ 
        cartProducts: [],
        cartProductsData: [],
        cartProductsLoading: false,
        cartLoadingFailed: false,
     }),
    mutations: { 
        changeProductAmount(state, { cartProductId, newAmount }) {
            const item = state.cartProducts.find((product) => product.cartProductId === cartProductId);
      
            if (item) {
              item.quantity = newAmount;
            }
          },
          deleteProduct(state, { cartProductId }) {
            state.cartProducts = state.cartProducts.filter((product) => product.cartProductId !== cartProductId);
          },
          updateCartProductsData(state, items) {
            state.cartProductsData = items;
          },
          syncCartProducts(state) {
            state.cartProducts = state.cartProductsData.map((item) => ({
              cartProductId: item.id,
              quantity: item.quantity,
              colorId: item.color.color.id,
              size: item.size,
              imageUrl: item.color.gallery ? item.color.gallery[0].file.url : NULL_IMG_URL,
            }));
          },
          setCartProductsLoading(state, value) {
            state.cartProductsLoading = value;
          },
          setCartLoadingFailed(state, isFailed) {
            state.cartLoadingFailed = isFailed;
          },
          resetCart(state) {
            state.cartProducts = [];
            state.cartProductsData = [];
          },
     },
    actions: { 
        loadCart(context) {
          context.commit('setCartProductsLoading', true);
          context.commit('setCartLoadingFailed', false);
      
            return axios
              .get(`${API_BASE_URL}/api/baskets`, {
                params: {
                  userAccessKey: context.rootState.userAccessKey,
                },
              })
              .then((response) => {
                if (!context.rootState.userAccessKey) {
                  localStorage.setItem('userAccessKey', response.data.user.accessKey);
                  context.commit('setUserAccessKey', response.data.user.accessKey, { root: true });
                }
                context.commit('updateCartProductsData', response.data.items);
                context.commit('syncCartProducts');
              })
              .catch(() => {
                context.commit('setCartLoadingFailed', true);
              })
              .finally(() => {
                context.commit('setCartProductsLoading', false);
              });
        },
        resetCart(context) {
          context.commit('resetCart');
        },
        addProductToCart(context, { productId, colorId, sizeId, quantity }) {
          return axios
            .post(`${API_BASE_URL}/api/baskets/products`, {
              productId,
              colorId,
              sizeId,
              quantity,
            },
            {
              params: {
                userAccessKey: context.rootState.userAccessKey,
              },
            })
            .then((response) => {
              context.commit('updateCartProductsData', response.data.items);
              context.commit('syncCartProducts');
            });
        },
        changeProductAmount(context, { cartProductId, newAmount }) {
          context.commit('changeProductAmount', { cartProductId, newAmount });
    
          if (newAmount < 1) {
            return {};
          }
    
          return axios
            .put(`${API_BASE_URL}/api/baskets/products`, {
              basketItemId: cartProductId,
              quantity: newAmount,
            },
            {
              params: {
                userAccessKey: context.rootState.userAccessKey,
              },
            })
            .then((response) => {
              context.commit('updateCartProductsData', response.data.items);
            })
            .catch(() => {
              context.commit('syncCartProducts');
            });
        },
        deleteProductFromCart(context, { cartProductId }) {
          context.commit('deleteProduct', { cartProductId });

          return axios
            .delete(`${API_BASE_URL}/api/baskets/products`, {
              params: {
                userAccessKey: context.rootState.userAccessKey,
              },
              data: {
                basketItemId: cartProductId,
              }
            })
            .then((response) => {
              context.commit('updateCartProductsData', response.data.items);
            })
            .catch(() => {
              context.commit('syncCartProducts');
            });
        }
     },
    getters: { 
        countProducts(state) {
            return state.cartProducts.length;
          },
          cartProductsDetails(state) {
            return state.cartProducts.map((item) => {

              const { product }  = state.cartProductsData.find((p) => (p.id === item.cartProductId));
         
              return {
                ...item,
                product: {
                  ...product,
                },
              };
            });
          },
          cartTotalPrice(state, getters) {
            return getters.cartProductsDetails.reduce((acc, item) => acc
              + item.product.price * item.quantity, 0);
          },
     }
  };

  export default moduleCart;