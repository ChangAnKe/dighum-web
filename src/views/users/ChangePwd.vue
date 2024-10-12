<template>
    <div class="container">
        <el-card>
            <el-form :model="userForm" ref="userFormRef" :rules="rules" style="margin-left: 10px;" label-width="auto">
                <el-form-item label="当前密码" prop="curPwd">
                    <el-input type="password" show-password v-model="userForm.curPwd"></el-input>
                </el-form-item>

                <el-form-item label="新密码" prop="newPwd">
                    <el-input type="password" show-password v-model="userForm.newPwd"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="confirmPwd">
                    <el-input type="password" show-password v-model="userForm.confirmPwd"></el-input>
                </el-form-item>

            </el-form>
            <template #footer>
                <el-button type="danger" @click="registerForSub" style="width: 100%;">修改</el-button>
            </template>
        </el-card>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import axios from '@/axios';
import { notify } from '@/common/Notification';
import { useUserStore } from '@/stores/UseUserStore';

const userForm = reactive({
    curPwd: null,
    newPwd: null,
    confirmPwd: null,
    userId: null
});
const userFormRef = ref(null);
const rules = reactive({
    curPwd: [
        { required: true, message: '当前密码不能为空', trigger: 'blur' }
    ],
    newPwd: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        { min: 6, max: 40, message: '密码至少需要6位, 长度在 6 到 40 个字符', trigger: 'blur' }
    ],
    confirmPwd: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { min: 6, max: 40, message: '密码至少需要6位, 长度在 6 到 40 个字符', trigger: 'blur' }
    ]
});
const userInfo = useUserStore().getUserInfo;

function registerForSub() {
    userFormRef.value.validate((valid) => {
        if (valid && check(userForm)) {
            userForm.userId = userInfo.userId;
            axios.put('/v1/auth/user/changePwd', userForm, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                let code = response.data.code;
                if (code == 200) {
                    notify('成功', '修改成功', 'success');
                    resetForm();
                } else {
                    notify('失败', '修改失败：' + response.data.remarks, 'error');
                }
            }).catch(error => {
                console.log('error:', error);
                notify('失败', '未知错误，请联系管理员', 'error');
            })
        }
    });
}

function check(userForm) {
    if (userForm.curPwd == userForm.newPwd) {
        notify('Warning', '新密码不能与旧密码一致', 'warning');
        return false;
    }
    if (userForm.newPwd != userForm.confirmPwd) {
        notify('Warning', '两次密码不一致', 'warning');
        return false;
    }
    return true;
}

function resetForm() {
    userForm.curPwd = null;
    userForm.newPwd = null;
    userForm.confirmPwd = null;
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