<template>
    <div class="container">
        <el-card>
            <el-form :model="userForm" ref="userFormRef" :rules="rules" style="margin-left: 10px;" label-width="auto">
                <el-form-item label="姓名" prop="userName">
                    <el-input v-model="userForm.userName"></el-input>
                </el-form-item>

                <el-form-item label="手机号" prop="phoneNumber">
                    <el-input v-model="userForm.phoneNumber"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="submitForm" style="width: 100%;">注册</el-button>
            </template>
        </el-card>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import User from '@/common/dto/User';

const userForm = reactive(new User());
const userFormRef = ref(null);
const rules = reactive({
    userName: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    phoneNumber: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1\d{10}$/, message: '请输入有效的手机号码', trigger: 'blur' }
    ]
});
</script>
<style scoped>
.container {
    background-image: url('@/assets/images/bk3.jpeg');
    background-size: cover; /* 确保图片覆盖整个区域 */
    background-position: center; /* 图片居中 */
    background-repeat: no-repeat; /* 图片不重复 */
    min-height: 100vh; /* 确保内容占满视口高度 */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    /* 使容器高度为视口高度，垂直居中 */
}
  
.el-form-item {
    margin-top: 50px;
}
.el-card {
    width: 600px;
}
</style>