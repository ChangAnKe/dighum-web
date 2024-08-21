<template>
    <el-tabs v-model="activeName" type="card" class="tabs" @tab-click="handleClick">
        <el-tab-pane label="我的视频" name="videos" tab-click="getVideos">
            <GetVideos />
        </el-tab-pane>
        <el-tab-pane label="我的音频" name="audios" tab-click="getAudios">音频</el-tab-pane>
        <el-tab-pane label="数字人视频" name="dishum-videos" tab-click="getDighumVideos">数字人视频</el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import GetVideos from './GetVideos.vue';

const activeName = ref('videos')
let videosData = [];
let audiosData = [];
let dighumVideosData = [];

const handleClick = (tab: TabsPaneContext, event: Event) => {
    switch (tab.paneName) {
        case 'videos':
            fetchVideosData();
            break;
        case 'audios':
            fetchAudiosData();
            break;
        case 'dighum-videos':
            fetchDighumVideosData();
            break;
    }

}

function fetchVideosData() {
}

function fetchAudiosData() {
}

function fetchDighumVideosData() {
}
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