<template>
    <div class="scrollable-container">
        <el-form ref="formRef" :model="form" label-width="80px" :label-position="top" class="driver-form"
            :rules="driveRules">
            <!-- 音频驱动 -->
            <div>
                <el-form-item style="margin-top: 30px;" prop="newFileName">
                    <el-input v-model="form.newFileName" placeholder="请输入文件名（非必填）" style="width: 900px;" maxlength="50"
                        show-word-limit />
                </el-form-item>
                <el-form-item>
                    <el-form-item>
                        <template #label>
                            <!-- <span class="xzsyLabel">选择声音模板</span> -->
                            <div style="margin-top: 20px">
                                <el-radio-group v-model="audioWay" @change="audioWayChange">
                                    <el-radio-button label="选择声音" type value="1" />
                                    <el-radio-button label="本地音频" value="2" />
                                </el-radio-group>
                            </div>
                            <div v-if="!localAudio">
                                <el-pagination style="margin-top: 20px;" v-if="audios.length > 0" background
                                    layout="total, sizes, prev, pager, next, jumper" :total="totalAudio"
                                    :page-sizes="[8, 12, 16]" :pager-count="5" @size-change="handleSizeChangeAudio"
                                    @current-change="handlePageChangeAudio" :current-page="currentPageAudio"
                                    :page-size="pageSizeAudio" />
                                <div class="card-container">
                                    <el-card v-for="(audio, index) in audios" :key="index"
                                        style="width: 250px;height: 200px;"
                                        :class="{ 'card-v active': index === auIndex }">
                                        <template #header>
                                            <div class="card-header" @click="toggleCheckmarkAu(index, audio)">
                                                <el-tooltip class="box-item" effect="dark"
                                                    :content="moment(audio.createDate).format('YYYY-MM-DD HH:mm:ss') + ': ' + audio.showFileName"
                                                    placement="top-start">
                                                    <span style="font-size: 15px;">{{ audio.showFileName }}</span>
                                                </el-tooltip>
                                                <div :class="{ 'div-checkmark active': index === auIndex }">
                                                    <span :class="{ 'checkmark active': index === auIndex }"
                                                        v-if="index == auIndex">
                                                        <el-icon>
                                                            <Check />
                                                        </el-icon>
                                                    </span>
                                                </div>

                                                <el-dropdown>
                                                    <span class="el-dropdown-link">
                                                        <el-icon class="el-icon--right"><arrow-down /></el-icon>
                                                    </span>
                                                    <template #dropdown>
                                                        <el-dropdown-menu>
                                                            <el-dropdown-item command="delete"
                                                                @click="deleteResource(audio, audios)">删除</el-dropdown-item>
                                                        </el-dropdown-menu>
                                                    </template>
                                                </el-dropdown>
                                            </div>
                                        </template>
                                        <VideoPlayer width="210px" height="120px"
                                            :video-url="isEmpty(audio.resourceUrl) ? audio.resourceUrl : (dighumUrl + audio.resourceUrl)"
                                            :poster="dighumUrl + audioVoverUrl"
                                            :id="audio.comKey.fileType + '@_@' + audio.comKey.fileName" />

                                    </el-card>
                                </div>
                            </div>
                            <div v-else>
                                <el-upload class="upload-demo" drag multiple :auto-upload="false" :file-list="audioList"
                                    limit=1 style="margin-top: 20px; width: 900px;" :on-change="handleAudioChange"
                                    :accept="`.mp3,.m4a,.wav`" :on-progress="handleProgress"
                                    :on-remove="localAudioHandleRemove">
                                    <el-progress v-if="localAudioProgressVisible" :percentage="localAudioUploadProgress"
                                        :color="ProgressColors" type="dashboard"></el-progress>
                                    <img v-else src="@/assets/images/svg/file_upload.svg" alt="Logo"
                                        style="width: 50px;" />
                                    <div class="el-upload__text"><el-text class="mx-1" type="success"
                                            size="large">将音频文件拖到此处，或<em>点击上传</em></el-text></div>
                                </el-upload>
                            </div>
                        </template>
                        <el-text type="warning" v-if="audios.length == 0 && !localAudio">无声音，需先生成AI音频！</el-text>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-form-item>
                        <template #label>
                            <span class="gjxxLabel">分身选择</span>
                            <!-- <el-button style="margin-left: 20px;" type="primary"
                                @click="openDrawer">点击复刻分身</el-button>-->
                            <el-icon @click="loadMyVideos('refresh')" style="color: #6771ff;font-size: 25px; top: 8px;">
                                <Refresh />
                            </el-icon>
                            <el-pagination style="margin-top: 20px;" v-if="videos.length > 0" background
                                layout="total, sizes, prev, pager, next, jumper" :total="totalVideo"
                                :page-sizes="[8, 12, 16]" :pager-count="5" @size-change="handleSizeChangeVideo"
                                @current-change="handlePageChangeVideo" :current-page="currentPageVideo"
                                :page-size="pageSizeVideo" />
                            <div class="card-container">
                                <el-card v-for="(video, index) in videos" :key="index"
                                    style="width: 250px;height: 200px;" :class="{ 'card-v active': index === viIndex }">
                                    <template #header>
                                        <div class="card-header" @click="toggleCheckmarkVi(index, video)">
                                            <el-tooltip class="box-item" effect="dark"
                                                :content="moment(video.createDate).format('YYYY-MM-DD HH:mm:ss') + ': ' + video.showFileName"
                                                placement="top-start">
                                                <span style="font-size: 15px;">{{ video.showFileName
                                                }}</span></el-tooltip>
                                            <div :class="{ 'div-checkmark active': index === viIndex }">
                                                <span :class="{ 'checkmark active': index === viIndex }"
                                                    v-if="index == viIndex">
                                                    <el-icon>
                                                        <Check />
                                                    </el-icon>
                                                </span>
                                            </div>
                                            <el-dropdown>
                                                <span class="el-dropdown-link">
                                                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                                                </span>
                                                <template #dropdown>
                                                    <el-dropdown-menu>
                                                        <el-dropdown-item command="delete"
                                                            @click="deleteResource(video, videos)">删除</el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </template>
                                            </el-dropdown>
                                        </div>
                                    </template>
                                    <VideoPlayer v-if="video.status == 'PUBLISHED'" width="210px" height="120px"
                                        :video-url="video.resourceUrl"
                                        :poster="isCOSUrl(video.coverUrl) ? video.coverUrl : (dighumUrl + video.coverUrl)"
                                        :id="video.comKey.fileType + '@_@' + video.comKey.fileName" />
                                    <el-text type="danger" style="font-size: 20px;">{{ Status[video.status] }}</el-text>
                                </el-card>
                            </div>
                        </template>
                        <el-text type="warning" v-if="videos.length == 0">无分身，可以先进行形象克隆！</el-text>
                    </el-form-item>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button type="success" @click="aiDoppelganger" style="width: 80%; height: 50px; font-size: 20px;"
                    :loading="isLoading" :disabled="isButtonDisabled">创建
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import axios from '@/axios'
import VideoPlayer from "@/components/videos/videoPlayer.vue"
import moment from 'moment-timezone'
import { notify } from '@/common/Notification'
import router from '@/router'
import { deleteResource } from '@/common/ResourceUtils'
import { ProgressColors, fileNameRegex } from '@/common/ApplicationConstant'
import { isEmpty, isCOSUrl } from '@/common/Objects'
import { fetchPreSignedUrl } from '@/common/ResourceUtils'
import { Status } from '@/common/Status'

