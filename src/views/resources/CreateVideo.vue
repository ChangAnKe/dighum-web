<template>
    <el-switch v-model="isTextDrive" class="mb-2"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #00BFFF;left: 85px;" active-text="文本驱动"
        inactive-text="音频驱动" @onclick="switchTypes" />
    <div class="scrollable-container">
        <el-form ref="formRef" :model="form" label-width="80px" :label-position="top" class="driver-form">
            <!-- 文本驱动 -->
            <div v-if="isTextDrive">
                <el-form-item><el-input v-model="form.textarea" maxlength="2000" style="width: 900px;margin-top: 50px;"
                        placeholder="请输入文本" show-word-limit type="textarea" :rows=5></el-input></el-form-item>
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
                <!-- <el-form-item>
                    <el-upload class="upload-demo" drag multiple :auto-upload="false" :file-list="videoList" limit=1
                        style="margin-top: 10px;" :on-change="handleVideoChange">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text"><el-text class="mx-1" type="success"
                                size="large">将视频文件拖到此处，或<em>点击上传</em></el-text></div>
                        <template #tip>

                        </template>
                    </el-upload>
                </el-form-item> -->
                <el-form-item>
                    <el-form-item>
                        <template #label>
                            <span class="xzsyLabel">选择声音</span>
                            <el-pagination style="margin-top: 20px; margin-left: 28px;" v-if="audios.length > 0"
                                background layout="total, sizes, prev, pager, next, jumper" :total="totalAudio"
                                :page-sizes="[8, 12, 16]" :pager-count="5" @size-change="handleSizeChangeAudio"
                                @current-change="handlePageChangeAudio" :current-page="currentPageAudio"
                                :page-size="pageSizeAudio" />
                            <div class="card-container">
                                <el-card v-for="(audio, index) in audios" :key="index"
                                    style="width: 250px;height: 200px;" :class="{ 'card-v active': index === auIndex }">
                                    <template #header>
                                        <el-tooltip class="box-item" effect="dark"
                                            :content="moment(audio.createDate).format('YYYY-MM-DD HH:mm:ss') + ': ' + audio.showFileName"
                                            placement="top-start">
                                            <div class="card-header" @click="toggleCheckmarkAu(index, audio)">
                                                <span style="font-size: 15px;">{{ audio.showFileName }}</span>
                                                <div :class="{ 'div-checkmark active': index === auIndex }">
                                                    <span :class="{ 'checkmark active': index === auIndex }"
                                                        v-if="index == auIndex">
                                                        <el-icon>
                                                            <Check />
                                                        </el-icon>
                                                    </span>
                                                </div>
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <VideoPlayer width="210px" height="120px" :video-url="dighumUrl + audio.resourceUrl"
                                        :poster="dighumUrl + audioVoverUrl"
                                        :id="audio.comKey.userId + '@_@' + audio.comKey.fileType + '@_@' + audio.comKey.fileName" />

                                </el-card>
                            </div>
                        </template>
                        <el-text type="warning" v-if="audios.length == 0">无声音，需先进行声音克隆！</el-text>
                    </el-form-item>
                </el-form-item>
                <!-- <el-form-item>
                    <el-form-item v-if="fenshenShow">
                        <template #label>
                            <span class="gjxxLabel">分身选择</span>
                            <el-button style="margin-left: 20px;" type="primary" @click="openDrawer">点击复刻分身</el-button>
                            <div class="card-container">
                                <el-card v-for="(video, index) in videos" :key="index"
                                    style="width: 250px;height: 200px;" :class="{ 'card-v active': index === viIndex }">
                                    <template #header>
                                        <div class="card-header" @click="toggleCheckmarkVi(index, video)">
                                            <span style="font-size: 15px;">{{ video.showFileName
                                                }}</span>
                                            <div :class="{ 'div-checkmark active': index === viIndex }">
                                                <span :class="{ 'checkmark active': index === viIndex }"
                                                    v-if="index == viIndex">
                                                    <el-icon>
                                                        <Check />
                                                    </el-icon>
                                                </span>
                                            </div>
                                        </div>
                                    </template>
                                    <VideoPlayer width="210px" height="120px" :video-url="dighumUrl + video.resourceUrl"
                                        :poster="dighumUrl + video.coverUrl"
                                        :id="video.comKey.userId + '@_@' + video.comKey.fileType + '@_@' + video.comKey.fileName" />

                                </el-card>
                            </div>
                        </template>
                        <el-text type="warning" v-if="videos.length == 0">无分身，可以先复刻分身！</el-text>
                    </el-form-item>
                </el-form-item> -->
            </div>
            <!-- 音频驱动 -->
            <div v-if="!isTextDrive">
                <el-form-item>
                    <el-form-item>
                        <template #label>
                            <span class="xzsyLabel">选择声音</span>
                            <el-pagination style="margin-top: 20px; margin-left: 28px;" v-if="audios.length > 0"
                                background layout="total, sizes, prev, pager, next, jumper" :total="totalAudio"
                                :page-sizes="[8, 12, 16]" :pager-count="5" @size-change="handleSizeChangeAudio"
                                @current-change="handlePageChangeAudio" :current-page="currentPageAudio"
                                :page-size="pageSizeAudio" />
                            <div class="card-container">
                                <el-card v-for="(audio, index) in audios" :key="index"
                                    style="width: 250px;height: 200px;" :class="{ 'card-v active': index === auIndex }">
                                    <template #header>
                                        <el-tooltip class="box-item" effect="dark"
                                            :content="moment(audio.createDate).format('YYYY-MM-DD HH:mm:ss') + ': ' + audio.showFileName"
                                            placement="top-start">
                                            <div class="card-header" @click="toggleCheckmarkAu(index, audio)">
                                                <span style="font-size: 15px;">{{ audio.showFileName }}</span>
                                                <div :class="{ 'div-checkmark active': index === auIndex }">
                                                    <span :class="{ 'checkmark active': index === auIndex }"
                                                        v-if="index == auIndex">
                                                        <el-icon>
                                                            <Check />
                                                        </el-icon>
                                                    </span>
                                                </div>
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <VideoPlayer width="210px" height="120px" :video-url="dighumUrl + audio.resourceUrl"
                                        :poster="dighumUrl + audioVoverUrl"
                                        :id="audio.comKey.userId + '@_@' + audio.comKey.fileType + '@_@' + audio.comKey.fileName" />

                                </el-card>
                            </div>
                        </template>
                        <el-text type="warning" v-if="audios.length == 0">无声音，需先进行声音克隆！</el-text>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-form-item>
                        <template #label>
                            <span class="gjxxLabel">分身选择</span>
                            <el-button style="margin-left: 20px;" type="primary"
                                @click="openDrawer">点击复刻分身</el-button><el-icon @click="loadMyVideos">
                                <Refresh />
                            </el-icon>
                            <el-pagination style="margin-top: 20px; margin-left: 28px;" v-if="videos.length > 0"
                                background layout="total, sizes, prev, pager, next, jumper" :total="totalVideo"
                                :page-sizes="[8, 12, 16]" :pager-count="5" @size-change="handleSizeChangeVideo"
                                @current-change="handlePageChangeVideo" :current-page="currentPageVideo"
                                :page-size="pageSizeVideo" />
                            <div class="card-container">
                                <el-card v-for="(video, index) in videos" :key="index"
                                    style="width: 250px;height: 200px;" :class="{ 'card-v active': index === viIndex }">
                                    <template #header>
                                        <el-tooltip class="box-item" effect="dark"
                                            :content="moment(video.createDate).format('YYYY-MM-DD HH:mm:ss') + ': ' + video.showFileName"
                                            placement="top-start">
                                            <div class="card-header" @click="toggleCheckmarkVi(index, video)">
                                                <span style="font-size: 15px;">{{ video.showFileName
                                                    }}</span>
                                                <div :class="{ 'div-checkmark active': index === viIndex }">
                                                    <span :class="{ 'checkmark active': index === viIndex }"
                                                        v-if="index == viIndex">
                                                        <el-icon>
                                                            <Check />
                                                        </el-icon>
                                                    </span>
                                                </div>
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <VideoPlayer width="210px" height="120px" :video-url="dighumUrl + video.resourceUrl"
                                        :poster="dighumUrl + video.coverUrl"
                                        :id="video.comKey.userId + '@_@' + video.comKey.fileType + '@_@' + video.comKey.fileName" />

                                </el-card>
                            </div>
                        </template>
                        <el-text type="warning" v-if="videos.length == 0">无分身，可以先复刻分身！</el-text>
                    </el-form-item>
                </el-form-item>
            </div>
            <!-- <el-form-item v-if="!isTextDrive">
                <el-upload ref="audioUpload" class="upload-demo" drag multiple :auto-upload="false"
                    :file-list="audioList" limit=1 style="margin-top: 50px;" :before-upload="beforeAudioUpload"
                    :on-change="handleAudioChange" :accept="`.mp3,.m4a,.wav`">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text"><el-text class="mx-1" type="warning"
                            size="large">将音频文件拖到此处，或<em>点击上传</em></el-text></div>
                    <template #tip>
                        <div class="el-upload__tip">
                            <el-text class="mx-1" type="warning" style="font-size: 20px;"> 格式支持： .mp3 .m4a
                                .wav</el-text>
                        </div>
                    </template>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-upload class="upload-demo" drag multiple :auto-upload="false" :file-list="videoList" limit=1
                    style="margin-top: 40px;" :on-change="handleVideoChange">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text"><el-text class="mx-1" type="success"
                            size="large">将视频文件拖到此处，或<em>点击上传</em></el-text></div>
                    <template #tip>
                        
                    </template>
                </el-upload>
            </el-form-item> -->
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
                    style="margin-top: 40px;width: 100%;" :on-change="handleCopyVideoChange" :accept="`.mp4,.mov`">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text"><el-text class="mx-1" type="success"
                            size="large">将视频文件拖到此处，或<em>点击上传</em></el-text></div>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-form-item>
                <el-button @click="cancelForm" type="danger">取消</el-button>
                <el-button type="primary" :loading="cloneLoding" @click="uploadAndCopyVideo">
                    {{ loading ? '上传中...' : '确定' }}
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

