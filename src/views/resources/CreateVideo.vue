<template>
    <el-switch v-if="store.applyToIndustry('ME') || isEmpty(store.getUserInfo.industry)" v-model="isTextDrive"
        class="mb-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #00BFFF;left: 85px;"
        active-text="文本驱动" inactive-text="音频驱动" @onclick="switchTypes" />
    <div class="scrollable-container">
        <el-form ref="formRef" :model="form" label-width="80px" :label-position="top" class="driver-form">
            <!-- 文本驱动 -->
            <div v-if="isTextDrive">
                <el-form-item style="margin-top: 30px;">
                    <template #label>
                        <el-text style="font-weight: bolder; color: black;">细粒度控制（需添加<|phoneme_start|>标签），如：</el-text>
                        <el-text style="color: red;font-weight: bolder;">给</el-text>
                        <el-text style="color: #00BFFF;">予</el-text> 
                        <el-text style="font-weight: bolder; color: black;">&nbsp;&nbsp;可修改为&nbsp;&nbsp;</el-text> 
                        <el-text style="font-weight: bolder;color: red;"><|phoneme_start|>ji3<|phoneme_start|></el-text>
                        <el-text style="color: #00BFFF;">予</el-text>
                        <el-text style="font-weight: bolder;color: black">,  数字3代表取第三声</el-text>
                    </template>
                    <el-input v-model="form.textarea" maxlength="2000" style="width: 900px;"
                        placeholder="老师<|phoneme_start|>ji3<|phoneme_start|>予了我很多鼓励，让我在困难面前不再退缩。" show-word-limit type="textarea" :rows=5></el-input></el-form-item>
                <el-form-item>
                    <template #label>
                        <span class="gjxxLabel">高级选项</span>
                    </template>
                    <el-text>输出设置</el-text>
                    <el-radio-group v-model="form.output" style="margin-left: 30px;">
                        <!-- <el-radio value="0">驱动视频</el-radio> -->
                        <el-radio value="1">仅音频</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-form-item>
                        <template #label>
                            <span class="xzsyLabel">选择声音</span>
                            <el-pagination style="margin-top: 20px;" v-if="audios.length > 0" background
                                layout="total, sizes, prev, pager, next, jumper" :total="totalAudio"
                                :page-sizes="[8, 12, 16]" :pager-count="5" @size-change="handleSizeChangeAudio"
                                @current-change="handlePageChangeAudio" :current-page="currentPageAudio"
                                :page-size="pageSizeAudio" />
                            <div class="card-container">
                                <el-card v-for="(audio, index) in audios" :key="index"
                                    style="width: 250px;height: 200px;" :class="{ 'card-v active': index === auIndex }">
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
                        </template>
                        <el-text type="warning" v-if="audios.length == 0">无声音，需先进行声音克隆！</el-text>
                    </el-form-item>
                </el-form-item>
            </div>

            <!-- 音频驱动 -->
            <div v-if="!isTextDrive">
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
                                    limit=1 style="margin-top: 20px; width: 800px;" :on-change="handleAudioChange"
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
                            <el-button style="margin-left: 20px;" type="primary"
                                @click="openDrawer">点击复刻分身</el-button><el-icon @click="loadMyVideos('refresh')"
                                style="color: #6771ff;font-size: 25px; top: 8px;">
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
                                    <VideoPlayer width="210px" height="120px"
                                        :video-url="isEmpty(video.resourceUrl) ? video.resourceUrl : (dighumUrl + video.resourceUrl)"
                                        :poster="isCOSUrl(video.coverUrl) ? video.coverUrl : (dighumUrl + video.coverUrl)"
                                        :id="video.comKey.fileType + '@_@' + video.comKey.fileName" />

                                </el-card>
                            </div>
                        </template>
                        <el-text type="warning" v-if="videos.length == 0">无分身，可以先复刻分身！</el-text>
                    </el-form-item>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button type="success" @click="submitFiles" style="width: 900px; height: 50px; font-size: 20px;"
                    :loading="isLoading" :disabled="isButtonDisabled">提交
                </el-button>
            </el-form-item>
        </el-form>
    </div>

    <el-drawer v-model="uploadDrawer" direction="rtl" class="upload-drawer" size="45%">
        <template #title>
            <span class="syclTitle">视频生成数字分身</span>
        </template>
        <el-form ref="copyForm" :model="modelDighumForm" label-position="top" size="large" :rules="rules">
            <el-form-item prop="videoName">
                <template #label>
                    <span class="symcLabel">数字分身名称</span>
                </template>
                <el-input v-model="modelDighumForm.videoName" placeholder="请输入数字分身名称" />
            </el-form-item>
            <el-form-item>
                <template #label>
                    <span class="ckypLabel">上传视频</span>
                </template>
                <div class="consultationAudioDiv">
                    <h4 style="font-size: 15px; color: black; font-weight: bold;">视频要求</h4>
                    <el-text class="mx-1" type="success">视频方向：横向或纵向</el-text>
                    <el-text class="mx-1" type="primary" style="margin-left: 10px;">文件格式：mp4、mov</el-text>
                    <el-text class="mx-1" type="warning" style="margin-left: 10px;">视频时长：5秒~30分钟</el-text>
                    <el-text class="mx-1" type="info" style="margin-left: 10px;">分辨率：360p~4K</el-text>
                    <el-text class="mx-1" type="danger" style="margin-left: 10px;">文件大小：小于500M</el-text>
                </div>
                <el-upload class="upload-demo" drag multiple :auto-upload="false" :file-list="uploadVideoList" limit=1
                    style="margin-top: 40px;width: 100%;" :on-change="handleCopyVideoChange" :accept="`.mp4,.mov`"
                    :on-progress="handleProgress" :on-remove="avatarHandleRemove">
                    <el-progress v-if="avatarProgressVisible" :percentage="avatarUploadProgress" :color="ProgressColors"
                        type="dashboard"></el-progress>
                    <el-icon v-else class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text"><el-text class="mx-1" type="success"
                            size="large">将视频文件拖到此处，或<em>点击上传</em></el-text></div>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-form-item>
                <el-button @click="cancelForm" type="danger">取消</el-button>
                <el-button type="primary" :loading="cloneLoding" @click="uploadAndCopyVideo">
                    {{ cloneLoding ? '上传中...' : '确定' }}
                </el-button>
            </el-form-item>
        </template>
    </el-drawer>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import axios from '@/axios'
