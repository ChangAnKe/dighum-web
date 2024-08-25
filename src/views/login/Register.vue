<template>
    <div class="register-container">
    <el-form 
    style="max-width: 600px"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon ref="registerFormRef" :model="registerForm" :rules="rules" >
        <el-form-item label="姓名" prop="userName">
            <el-input v-model="registerForm.userName" placeholder="长度在 2 到 50 个字符" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="registerForm.phoneNumber" clearable></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
            <el-input v-model="registerForm.password" placeholder="密码至少需要6位, 长度在 6 到 40 个字符" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" show-password clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" style="margin-left: 78px;">注册</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import axios from '@/axios'
import { useRouter } from 'vue-router'

const dighumUrl = process.env.DIGHUM_URL;
const router = useRouter();
const registerFormRef = ref(null);
const registerForm = reactive({
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
});

// 表单验证规则
const rules = reactive({
    userName: [
        { required: true, message: '请输入姓名', trigger: 'blur'},
        { min: 2, max: 20, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    phoneNumber: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1\d{10}$/, message: '请输入有效的手机号码', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 40, message: '密码至少需要6位, 长度在 6 到 40 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
});

// 密码一致性验证
function validateConfirmPassword(rule, value, callback) {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
    } else {
        callback();
    }
}

// 提交表单
function submitForm() {
    registerFormRef.value.validate((valid) => {
        if (valid) {
             axios.put('/v1/auth/user/register', registerForm, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                let code = response.data.code;
                if (code == 200) {
                    ElMessage.success('注册成功！');
                    router.push('/login');
                } else {
                    ElMessage.error(response.data.remarks)
                }
            }).catch(error => {
                console.log('error:', error);
                ElMessage.error("未知错误，请联系管理员！");
            })
        };
    })
}
</script>

<style scoped>
.register-container {
  background-image: url('@/assets/images/register_background.png');
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-input  {
    width: 500px;
}
.el-form-item {
    margin-top: 50px;
}
</style>