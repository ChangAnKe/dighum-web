<template>
    <el-form :inline="true" :model="resource" class="demo-form-inline">
        <el-form-item label="文件名" class="fileName">
            <el-input v-model="resource.comKey.fileName" clearable />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getMyAudios" :loading="isLoading">查询</el-button>
        </el-form-item>
    </el-form>
    <div class="video-list">
        <el-card v-for="(audio, index) in audios" :key="index" style="width: 250px;height: 200px;">
            <template #header>
                <div class="card-header">
                    <span style="font-size: 15px;">{{ audio.comKey.fileName
                        }}</span>
                </div>
            </template>
            <VideoPlayer width="210px" height="120px" :video-url="dighumUrl + audio.resourceUrl"
                :poster="dighumUrl + '/vauvi/audio.jpg'"
                :id="audio.comKey.userId + '@_@' + audio.comKey.fileType + '@_@' + audio.comKey.fileName" />

        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import VideoPlayer from "@/components/videos/videoPlayer.vue"
import axios from '@/axios'
import { ElMessage } from 'element-plus'


const dighumUrl = process.env.DIGHUM_URL;

let audios = reactive([])
const resource = reactive({
    comKey: {
        fileType: "AU",
        fileName: ""
    }
})

const isLoading = ref(false);

const getMyAudios = async () => {
    isLoading.value = true;
    // 发送请求
    await axios.post("/v1/resource/getResources", resource, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        isLoading.value = false;
        if (response.status = '200') {
            if (response.data.length == 0) {
                ElMessage.success('无满足条件的音频，请上传！');
            } else {
                //确保使用响应式的方式更新数组
                audios.splice(0, audios.length, ...response.data);
            }
        } else {
            ElMessage.error('获取音频列表异常，请联系管理员！');
        }

    }).catch(error => {
        isLoading.value = false;
        ElMessage.error('获取音频列表失败，请联系管理员！');
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
    height: 10px;
}

.video-description {
    margin-top: 0.5rem;
}

.video-list {
    margin-left: 25px;
    margin-top: 20px;
}
</style>