import VideoPlayer from "@/components/videos/videoPlayer.vue"
import moment from 'moment-timezone'
import { notify } from '@/common/Notification'
import router from '@/router'
import { deleteResource } from '@/common/ResourceUtils'
import { useUserStore } from '@/stores/UseUserStore';
import { ProgressColors, fileNameRegex } from '@/common/ApplicationConstant'
import { isEmpty, isCOSUrl } from '@/common/Objects'
import { fetchPreSignedUrl } from '@/common/ResourceUtils'

const store = useUserStore();
let userInfo = ref(store.getUserInfo);
const dighumUrl = process.env.DIGHUM_URL;
const audioVoverUrl = process.env.AUDIO_COVER_URL;
const isLoading = ref(false);
const isButtonDisabled = ref(false)
const cloneLoding = ref(false);
const isTextDrive = ref(true)
const fenshenShow = ref(true)
const formRef = ref(null)
const uploadDrawer = ref(false)
let form = reactive({
    output: '1',
    textarea: ''
})
const top = 'top'
let audios = reactive([])
let videos = reactive([])
const modelDighumForm = reactive({
    videoName: ''
})
const copyForm = ref(null);
const rules = reactive({
    videoName: [
        { required: true, message: '视频名称不能为空', trigger: 'blur' },
        { max: 100, message: '视频名过长', trigger: 'blur' },
        { pattern: fileNameRegex, message: '视频名称不能包含特殊字符或中文标点符号', trigger: 'blur' }
    ]
});
let uploadVideoList = []
const resourceAudios = reactive({
    comKey: {
        fileType: "AU",
    },
    tag: 'AI-Model'
})

