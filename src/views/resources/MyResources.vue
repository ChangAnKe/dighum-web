<template>
    <el-tabs v-model="activeName" type="card" class="tabs" >
        <el-tab-pane label="数字人视频" name="dighum-videos" tab-click="getDighumVideos"><GetAIVideos /></el-tab-pane>
        <el-tab-pane label="我的视频" name="videos" tab-click="getVideos">
            <GetVideos />
        </el-tab-pane>
        <el-tab-pane label="我的音频" name="audios" tab-click="getAudios"> <GetAudios /></el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import GetAIVideos from './GetAIVideos.vue';
import GetVideos from './GetVideos.vue';
import GetAudios from './GetAudios.vue';

const activeName = ref('dighum-videos')


// const handleClick = (tab: TabsPaneContext, event: Event) => {
//     switch (tab.paneName) {
//         case 'videos':
//             fetchVideosData();
//             break;
//         case 'audios':
//             fetchAudiosData();
//             break;
//         case 'dighum-videos':
//             fetchDighumVideosData();
//             break;
//     }

// }

// function fetchVideosData() {
// }

// function fetchAudiosData() {
// }

// function fetchDighumVideosData() {
// }
</script>

<style scoped>
.tabs {
    font-size: 50px;
}
.tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
.el-tabs--card {
    height: 100%;
}
</style>