const dighumUrl = process.env.DIGHUM_URL;
const audioVoverUrl = process.env.AUDIO_COVER_URL;
const isLoading = ref(false);
const isButtonDisabled = ref(false)
const formRef = ref(null)
const uploadDrawer = ref(false)
let form = reactive({
    newFileName: '',
})
const top = 'top'
let audios = reactive([])
let videos = reactive([])
const driveRules = reactive({
    newFileName: [
        { pattern: fileNameRegex, message: '文件名不能包含特殊字符或中文标点符号', trigger: 'blur' }
    ]
});
const resourceAudios = reactive({
    comKey: {
        fileType: "AU",
    },
    tag: 'AI'
})

const resourceVideos = reactive({
    comKey: {
        fileType: "VI",
    },
    tag: "AI-Model",
    taskId: "NON-NULL"
})
const currentPageAudio = ref(1)
const pageSizeAudio = ref(8)
const totalAudio = ref(0)
const currentPageVideo = ref(1)
const pageSizeVideo = ref(8)
const totalVideo = ref(0)
const audioWay = ref('1')
const localAudio = ref(false)
const funFlag = {
    avatar: "avatar",
    localAudio: "localAudio"
}
const avatarProgressVisible = ref(false)
const avatarUploadProgress = ref(0)
const localAudioProgressVisible = ref(false)
const localAudioUploadProgress = ref(0)
const auIndex = ref(-1)
const viIndex = ref(-1)

