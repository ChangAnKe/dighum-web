<template>
  <el-container class="home-container">
    <el-header>
      <div class="toolbar">
        <el-dropdown>
          <el-icon style="margin-right: 8px; margin-top: 1px;" color="#9bb7f3" size="25">
            <setting />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changePwd">修改密码</el-dropdown-item>
              <el-dropdown-item @mouseenter="startUpdateBalance" @mouseleave="cancelUpdateBalance">积分:&nbsp;&nbsp;
                <el-text class="mx-1" type="primary" style="font-weight: bolder;">{{ userInfo.balance }}</el-text>
              </el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>{{ userInfo.userName }}</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu router :default-openeds="['1']">
            <!-- 资源管理 -->
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <icon-menu />
                </el-icon>资源管理
              </template>
              <el-menu-item index="/createVideo"><el-icon><DigitalHuman /></el-icon><span>创建视频</span></el-menu-item>
              <el-menu-item index="/createAudio"><el-icon><Audio1 /></el-icon><span>创建音频</span></el-menu-item>
              <el-menu-item index="/imageCloning"><el-icon><Clone /></el-icon><span>形象克隆</span></el-menu-item>
              <el-menu-item index="/voiceClone"><el-icon><Audio2 /></el-icon><span>声音克隆</span></el-menu-item>
              <el-menu-item index="/myResources"><el-icon><Resources /></el-icon><span>作品管理</span></el-menu-item>
            </el-sub-menu>
            <!-- 用户管理 -->
            <el-sub-menu index="2" v-if="store.hasRole('MENU_USERS_MANAGEMENT')">
              <template #title>
                <el-icon>
                  <User />
                </el-icon>用户管理
              </template>
              <el-menu-item index="/subusers/reg" v-if="store.hasRole('MENU_USER_REGISTER')"><el-icon><RegisterUser /></el-icon><span>用户注册</span></el-menu-item>
              <el-menu-item index="/subusers/pointsMan" v-if="store.hasRole('MENU_BALANCE_MANAGEMENT')"><el-icon><Money /></el-icon><span>积分管理</span></el-menu-item>
            </el-sub-menu>
            <!-- 积分明细 -->
            <el-menu-item index="/balanceHistory"><el-icon><IconBalanceHistory /></el-icon><span>积分明细</span></el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <router-view>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Menu as IconMenu, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/UseUserStore';
import { useRouter } from 'vue-router'
import axios from '@/axios'
import Audio1 from '@/components/svg/Audio1.vue';
import DigitalHuman from '@/components/svg/DigitalHuman.vue';
import Clone from '@/components/svg/Clone.vue';
import Audio2 from '@/components/svg/Audio2.vue';
import Resources from '@/components/svg/Resources.vue';
import RegisterUser from '@/components/svg/RegisterUser.vue';
import Money from '@/components/svg/Money.vue';
import IconBalanceHistory from '@/components/svg/IconBalanceHistory.vue';

const router = useRouter();
const store = useUserStore();
let userInfo = ref(store.getUserInfo);

const logout = (() => {
  //清除用户信息
  store.logout();
  router.push('/login')
})
let updateTimer = null;
function secondsToMinutes(seconds: number) {
  return (seconds / 60).toFixed(1);
}

function startUpdateBalance() {
  updateTimer = setTimeout(() => {
    // 模拟从后端获取新的积分值
    updateBalance();
  }, 2000); // 延迟两秒执行
}
function cancelUpdateBalance() {
  if (updateTimer) {
    clearTimeout(updateTimer); // 取消定时器
    updateTimer = null;
  }
}
async function updateBalance() {
  let response = await axios.get("/v1/auth/user/getUser");
  if (response.status == 200) {
    userInfo.value.balance = response.data.balance;
  }
}
function changePwd() {
  router.push('/changePwd');
}
</script>

<style scoped>
.home-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  overflow-y: auto;
}

.home-container .el-header {
  position: relative;
  background-color: #0a192f;
  color: aliceblue;
  background-image: url('@/assets/images/svg/head-ai-logo.svg');
  background-repeat: no-repeat;
  text-align: right;
  font-size: 12px;
  height: 90px;
}

.el-header svg {
  width: 100%;
  height: 100%;
}


.home-container .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
  background-color: white;
}

.home-container .el-menu {
  border-right: none;
}

.home-container .el-main {
  padding: 0;
  height: 100%;
  background-color: white;
}

.home-container .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
  font-size: 20px;
  font-weight: bolder;
}

.el-aside {
  border-right: 2px solid #d8e1f5;
  /* 右侧边框 */
}
</style>