<template>
    <el-form :inline="true" :model="resource" class="demo-form-inline">
        <el-form-item label="文件名" class="fileName">
            <el-input v-model="resource.comKey.fileName" clearable />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getMyVideos">查询</el-button>
            <template v-if="lodingStatus" #loading>
                <div class="custom-loading">
                    <svg class="circular" viewBox="-10, -10, 50, 50">
                        <path class="path" d="
            M 30 15
            L 28 17
            M 25.61 25.61
            A 15 15, 0, 0, 1, 15 30
            A 15 15, 0, 1, 1, 27.99 7.5
            L 15 15
          " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)" />
                    </svg>
                </div>
            </template>
        </el-form-item>
    </el-form>
    <div class="video-list">
        <el-card v-for="(video, index) in videos" :key="index" style="width: 250px;height: 200px;">
            <template #header>
                <div class="card-header">
                    <span style="font-size: 15px;">{{ video.comKey.fileName
                        }}</span>
                </div>
            </template>
            <VideoPlayer width="210px" height="120px" :video-url="dighumUrl+video.resourceUrl"
                :poster="`http://127.0.0.1:8080/vauvi/ae4287c8-011c-4479-8038-ed3809b2f5ad/video/cover/cover.jpg`"
                :id="video.comKey.userId + '@_@' + video.comKey.fileType + '@_@' + video.comKey.fileName" />

        </el-card>

        <!-- <VideoPlayer  v-for="(video, index) in videos" :key="index"  width="270px" height="140px" :video-url="video.resourceUrl"
                :poster="`http://127.0.0.1:8080/vauvi/ae4287c8-011c-4479-8038-ed3809b2f5ad/video/cover/cover.jpg`"
                :id="video.comKey.userId + '@_@' + video.comKey.fileType + '@_@' + video.comKey.fileName" /> -->
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import VideoPlayer from "@/components/videos/videoPlayer.vue"
import axios from '@/axios'
import { ElMessage } from 'element-plus'

let videos = reactive([])
const resource = reactive({
    comKey: {
        fileType: "VI",
        fileName: ""
    }
})
const dighumUrl = process.env.DIGHUM_URL;
let lodingStatus = ref(false);

const getMyVideos = async () => {
    lodingStatus = true;
    // 发送请求
    await axios.post("/v1/resource/getResources", resource, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status = '200') {
            if (response.data.length == 0) {
                ElMessage.success('无满足条件的视频，请上传！');
            } else {
                //确保使用响应式的方式更新数组
                videos.splice(0, videos.length, ...response.data);
            }
        } else {
            ElMessage.error('获取视频列表异常，请联系管理员！');
        }

        lodingStatus = false;
    }).catch(error => {
        ElMessage.error('获取视频列表失败，请联系管理员！');
    });
}


</script>

<style scoped>
.demo-form-inline .el-input {
    --el-input-width: 220px;
}

.demo-form-inline .el-select {
    --el-select-width: 220px;
}

.fileName {
    margin-left: 30px;
}

.video-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.video-description {
    margin-top: 0.5rem;
}

.video-list {
    margin-left: 25px;
    margin-top: 20px;
}
</style>