let audioList = []
let videoFileName;
let auVoiceId = ''
let audioFileName = ''
let audioUrl = ''
let fishId = ''
let resUrl = ''
const baseVideoDto = reactive({
    Payload: {
        InputAudioUrl: '',
        VideoParam: 'N',
        VirtualmanKey: ''
    }
})

const handleSizeChangeAudio = (newPageSize) => {
    pageSizeAudio.value = newPageSize;
    loadMyAudios(); // 切换页码时，重新加载数据
};


const handlePageChangeAudio = (newPage) => {
    currentPageAudio.value = newPage;
    loadMyAudios(); // 切换页码时，重新加载数据
};

const handleSizeChangeVideo = (newPageSize) => {
    pageSizeVideo.value = newPageSize;
    loadMyVideos(); // 切换页码时，重新加载数据
};


const handlePageChangeVideo = (newPage) => {
    currentPageVideo.value = newPage;
    loadMyVideos(); // 切换页码时，重新加载数据
};


const handleProgress = (event) => {
    if (event.flag == funFlag.avatar) {
        avatarProgressVisible.value = true;
        avatarUploadProgress.value = Math.round(event.percent);
    }
    if (event.flag == funFlag.localAudio) {
        localAudioProgressVisible.value = true;
        localAudioUploadProgress.value = Math.round(event.percent);
    }
}

const localAudioHandleRemove = () => {
    audioList = [];
    localAudioProgressVisible.value = false;
    localAudioUploadProgress.value = 0;
}

const loadMyAudios = async () => {
    // 发送请求
    await axios.post("/v1/resource/paging/getResources", resourceAudios, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 20000,
        params: {
            page: currentPageAudio.value - 1, //后端从0开始前端从1开始
            pageSize: pageSizeAudio.value
        }
    }).then(response => {
        if (response.status = '200') {
            if (response.data.totalElements > 0) {
                totalAudio.value = response.data.totalElements;
                //确保使用响应式的方式更新数组
                audios.splice(0, audios.length, ...response.data.content);
            }
        }
    }).catch(error => {
        ElMessage.error('获取声音列表失败，请联系管理员！');
    });

}


const loadMyVideos = async (flag) => {
    if (flag == "refresh") {
        currentPageVideo.value = 1;
        pageSizeVideo.value = 8;
        videos.length = 0;
    }
    // 发送请求
    await axios.post("/v1/resource/paging/getResources", resourceVideos, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 20000,
        params: {
            page: currentPageVideo.value - 1, //后端从0开始前端从1开始
            pageSize: pageSizeVideo.value
        }
    }).then(response => {
        if (response.status = '200') {
            if (response.data.totalElements > 0) {
                totalVideo.value = response.data.totalElements;
                //确保使用响应式的方式更新数组
                videos.splice(0, videos.length, ...response.data.content);
            }
        }
    }).catch(error => {
        ElMessage.error('获取视频列表失败，请联系管理员！');
    });
}

onMounted(() => {
    loadMyAudios();
    loadMyVideos();
});

const openDrawer = (type) => {
    uploadDrawer.value = true;
}

/**
 * @description Select audio
 * @param index 
 * @param audio 
 */
async function toggleCheckmarkAu(index, audio) {
    auIndex.value = index
    auVoiceId = audio.voiceId
    baseVideoDto.Payload.InputAudioUrl = audio.resourceUrl;
    if (isEmpty(audio.resourceUrl)) {
        let preSinedUrl = await fetchPreSignedUrl(audio.comKey.fileType + "@_@" + audio.comKey.fileName);
        baseVideoDto.Payload.InputAudioUrl = preSinedUrl;
    }
}

/**
 * @description Select AI-Model
 * @param index 
 * @param video 
 */
async function toggleCheckmarkVi(index, video) {
    viIndex.value = index;
    baseVideoDto.Payload.VirtualmanKey = video.dmVirtualManKey;
     videoFileName = video.showFileName;
}

function validBeforeCreateAIData(reqJson) {
    if ("0" === form.output) {
        if (isNull(reqJson.voice_id) || isNull(reqJson.video_url)) {
            ElMessage.success('请选择音频或者分身！');
            return false;
        }
    }
    if ("1" === form.output && isNull(reqJson.fishId)) {
        ElMessage.success('请选择音频！');
        return false;
    }
    if (reqJson.fileName == null || reqJson.fileName == '') {
        ElMessage.success('未获取到文件名！');
        return false;
    }
    return true;
}

function isNull(obj) {
    if (obj == null || obj == '') {
        return true;
    }
    return false;
}