const resourceVideos = reactive({
    comKey: {
        fileType: "VI",
    }
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


watch(form, (newValue, oldValue) => {
    if (newValue.output === '1') { //仅音频
        videos.length = 0;
        fenshenShow.value = false;
    }
    if (newValue.output === '0') {
        fenshenShow.value = true;
        loadMyVideos();
    }
}, { deep: true })

watch(isTextDrive, (newValue, oldValue) => {
    isButtonDisabled.value = false;
    if (newValue === false) { //仅音频
        audios.length = 0;
        loadMyAudios();
        auIndex.value = -1;
    } else {
        loadMyAudios();
        auIndex.value = -1;
    }
}, { deep: true })

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

const avatarHandleRemove = () => {
    uploadVideoList = [];
    avatarProgressVisible.value = false;
    avatarUploadProgress.value = 0;
}


const loadMyAudios = async () => {
    if (!isTextDrive.value) { //音频驱动
        resourceAudios.tag = 'AI';
    } else { //文本驱动
        resourceAudios.tag = 'AI-Model';
    }
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
    if (form.output === '1') {
        loadMyAudios();
        loadMyVideos();
    }
});

const openDrawer = (type) => {
    uploadDrawer.value = true;
}

const cancelForm = () => {
    uploadDrawer.value = false
}

function handleCopyVideoChange(file, fileList) {
    uploadVideoList = fileList;
}


async function toggleCheckmarkAu(index, audio) {
    auIndex.value = index
    auVoiceId = audio.voiceId
    audioUrl = audio.resourceUrl
    if (isEmpty(audio.resourceUrl)) {
        let preSinedUrl = await fetchPreSignedUrl(audio.comKey.fileType + "@_@" + audio.comKey.fileName);
        audioUrl = preSinedUrl;
    }
    if ("1" === form.output) {
        audioFileName = audio.comKey.fileName
        fishId = audio.fishId
    }
}


async function toggleCheckmarkVi(index, video) {
    viIndex.value = index
    resUrl = video.resourceUrl
    if (isEmpty(video.resourceUrl)) {
        let preSinedUrl = await fetchPreSignedUrl(video.comKey.fileType + "@_@" + video.comKey.fileName);
        resUrl = preSinedUrl;
    }
    if ("0" === form.output || !isTextDrive.value) {
        videoFileName = video.comKey.fileName;
    }
}

function validBeforeCreateAIData(reqJson) {
    if ("0" === form.output) {
        if (isNull(reqJson.voice_id) || isNull(reqJson.video_url)) {
            ElMessage.success('请选择音频或者分身！');
            return false;
        }
    }
    // if ("1" === form.output && isNull(reqJson.voice_id)) {
    //     ElMessage.success('请选择音频！');
    //     return false;
    // }
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

// 提交文件
function submitFiles() {
    var outputType = form.output;
    //文本驱动
    if (isTextDrive.value) {
        let reqJson = {
            output: form.output,
            text: form.textarea,
            voice_id: auVoiceId,
            voice_type: 9,
            video_url: '',
            only_generate_audio: null,
            fileName: audioFileName,
            fishId: fishId
        }
        if ("0" === outputType && !isNull(resUrl)) {
            reqJson.video_url = dighumUrl + resUrl;
        }
        if ("1" === outputType) {
            reqJson.only_generate_audio = 1;
        }
        if (!validBeforeCreateAIData(reqJson)) {
            return;
        }
        isLoading.value = true;
        // 发送请求
        axios.put("/v1/resource/cloud/textDrive/audio", reqJson, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 0
        }).then(response => {
            normalResponse(response);
        }).catch(error => {
            errorResponse(error);
        });
    }
    //音频驱动
    if (!isTextDrive.value) {
        //选择声音模板
        if (audioWay.value == "1") {
            let reqJson = {
                video_url: resUrl.startsWith("/") ? (dighumUrl + resUrl) : resUrl,
                audio_url: audioUrl.startsWith("/") ? (dighumUrl + audioUrl) : audioUrl,
                fileName: videoFileName
            }
            if (reqJson.audio_url == dighumUrl || isNull(reqJson.audio_url)) {
                notify('Warning', '请选择音频！', 'warning', 5000);
                return;
            }
            if (reqJson.video_url == dighumUrl || isNull(reqJson.video_url)) {
                notify('Warning', '请选择分身！', 'warning', 5000);
                return;
            }
            isLoading.value = true;
            //发送请求
            axios.post("/v1/resource/cloud/audioDrive/createTask", reqJson, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                normalResponse(response);
            }).catch(error => {
                errorResponse(error);
            });
        }
        //本地音频上传
        if (audioWay.value == "2") {
            var videoUrl = resUrl.startsWith("/") ? (dighumUrl + resUrl) : resUrl;
            if (audioList.length == 0) {
                notify('Warning', '请选择本地音频！', 'warning', 5000);
                return;
            }
            if (isNull(videoUrl) || videoUrl == dighumUrl) {
                notify('Warning', '请选择分身！', 'warning', 5000);
                return;
            }
            const formData = new FormData();
            formData.append('fileName', videoFileName)
            formData.append('videoUrl', videoUrl)
            formData.append('localAudioFile', audioList[0].raw);
            axios.put("/v1/resource/cloud/localAudioDrive/createTask", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 300000,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    handleProgress({ percent: percentCompleted, flag: funFlag.localAudio });
                }
            }).then(response => {
                normalResponse(response);
            }).catch(error => {
                errorResponse(error);
            });
        }
    }

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

