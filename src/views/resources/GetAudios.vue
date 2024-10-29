<template>
    <el-form :inline="true" :model="resource" class="demo-form-inline">
        <el-form-item label="文件名" class="fileName">
            <el-input v-model="resource.comKey.fileName" clearable />
        </el-form-item>
        <el-form-item label="类型">
            <el-select v-model="resource.tag" placeholder="请选择" size="large" style="width: 240px">
                <el-option v-for="(value, key) in Tag" :key="key" :label="value" :value="key" />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getMyAudios" :loading="isLoading">查询</el-button>
        </el-form-item>
    </el-form>
    <el-pagination style="margin-top: 20px; margin-left: 28px;" v-if="audios.length > 0" background
        layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[12, 16, 20]" :pager-count="5"
        @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="currentPage"
        :page-size="pageSize" />
    <div class="video-list">
        <el-card v-for="(audio, index) in audios" :key="index" body-style="height: 100px"
            :class="{ selected: isSelected }">
            <template #header>
                <div class="card-header">
                    <el-tooltip class="box-item" effect="dark"
                        :content="moment(audio.createDate).utc().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss') + ': ' + audio.showFileName"
                        placement="top-start">
                        <span style="font-size: 15px;"><el-tag size="small" effect="dark" type="success"
                                :key="audio.voiceId">{{ VoiceCloneType[audio.tag] }}</el-tag> <e-text> -
                            </e-text>{{  moment(audio.createDate).format('HH:mm:ss') + ': ' + audio.showFileName
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
                                <el-dropdown-item command="delete"
                                    @click="deleteResource(audio, audios)">删除</el-dropdown-item>
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
import moment from 'moment-timezone';
import { deleteResource, downloadResource } from '@/common/ResourceUtils'
import { Tag } from '@/common/DropdownList'
import { isEmpty } from '@/common/Objects'


const dighumUrl = process.env.DIGHUM_URL;
const audioVoverUrl = process.env.AUDIO_COVER_URL;

let audios = reactive([])
const resource = reactive({
    comKey: {
        fileType: "AU",
        fileName: ""
    },
    tag: null
})
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

const isLoading = ref(false);
const isSelected = ref(true);

const handleSizeChange = (newPageSize) => {
    pageSize.value = newPageSize;
    getMyAudios(); // 切换页码时，重新加载数据
};


const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    getMyAudios(); // 切换页码时，重新加载数据
};

const getMyAudios = async () => {
    isLoading.value = true;
    resource.tag = isEmpty(resource.tag) ? 'AI' : resource.tag;
    console.log('resource.tag');
    // 发送请求
    await axios.post("/v1/resource/paging/getResources", resource, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 20000,
        params: {
            page: currentPage.value - 1, //后端从0开始前端从1开始
            pageSize: pageSize.value
        }
    }).then(response => {
        isLoading.value = false;
        if (response.status = '200') {
            if (response.data.totalElements == 0) {
                ElMessage.success('无满足条件的音频，请上传！');
            } else {
                total.value = response.data.totalElements;
                //确保使用响应式的方式更新数组
                audios.splice(0, audios.length, ...response.data.content);
            }
        } else {
            ElMessage.error('获取音频列表异常，请联系管理员！');
        }

    }).catch(error => {
        isLoading.value = false;
        ElMessage.error('获取音频列表失败，请联系管理员！');
    });
}

// const downloadResource = (async (audio) => {
//     const response = await axios.get(dighumUrl + audio.resourceUrl, {
//         responseType: 'blob' // 设置响应类型为Blob
//     });
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', audio.comKey.fileName); // 设置文件名
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link); // 清理
//     window.URL.revokeObjectURL(url); // 释放URL对
// })

// function deleteResource(audio) {
//     axios.delete("/v1/resource/deleteResource", { data: audio }, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).then(response => {
//         if (response.status = '200') {
//             const index = audios.findIndex(resource =>
//                 resource.comKey.userId === audio.comKey.userId &&
//                 resource.comKey.fileType === audio.comKey.fileType &&
//                 resource.comKey.fileName === audio.comKey.fileName
//             );
//             if (index !== -1) {
//                 audios.splice(index, 1);
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
    height: 10px;
    width: 160px;
}

.video-description {
    margin-top: 0.5rem;
}
</style>