import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import moduleCart from './modules/cart';
import { API_BASE_URL } from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        cart: moduleCart,
    },
    state: {
        userAccessKey: null,
        deliveriesData: null,
        paymentTypeData: null,

        orderInfo: null,
    },
    mutations: {
        updateUserAccessKey(state, accessKeyValue) {
            state.userAccessKey = accessKeyValue;
        },
        setDeliveriesData(state, deliveries) {
            state.deliveriesData = deliveries;
        },
        setPaymentTypesData(state, payments) {
            state.paymentTypeData = payments;
        },
        updateOrderInfo(state, orderInfo) {
            state.orderInfo = orderInfo;
        },
    },
    actions: {
        setUserAccessKey(context, accessKey) {
            context.commit('updateUserAccessKey', accessKey);
          },
        loadDeliveries(context) {
            return axios
                .get(`${API_BASE_URL}/api/deliveries`)
                .then((response) => { 
                    context.commit('setDeliveriesData', response.data);
                 });
        },  
        loadPaymentTypes(context, deliveryTypeId) {
            return axios
                .get(`${API_BASE_URL}/api/payments`, {
                    params: {
                        deliveryTypeId,
                      },
                })
                .then((response) => {
                    context.commit('setPaymentTypesData', response.data);
                });
        },
        updateOrderInfo(context, orderInfo) {
            context.commit('updateOrderInfo', orderInfo);
        },
        loadOrderInfo(context, orderId) {
            return axios
              .get(`${API_BASE_URL}/api/orders/${orderId}`, {
                params: {
                  userAccessKey: context.state.userAccessKey,
                },
              })
              .then((response) => {
                context.commit('updateOrderInfo', response.data);
              });
          },
    }
});



