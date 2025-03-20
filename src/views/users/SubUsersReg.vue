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
                <el-form-item label="行业" prop="industry" v-if="store.hasRole('ROOT')">
                    <el-select v-model="userForm.industry" placeholder="请选择" size="large">
                        <el-option v-for="(value, key) in Industry" :key="key" :label="value" :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="userForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="registerForSub" style="width: 100%;">注册</el-button>
            </template>
        </el-card>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import User from '@/common/dto/User';
import axios from '@/axios';
import { notify } from '@/common/Notification';
import { useUserStore } from '@/stores/UseUserStore';
import { Industry } from '@/common/Options';

const store = useUserStore();
const userForm = reactive(new User());
const userFormRef = ref(null);
const rules = reactive({
    userName: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    email: [
        { required: false, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    phoneNumber: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1\d{10}$/, message: '请输入有效的手机号码', trigger: 'blur' }
    ],
    industry: [{ required: true, message: '请选择行业', trigger: 'blur' }]
});
const userInfo = useUserStore().getUserInfo;

function registerForSub() {
    userFormRef.value.validate((valid) => {
        if (valid) {
            userForm.parentUserId = userInfo.userId;
            axios.put('/v1/auth/user/registerForSub', userForm, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                let code = response.data.code;
                if (code == 200) {
                    notify('成功', '注册成功', 'success');
                } else {
                    notify('失败', '注册失败：' + response.data.remarks, 'error');
                }
            }).catch(error => {
                console.log('error:', error);
                notify('失败', '未知错误，请联系管理员', 'error');
            })
        }
    });
}

</script>
<style scoped>
.container {
    background-image: url('@/assets/images/bk3.jpeg');
    background-size: cover;
    /* 确保图片覆盖整个区域 */
    background-position: center;
    /* 图片居中 */
    background-repeat: no-repeat;
    /* 图片不重复 */
    min-height: 100vh;
    /* 确保内容占满视口高度 */
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