async function checkBeforeSubmit(file) {
    const isLt500M = file.size / 1024 / 1024 <= 500;
    if (!isLt500M) {
        ElMessage.error('文件大小不能超过500MB!');
        return false;
    }
    //let reader = new FileReader();
    var url = URL.createObjectURL(file.raw);
    var audioElement = new Audio(url);
    const duration = await new Promise((resolve) => {
        audioElement.addEventListener('loadedmetadata', function () {
            resolve(parseInt(audioElement.duration));
        })
    })
    //时长为秒
    if (duration < 5 || duration > 1800) {
        ElMessage.error('音频时长需要5秒~30分钟!');
        return false;
    }
    return true;
}


const uploadAndCopyVideo = (async () => {
    copyForm.value.validate(async (valid) => {
        if (valid) {
            if (uploadVideoList.length == 0) {
                ElNotification({
                    title: 'Warning ',
                    message: '请选择视频文件上传！',
                    type: 'warning',
                })
                return;
            }
            const result = await checkBeforeSubmit(uploadVideoList[0]);
            if (!result) {
                return;
            }
            const fileSize = uploadVideoList[0].size / 1024 / 1024;
            if (fileSize >= 88) {
                ElMessage.success('分身文件较大，请耐心等待上传处理！');
            }
            cloneLoding.value = true
            const formData = new FormData();
            formData.append('fileName', modelDighumForm.videoName)
            formData.append('videoFile', uploadVideoList[0].raw);
            axios.put("/v1/resource/cloud/dighumCreate", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 0,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    handleProgress({ percent: percentCompleted, flag: funFlag.avatar });
                }
            }).then(response => {
                cloneLoding.value = false
                uploadDrawer.value = false
                if (response.status == '200') {
                    var code = response.data.code;
                    if (code == '0' || code == '200') {
                        ElMessage.success('数字分身创建成功！');
                    } else {
                        ElMessage.error('创建失败: ' + response.data.remarks);
                    }
                } else {
                    ElMessage.error('创建异常，请联系管理员!');
                }
            }).catch(error => {
                cloneLoding.value = false
                uploadDrawer.value = false
                console.log(error);
                ElMessage.error('数字分身创建失败，请联系管理员!');
            });
        }
    })
})

function audioWayChange() {
    localAudio.value = (audioWay.value == "2" ? true : false);
}

function handleAudioChange(file, fileList) {
    audioList = fileList;
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