// stores/useUserStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore({
    id: 'user', // 存储的唯一标识符
    state: () => ({
        userInfo: JSON.parse(localStorage.getItem('userInfo')) || null, // 用户信息初始为空
    }),
    actions: {
        // 设置用户信息
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        },
        // 清除 userInfo  
        clearUserInfo() {
            this.userInfo = null;
        },
        logout() {
            this.clearUserInfo(); // 清除 userInfo  
            // localStorage.removeItem('userInfo');
            // localStorage.removeItem('token'); //清除token
            localStorage.clear();
        },
    },
    getters: {
        // 获取用户信息
        getUserInfo: (state) => state.userInfo,
        // getUserInfo() {
        //     const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        //     return storedUserInfo;
        // }
    }
});