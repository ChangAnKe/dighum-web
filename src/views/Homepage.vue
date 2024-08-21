<template>
  <el-container class="home-container">
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{ user.userName }}</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-scrollbar>
            <el-menu router :default-openeds="['1']" :default-active="$route.path">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon>
                    <icon-menu />
                  </el-icon>资源管理
                </template>
                <el-menu-item index="/myResources">我的资源</el-menu-item>
                <el-menu-item index="/uploadRes">上传资源</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <router-view>
          </router-view>
        </el-main>
      </el-container>
    </el-container>

  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import welcome from './Calender.vue'

const user = {
  date: '2016-05-02',
  userName: 'Tom',
  address: 'No. 189, Grove St, Los Angeles'
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
  background-color: #80c0ff;
  color: aliceblue;
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
    border-right: 2px solid #d8e1f5; /* 右侧边框 */
  }
</style>
