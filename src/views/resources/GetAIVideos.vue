<template>
    <el-form :inline="true" :model="resource" class="demo-form-inline">
        <el-form-item label="文件名" class="fileName">
            <el-input v-model="resource.comKey.fileName" clearable />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getMyVideos" :loading="isLoading">查询</el-button>
        </el-form-item>
    </el-form>
    <div class="video-list">
        <el-card v-for="(video, index) in videos" :key="index" style="width: 250px;height: 200px;">
            <template #header>
                <div class="card-header">
                    <el-tooltip class="box-item" effect="dark" :content=" moment(video.createDate).format('YYYY-MM-DD HH:mm:ss')+': '+video.showFileName" placement="top-start">
                        <div class="card-header">
                            <span style="font-size: 15px;">{{ video.showFileName
                                }}</span>
                        </div>
                    </el-tooltip>
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="download"
                                    @click="downloadResource(video)">下载</el-dropdown-item>
                                <el-dropdown-item command="delete" @click="deleteResource(video)">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </template>
            <VideoPlayer v-if="video.status == 3" width="210px" height="120px"
                :video-url="dighumUrl + video.resourceUrl" :poster="dighumUrl + video.coverUrl"
                :id="video.comKey.userId + '@_@' + video.comKey.fileType + '@_@' + video.comKey.fileName" />
            <el-text type="danger">{{ Status[video.status] }}</el-text>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import VideoPlayer from "@/components/videos/videoPlayer.vue"
import axios from '@/axios'
import { ElMessage, ElNotification } from 'element-plus'
import { Status } from '@/common/Status'
import moment from 'moment-timezone'
import { deleteResource, downloadResource } from '@/common/ResourceUtils'


const dighumUrl = process.env.DIGHUM_URL;

let videos = reactive([])
const resource = reactive({
    comKey: {
        fileType: "VI",
        fileName: ""
    },
    tag: "AI"
})

const isLoading = ref(false);

const getMyVideos = async () => {
    isLoading.value = true;
    // 发送请求
    await axios.post("/v1/resource/getResources", resource, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 20000
    }).then(response => {
        isLoading.value = false;
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

    }).catch(error => {
        isLoading.value = false;
        ElMessage.error('获取视频列表失败，请联系管理员！');
    });
}

// const downloadResource = (async (video) => {
//     const response = await axios.get(dighumUrl + video.resourceUrl, {
//         responseType: 'blob' // 设置响应类型为Blob
//     });
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     const fileExtension = video.resourceUrl.split('.').pop();
//     link.setAttribute('download', video.comKey.fileName + '.' + fileExtension); // 设置文件名
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link); // 清理
//     window.URL.revokeObjectURL(url); // 释放URL对
// })

// function deleteResource(video) {
//     axios.delete("/v1/resource/deleteResource", { data: video }, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).then(response => {
//         if (response.status = '200') {
//             const index = videos.findIndex(resource =>
//                 resource.comKey.userId === video.comKey.userId &&
//                 resource.comKey.fileType === video.comKey.fileType &&
//                 resource.comKey.fileName === video.comKey.fileName
//             );
//             if (index !== -1) {
//                 videos.splice(index, 1);
//                 ElNotification({
//                     title: 'Success',
//                     message: '删除成功',
//                     type: 'success',
//                 });
//             }
//         } else {
//             ElNotification({
//                 title: 'Error ',
//                 message: '删除失败，请联系管理员！',
//                 type: 'error',
//             })
//         }

//     }).catch(error => {
//         ElNotification({
//             title: 'Error ',
//             message: '内部异常，请联系管理员！' + error,
//             type: 'error',
//         })
//     });
// }


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
}

.video-description {
    margin-top: 0.5rem;
}
</style>