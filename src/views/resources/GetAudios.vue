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
        <el-card v-for="(audio, index) in audios" :key="index" body-style="height: 100px"
            :class="{ selected: isSelected }">
            <template #header>

                <div class="card-header">
                    <el-tooltip class="box-item" effect="dark" :content="audio.showFileName" placement="top-start">
                        <span style="font-size: 15px;"><el-tag v-if="audio.tag" size="small" effect="dark"
                                type="success" :key="audio.voiceId">{{ VoiceCloneType[audio.tag] }}</el-tag> <e-text
                                v-if="audio.tag"> -
                            </e-text>{{ audio.showFileName
                            }}</span>
                    </el-tooltip>
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="download"
                                    @click="downloadResource(audio)">下载</el-dropdown-item>
                                <el-dropdown-item command="delete" @click="deleteResource(audio)">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </template>
            <VideoPlayer width="160px" height="60px" :video-url="dighumUrl + audio.resourceUrl"
                :poster="dighumUrl + audioVoverUrl"
                :id="audio.comKey.userId + '@_@' + audio.comKey.fileType + '@_@' + audio.comKey.fileName" />
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import VideoPlayer from "@/components/videos/videoPlayer.vue"
import axios from '@/axios'
import { ElMessage, ElNotification } from 'element-plus'
import { VoiceCloneType } from '@/common/VoiceCloneType'


const dighumUrl = process.env.DIGHUM_URL;
const audioVoverUrl = process.env.AUDIO_COVER_URL;

let audios = reactive([])
const resource = reactive({
    comKey: {
        fileType: "AU",
        fileName: ""
    },
    tag: 'ALL'
})

const isLoading = ref(false);
const isSelected = ref(true)

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

const downloadResource = (async (audio) => {
    const response = await axios.get(dighumUrl + audio.resourceUrl, {
        responseType: 'blob' // 设置响应类型为Blob
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', audio.comKey.fileName); // 设置文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // 清理
    window.URL.revokeObjectURL(url); // 释放URL对
})

function deleteResource(audio) {
    axios.delete("/v1/resource/deleteResource", { data: audio }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status = '200') {
            const index = audios.findIndex(resource =>
                resource.comKey.userId === audio.comKey.userId &&
                resource.comKey.fileType === audio.comKey.fileType &&
                resource.comKey.fileName === audio.comKey.fileName
            );
            if (index !== -1) {
                audios.splice(index, 1);
                ElNotification({
                    title: 'Success',
                    message: '删除成功',
                    type: 'success',
                });
            }
        } else {
            ElNotification({
                title: 'Error ',
                message: '删除失败，请联系管理员！',
                type: 'error',
            })
        }

    }).catch(error => {
        ElNotification({
            title: 'Error ',
            message: '内部异常，请联系管理员！' + error,
            type: 'error',
        })
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
    margin-left: 25px;
    margin-top: 20px;
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
</style>