const dighumUrl = process.env.DIGHUM_URL;
const audioVoverUrl = process.env.AUDIO_COVER_URL;
const isLoading = ref(false);
const isButtonDisabled = ref(false)
const cloneLoding = ref(false);
const isTextDrive = ref(true)
const fenshenShow = ref(true)
const formRef = ref(null)
const outputType = ref('0')
const uploadDrawer = ref(false)
let form = reactive({
    output: '1',
    textarea: ''
})
let audioList = []
let videoList = []
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
        { max: 100, message: '视频名过长', trigger: 'blur' }
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
const pageSizeAudio = ref(1)
const totalAudio = ref(0)
const currentPageVideo = ref(1)
const pageSizeVideo = ref(8)
const totalVideo = ref(0)

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

const loadMyAudios = async () => {
    if (!isTextDrive.value) {
        resourceAudios.tag = 'AI';
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

const loadMyVideos = async () => {
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

const auIndex = ref(-1)
let auVoiceId = ''
let fileName = ''
let audioUrl = ''
let fishId = ''
function toggleCheckmarkAu(index, audio) {
    auIndex.value = index
    auVoiceId = audio.voiceId
    audioUrl = audio.resourceUrl
    if ("1" === form.output) {
        fileName = audio.comKey.fileName
        fishId = audio.fishId
    }
}

const viIndex = ref(-1)
let resUrl = ''

function toggleCheckmarkVi(index, video) {
    viIndex.value = index
    resUrl = video.resourceUrl
    if ("0" === form.output || !isTextDrive.value) {
        fileName = video.comKey.fileName
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
    isLoading.value = true;
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
            fileName: fileName,
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
        // 发送请求
        axios.post("/v1/resource/createTask/text", reqJson, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 120000
        }).then(response => {
            normalResponse(response);
        }).catch(error => {
            errorResponse(error);
        });
    }
    // 添加文件和其他参数
    // 创建 FormData 对象
    // const formData = new FormData();
    // formData.append('fileCom', isTextDrive.value ? 'AV' : 'TV');
    // formData.append('audio', audioList[0].raw);
    // formData.append('video', videoList[0].raw);

    //音频驱动
    if (!isTextDrive.value) {
        let reqJson = {
            video_url: dighumUrl + resUrl,
            audio_url: dighumUrl + audioUrl,
            fileName: fileName
        }
        if (reqJson.audio_url == dighumUrl || isNull(reqJson.audio_url)) {
            notify('Warning', '请选择音频！', 'warning', 5000);
            return;
        }
        if (reqJson.video_url == dighumUrl || isNull(reqJson.video_url)) {
            notify('Warning', '请选择分身！', 'warning', 5000);
            return;
        }
        //发送请求
        axios.post("/v1/resource/createTask/audio", reqJson, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            normalResponse(response);
        }).catch(error => {
            errorResponse(error);
        });
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
            cloneLoding.value = true
            const formData = new FormData();
            formData.append('fileName', modelDighumForm.videoName)
            formData.append('videoFile', uploadVideoList[0].raw);
            axios.put("/v1/resource/dighumCreate", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 0
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
    justify-content: space-between;
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

    .card-v:nth-child(-n + 3) {
        margin-right: 16px;
    }

    .card-v .div-checkmark {
        width: 30px;
        height: 30px;
        position: absolute;
        background: #67e5ff;
        top: -15px;
        right: -15px;
        transform: rotate(45deg);
    }

    .card-v .div-checkmark .checkmark {
        position: absolute;
        bottom: 0;
        display: block;
        width: 24px;
        height: 24px;
        text-align: center;
        transform: rotate(-45deg);
        color: #0d472a;
    }
}

.card-header {
    cursor: pointer;
}

.checkmark {
    margin-right: 1px;
    font-size: 1.5em;
    color: #00b050;

}

.select-box {
    display: flex;

    .box {
        width: 86px;
        height: 36px;
        line-height: 36px;
        background: rgba(30, 37, 48, 0.6);
        border: 1px solid #67e5ff;
        border-radius: 4px;
        font-size: 14px;
        color: #67e5ff;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .box:nth-child(-n + 3) {
        margin-right: 16px;
    }

    .box .box-con {
        width: 30px;
        height: 30px;
        position: absolute;
        background: #67e5ff;
        top: -15px;
        right: -15px;
        transform: rotate(45deg);
    }

    .box .box-con span {
        position: absolute;
        bottom: 0;
        display: block;
        width: 24px;
        height: 24px;
        text-align: center;
        transform: rotate(-45deg);
        color: #000;
    }
}

.el-icon {
    margin-left: 20px;
    cursor: pointer;
}
</style>