function normalResponse(response) {
    isLoading.value = false;
    if (response.status == '200') {
        var code = response.data.code;
        if (code == '0' || code == '200') {
            notify('提交成功', '处理中，可到作品管理查询进度并下载！', 'success', 10000);
            router.push('/myResources');
        } else {
            notify('失败', response.data.remarks, 'error', 10000);
        }
    } else {
        notify('失败', '内部异常，请联系管理员!', 'error', 10000);
    }
}

function errorResponse(error) {
    isLoading.value = false;
    isButtonDisabled.value = true;
    notify('失败', '异常：' + error, 'error', 10000);
}

function audioWayChange() {
    localAudio.value = (audioWay.value == "2" ? true : false);
}

function handleAudioChange(file, fileList) {
    audioList = fileList;
}

const freeze = (bValue) => {
    isLoading.value = bValue
    isButtonDisabled.value = bValue
}

const aiDoppelganger = async () => {
    const valid = await formRef.value.validate();
    if (!valid) return;
    //云音频驱动
    if (audioWay.value == "1") {
        //校验必填
        if (isEmpty(baseVideoDto.Payload.InputAudioUrl) || isEmpty(baseVideoDto.Payload.VirtualmanKey)) {
            notify('Warning', '请选择音频和分身！', 'warning');
            return;
        }
        //开始推理任务
        freeze(true);
        axios.post("/v1/dm/video/base-vid", baseVideoDto, {
            headers: {
                'Content-Type': 'application/json'
            },
            params: { fileName: form.newFileName },
            timeout: 0
        }).then(response => {
            freeze(false);
            if (response.status == '200') {
                var code = response.data.code;
                if (code == '0' || code == '200') {
                    notify('Success', '创建AI推理任务成功！', 'success');
                    router.push('/myResources');
                } else {
                    notify('Error', '创建AI推理任务失败: ' + response.data.remarks, 'error');
                }
            } else {
                notify('Error', '创建AI推理任务异常，请联系管理员!', 'error');
            }
        }).catch(error => {
            freeze(false);
            console.log(error);
            notify('Error', '创建AI推理任务内部异常，请联系管理员!', 'error');
        });
    }
    //本地音频驱动
    if (audioWay.value == "2") {
        if (audioList.length == 0) {
            notify('Warning', '请选择本地音频！', 'warning', 5000);
            return;
        }
         //校验必填
        if (isEmpty(baseVideoDto.Payload.VirtualmanKey)) {
            notify('Warning', '请选择分身！', 'warning');
            return;
        }
        //开始推理任务
        freeze(true);
        const formData = new FormData();
        formData.append('fileName', videoFileName + "@@" + form.newFileName)
        formData.append('virtualmanKey', baseVideoDto.Payload.VirtualmanKey)
        formData.append('localAudioFile', audioList[0].raw);
        axios.put("v1/dm/localAudioDrive/video/base-vid", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 300000,
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                handleProgress({ percent: percentCompleted, flag: funFlag.localAudio });
            }
        }).then(response => {
            freeze(false);
            normalResponse(response);
        }).catch(error => {
            freeze(false);
            errorResponse(error);
        });
    }
}



</script>

<style scoped>
.upload-demo {
    width: 900px;
}

.driver-form {
    margin-left: 85px;
}

.el-upload-dragger {
    width: 300px;
}

.el-upload.el-upload--picture-card.is-drag {
    width: 300px;
    height: 300px;
}

.gjxxLabel {
    font-weight: bold;
    color: black;
}

.xzsyLabel {
    font-weight: bold;
    color: black;
}

.card-container {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    /* If you want the cards to wrap to the next line when space runs out */
    justify-content: flex-start;
    /* Space between cards */
    gap: 1rem;

    .card-v {
        width: 86px;
        height: 36px;
        line-height: 36px;
        border: 1px solid #67e5ff;
        border-radius: 4px;
        font-size: 14px;
        position: relative;
        overflow: hidden;
    }

    .card-v .div-checkmark {
        width: 50px;
        height: 50px;
        position: absolute;
        background: #67e5ff;
        top: -25px;
        right: -25px;
        transform: rotate(45deg);
    }

    .card-v .div-checkmark .checkmark {
        position: absolute;
        margin-top: 50px;
        margin-left: 20px;
        transform: translate(-50%, -50%) rotate(-45deg);
        /* 中心旋转 */
        display: block;
        color: #050706;
    }
}

.card-header {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 10px;
}

.el-tooltip {
    width: 150%;
}

.el-icon {
    margin-left: 20px;
    cursor: pointer;
}
</style>