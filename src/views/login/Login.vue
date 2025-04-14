<template>
  <div class="login-container">
    <transition name="fade">
      <el-card class="elCard">
        <el-form ref="loginForm" :model="form" :rules="rules" autocomplete="on" class="loginForm">
          <img src="@/assets/images/svg/bld.svg" alt="Login Icon" style="margin-left: 30%;" />
          <el-text class="myzh">没有账户？</el-text><el-link type="primary" :underline="false" class="ljzc"
            @click="register()">立即注册</el-link>
          <el-form-item prop="userId">
            <el-input v-model="form.userId" prefix-icon="User" placeholder="手机号或邮箱" size="large"
              style="padding-top: 20px;" class="custom-input-height"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input type="password" v-model="form.password" prefix-icon="Lock" autocomplete="current-password"
              placeholder="密码" size="large" show-password style="padding-top: 30px;"><template #suffix>
                <el-button type="text" size="default" @click="handleForgotPassword"
                  style="color: #2a598a; font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">忘记密码</el-button>
              </template> </el-input>
          </el-form-item>
          <el-form-item prop="aggrementsChecked">
            <el-tooltip content="请勾选" placement="top" :disabled="form.aggrementsChecked">
              <el-checkbox v-model="form.aggrementsChecked" label="" /></el-tooltip>
            我已阅读并同意&nbsp;&nbsp;
            <el-link type="primary" class="aggrements" @click="showAgreement('user')">《用户协议》</el-link>
            <el-link type="primary" class="aggrements" @click="showAgreement('privacy')">《隐私政策》</el-link>
            <el-link type="primary" class="aggrements" @click="showAgreement('disclaimer')">《免责声明》</el-link>
          </el-form-item>
          <el-button class="success" type="success" @click="loginRequest" size="large" @keydown.enter="handleKeydown()"
            :loading="isLoading">登录</el-button>
        </el-form>
      </el-card>
    </transition>
    <div class="footer">
      <el-link href="https://beian.miit.gov.cn" type="warning" target="_blank">备案号：京ICP备2024086453号</el-link>
    </div>
  </div>

  <Agreements v-model="isAgreementVisible" :currentAgreement="currentAgreement" />


</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { useUserStore } from '@/stores/UseUserStore';
import Agreements from './Agreements.vue';

const router = useRouter();
const isLoading = ref(false);
const form = reactive({
  userId: '',
  password: '',
  aggrementsChecked: false
});
const rules = reactive({
  userId: [
    { required: true, message: '请输入手机号或者邮箱', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 40, message: '长度在 6 到 40 个字符', trigger: 'blur' }
  ],
  aggrementsChecked: [{ 
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请先阅读并同意相关协议'));
        } else {
          callback();
        }
      },
      trigger: ['change', 'blur']
    }
  ]
});
const loginForm = ref(null);
const store = useUserStore();
const aggrementsChecked = ref(false)
const isAgreementVisible = ref(false)
const currentAgreement = ref('')

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown, false);
})


const loginRequest = (async () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      let userId = form.userId;
      let email = ''
      let phoneNumber = ''
      if (userId.includes('@')) {
        email = userId;
      } else {
        phoneNumber = userId;
      }
      await axios.post('/v1/auth/user/login', {
        'phoneNumber': phoneNumber,
        'email': email,
        'password': form.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        isLoading.value = false;
        //get token
        let token = response.data.token;
        let userInfo = response.data;
        if (token == '' || token == undefined) {
          ElMessage.success('登录异常，请联系管理员！')
        } else {
          //存储token
          localStorage.setItem('token', token);
          store.setUserInfo(userInfo);
          router.push('/homepage');
          ElMessage.success('登录成功！')
        }
      }).catch(error => {
        isLoading.value = false;
        console.log('respose code:' + error.response.status)
        ElMessage.error(error.response.data)
      })
    }
  });
})

function handleForgotPassword() {
  window.location.href = '/resetPwd'
}

function handleKeydown(e) {
  if (e.keyCode == '13' || e.keyCode == 100) {
    loginRequest();
  }
}

const register = (() => {
  if (localStorage.getItem('token') != null) {
    localStorage.removeItem('token');
  }
  router.push('/register');
})

const showAgreement = (curAgree) => {
  isAgreementVisible.value = true;
  currentAgreement.value = curAgree;
}

</script>

<style scoped>
.custom-input-height .el-input__inner {
  height: 40px;
  line-height: 40px;
}

.login-container {
  background-image: url('../../assets/images/background.png');
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

.elCard {
  max-width: 600px;
}

.el-form {
  width: 500px;
  height: 510px;
}

.el-text {
  font-size: 13px;
  margin-left: 25px;
}

.el-link {
  margin-right: 8px;
  font-size: 13px;
}

.success {
  width: 500px;
  height: 50px;
  font-size: 20px;
  margin-top: 10px;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  padding: 10px;
}

/* 移动设备样式 */
@media (max-width: 768px) {
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    /* 确保容器填满页面高度 */
    padding: 10px;
    /* 防止卡片与边界太贴近 */
    overflow-y: auto;
    /* 允许页面垂直滚动 */
  }

  .elCard {
    max-width: 100%;
    max-height: 100%;
    padding: 20px;
    /* 增加卡片内边距 */
    overflow: auto;
  }

  .el-form {
    width: 100%;
    height: 100%;
  }

  .success {
    width: 100%;
    /* 按钮宽度为100% */
  }

  .el-text {
    font-size: 8px;
  }

  .el-text {
    font-size: 10px;
  }

  .el-link {
    font-size: 10px;
  }


}

.aggrements {
  font-size: medium;
}
</style>