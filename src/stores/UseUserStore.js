// stores/useUserStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore({
    id: 'user', // 存储的唯一标识符
    state: () => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo')) || null; // 解析存储的用户信息
        return {
            userInfo: storedUserInfo, // 用户信息初始值
            roles: (storedUserInfo == null ? [] : storedUserInfo.userRoles) || [] // 用户角色初始值
        };
    },
    actions: {
        // 设置用户信息
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            this.setRoles(userInfo.userRoles);
        },
        // 清除 userInfo  
        clearUserInfo() {
            this.userInfo = null;
        },
        setRoles(roles) {
            this.roles = roles;
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
        hasRole: (state) => (role) => {
            if (state.roles.includes('ROOT')) {
                return true;
            }
            return state.roles.includes(role);
        },
        applyToIndustry: (state) => (industry) => {
            if (state.roles.includes('ROOT') || state.userInfo.industry == industry) {
                return true;
            }
            return false;
        }
    }
});