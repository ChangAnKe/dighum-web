<template>
    <div>
        <el-form ref="uploadDighumFormRef" :model="uploadDighumForm" label-width="100px" label-position="left"
            :rules="uploadDighumFormRules" class="uploadDighumFormClass">
            <el-form-item prop="fileName" label="分身名称">
                <el-input v-model="uploadDighumForm.fileName" placeholder="请输入分身名称" size="large"
                    style="width: 350px;" />
            </el-form-item>
            <el-form-item prop="gender" label="分身性别">
                <el-select v-model="uploadDighumForm.gender" placeholder="请选择" size="large" style="width: 350px">
                    <el-option v-for="(value, key) in Gender" :key="key" :label="value" :value="key" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <template #label>
                    <span class="ckypLabel"><el-text style="color: red;">*</el-text>&nbsp;上传视频</span>
                </template>
                <div class="consultationAudioDiv">
                    <h4 style="font-size: larger; color: black; font-weight: bold;">视频要求</h4>
                    <el-text class="mx-1" type="success">视频方向：横向或纵向</el-text>
                    <el-text class="mx-1" type="primary" style="margin-left: 10px;">文件格式：mp4</el-text>
                    <el-text class="mx-1" type="warning" style="margin-left: 10px;">视频时长：5秒~30分钟</el-text>
                    <el-text class="mx-1" type="info" style="margin-left: 10px;">分辨率：360p~4K</el-text>
                    <el-text class="mx-1" type="danger" style="margin-left: 10px;">文件大小：小于500M</el-text>
                </div>
                <el-upload drag multiple :auto-upload="false" :file-list="videoList" limit=1
                    style="margin-top: 40px;width: 80%;" :on-change="handleVideoChange" :accept="`.mp4`"
                    :on-progress="handleProgress" :on-remove="localVideoHandleRemove">
                    <el-progress v-if="localVideoProgressVisible" :percentage="localVideoUploadProgress"
                        :color="ProgressColors" type="dashboard"></el-progress>
                    <img v-else src="@/assets/images/svg/file_upload.svg" alt="上传" style="width: 100px;" />
                    <div class="el-upload__text"><el-text class="mx-1" type="success"
                            size="large">将视频文件拖到此处，或<em>点击上传</em></el-text>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="submitFiles" style="width: 100%; height: 50px; font-size: 20px;"
                    :loading="isLoading" :disabled="isButtonDisabled">上传
                </el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script setup>
import { ref, reactive } from 'vue';
import { fileNameRegex, ProgressColors } from '@/common/ApplicationConstant';
import axios from '@/axios';
import { notify } from '@/common/Notification';
import { Gender } from '@/common/DropdownList';
import { isEmpty, isResChecked } from '@/common/Objects'
import { fetchPreSignedUrl } from '@/common/ResourceUtils'
import { ElMessage } from 'element-plus'
import { Status } from '@/common/Status'
import router from '@/router'

const uploadDighumFormRef = ref(null)
let videoList = []
const currentStep = ref(0)
const localVideoProgressVisible = ref(false)
const localVideoUploadProgress = ref(0)
const isLoading = ref(false)
const isButtonDisabled = ref(false)
const uploadDighumForm = reactive({
    fileName: '',
    gender: ''
})
const cloneDighumForm = reactive({
    name: '',
    gender: '',
    doppelganger: '',
    timeRange: [0, 100], //default [0,100], would be reset after Doppelganger was selected
    maxTime: 100,
    demoStartTimeInSec: 0, //default 0, Would be rest after manually reset time range
    demoEndTimeInSec: 100, //default 100, Would be rest after manually reset time range
    fileKey: ''
})
const baseVideoDto = reactive({
    Payload: {
        InputAudioUrl: '',
        VideoParam: 'N',
        VirtualmanKey: ''
    }
})
const uploadDighumFormRules = reactive({
    fileName: [
        { required: true, message: '分身名称不能为空', trigger: 'blur' },
        { max: 100, message: '分身名称过长', trigger: 'blur' },
        { pattern: fileNameRegex, message: '分身名称不能包含特殊字符或中文标点符号', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '请选择分身性别', trigger: 'change' }
    ]
});


//克隆分身页面变量
const cloneDighumFormRef = ref(null)
const currentPageDoppelganger = ref(1)
const pageSizeDoppelganger = ref(8)
const totalDoppelganger = ref(0)
let doppelgangers = reactive([])
const doppelgangerVideos = reactive({
    comKey: {
        fileType: "VI",
    }
})
const doppelgangerIndex = ref(-1)
const currentPageAiAudio = ref(1)
const pageSizeAiAudio = ref(8)
const totalAiAudio = ref(0)
let aiAudios = reactive([])
const aiAudioIndex = ref(-1)
//ai推理页面变量
const cloneDoppelgangerVideos = reactive({
    comKey: {
        fileType: "VI",
    }
})
let cloneDoppelgangers = reactive([])
const cloneDoppelgangerIndex = ref(-1)
const currentPageCloneDoppelganger = ref(1)
const pageSizeCloneDoppelganger = ref(8)
const totalCloneDoppelganger = ref(0)

const localVideoHandleRemove = () => {
    videoList = [];
    localVideoProgressVisible.value = false;
    localVideoUploadProgress.value = 0;
}


function handleVideoChange(file, fileList) {
    videoList = fileList;
}

const handleProgress = (event) => {
    localVideoProgressVisible.value = true;
    localVideoUploadProgress.value = Math.round(event.percent);
}

/**
 * 形象克隆
 */
const submitFiles = () => {
    uploadDighumFormRef.value.validate(async (valid) => {
        const formData = new FormData();
        if (valid) {
            if (videoList.length == 0) {
                notify('Warning', '请上传分身！', 'warning');
                return;
            }
            formData.append('fileName', uploadDighumForm.fileName);
            formData.append('gender', uploadDighumForm.gender);
            formData.append('inCloneVideoFile', videoList[0].raw);
            freeze(true);
            axios.post("/v1/dm/video/infinite-clone/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 0,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    handleProgress({ percent: percentCompleted });
                }
            }).then(response => {
                freeze(false);
                if (response.status == '200') {
                    var code = response.data.code;
                    if (code == '0' || code == '200') {
                        notify('Success', '克隆成功，请开始创建你的分身吧！', 'success');
                    } else {
                        notify('Error', '失败: ' + response.data.remarks, 'error');
                    }
                } else {
                    notify('Error', '异常，请联系管理员!', 'error');
                }
            }).catch(error => {
                freeze(false);
                console.log(error);
                notify('Error', '内部异常，请联系管理员!', 'error');
            });
        }
    })
}

const freeze = (bValue) => {
    isLoading.value = bValue
    isButtonDisabled.value = bValue
}

const initDoppelgangers = () => {
    doppelgangers.length = 0;
}

const initCloneDoppelgangers = () => {
    cloneDoppelgangers.length = 0;
}
//加载分身
const loadMyDoppelganger = async (flag) => {
    if (flag == 'refresh') {
        currentPageDoppelganger.value = 1;
        pageSizeDoppelganger.value = 8;
        initDoppelgangers();
    }

    doppelgangerVideos.dmFileKey = "NON-NULL";
    // 发送请求
    await axios.post("/v1/resource/paging/getResources", doppelgangerVideos, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 20000,
        params: {
            page: currentPageDoppelganger.value - 1, //后端从0开始前端从1开始
            pageSize: pageSizeDoppelganger.value
        }
    }).then(response => {
        if (response.status = '200') {
            if (response.data.totalElements > 0) {
                initDoppelgangers();
                totalDoppelganger.value = response.data.totalElements;
                //确保使用响应式的方式更新数组
                doppelgangers.splice(0, doppelgangers.length, ...response.data.content);
            }
        }
    }).catch(error => {
        ElMessage.error('获取分身列表失败，请联系管理员！');
    });
}

//克隆分身
const cloneDoppelganger = () => {
    cloneDighumFormRef.value.validate(async (valid) => {
        if (valid) {
            if (isEmpty(cloneDighumForm.fileKey)) {
                notify('Warning', '请选择分身', 'warning');
                return;
            }
            freeze(true);
            axios.post("/v1/dm/video/infinite-clone", cloneDighumForm, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 0
            }).then(response => {
                freeze(false);
                if (response.status == '200') {
                    var code = response.data.code;
                    if (code == '0' || code == '200') {
                        abandonDoppelganger();
                        stepTo(2);
                        notify('Success', '克隆成功！', 'success');
                    } else {
                        notify('Error', '克隆分身失败: ' + response.data.remarks, 'error');
                    }
                } else {
                    notify('Error', '克隆分身异常，请联系管理员!', 'error');
                }
            }).catch(error => {
                freeze(false);
                console.log(error);
                notify('Error', '内部异常，请联系管理员!', 'error');
            });
        }
    })
}

const loadMyCloneDoppelganger = async (flag) => {
    if (flag == "refresh") {
        currentPageCloneDoppelganger.value = 1;
        pageSizeCloneDoppelganger.value = 8;
        initCloneDoppelgangers();
    }
    cloneDoppelgangerVideos.tag = 'AI-Model';
    cloneDoppelgangerVideos.taskId = "NON-NULL";
    // 发送请求
    await axios.post("/v1/resource/paging/getResources", cloneDoppelgangerVideos, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 20000,
        params: {
            page: currentPageCloneDoppelganger.value - 1, //后端从0开始前端从1开始
            pageSize: pageSizeCloneDoppelganger.value
        }
    }).then(response => {
        if (response.status = '200') {
            if (response.data.totalElements > 0) {
                initCloneDoppelgangers();
                totalCloneDoppelganger.value = response.data.totalElements;
                //确保使用响应式的方式更新数组
                cloneDoppelgangers.splice(0, cloneDoppelgangers.length, ...response.data.content);
            }
        }
    }).catch(error => {
        ElMessage.error('获取分身列表失败，请联系管理员！');
    });
}


const abandonDoppelganger = () => {
    cloneDighumForm.fileKey = '';
    //unselected
    doppelgangerIndex.value = -1;
}

const abandonCloneDoppelganger = () => {
    cloneDoppelgangerIndex.value = -1;
}

const abandonCheckedAiAudio = () => {
    aiAudioIndex.value = -1;
}

async function toggleCheckmarkDoppelganger(index, video) {
    if (isResChecked(doppelgangerIndex, index)) {
        resetTimeRange();
        abandonDoppelganger();
        return;
    }
    //选中
    doppelgangerIndex.value = index;
    //reset时间范围
    cloneDighumForm.timeRange = [0, video.duration];
    cloneDighumForm.maxTime = video.duration;
    cloneDighumForm.fileKey = video.dmFileKey;
}

async function toggleCheckmarkCloneDoppelganger(index, video) {
    if (isResChecked(cloneDoppelgangerIndex, index)) {
        abandonCloneDoppelganger();
        baseVideoDto.Payload.VirtualmanKey = '';
        return;
    }
    baseVideoDto.Payload.VirtualmanKey = video.dmVirtualManKey;
    //选中
    cloneDoppelgangerIndex.value = index;
}

async function toggleCheckmarkAu(index, audio) {
    if (isResChecked(aiAudioIndex, index)) {
        abandonCheckedAiAudio();
        baseVideoDto.Payload.InputAudioUrl = '';
        return;
    }
    if (isEmpty(audio.resourceUrl)) {
        let preSinedUrl = await fetchPreSignedUrl(audio.comKey.fileType + "@_@" + audio.comKey.fileName);
        baseVideoDto.Payload.InputAudioUrl = preSinedUrl;
        console.log(baseVideoDto);
    }
    //选中
    aiAudioIndex.value = index;
}

const resetTimeRange = () => {
    cloneDighumForm.timeRange = [0, 100];
    cloneDighumForm.maxTime = 100;
}


const aiDoppelganger = () => {
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


const loadMyAiAudios = async () => {
    // 发送请求
    await axios.post("/v1/resource/paging/getResources", {
        comKey: {
            fileType: "AU",
        },
        tag: 'AI'
    }, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 20000,
        params: {
            page: currentPageAiAudio.value - 1, //后端从0开始前端从1开始
            pageSize: pageSizeAiAudio.value
        }
    }).then(response => {
        if (response.status = '200') {
            if (response.data.totalElements > 0) {
                aiAudios.length = 0;
                totalAiAudio.value = response.data.totalElements;
                //确保使用响应式的方式更新数组
                aiAudios.splice(0, aiAudios.length, ...response.data.content);
            }
        }
    }).catch(error => {
        ElMessage.error('获取声音列表失败，请联系管理员！');
    });

}

const handleSizeChangeDoppelganger = (newPageSize) => {
    pageSizeDoppelganger.value = newPageSize;
    loadMyDoppelganger(); // 切换每页数，重新加载数据
};

//页数改变
const handlePageChangeDoppelganger = (newPage) => {
    currentPageDoppelganger.value = newPage;
    loadMyDoppelganger();  // 切换页码时，重新加载数据
};

//每页数改变
const handleSizeChangeCloneDoppelganger = (newPageSize) => {
    pageSizeCloneDoppelganger.value = newPageSize;
    loadMyCloneDoppelganger(); // 切换每页数，重新加载数据
};

//页数改变
const handlePageChangeCloneDoppelganger = (newPage) => {
    currentPageCloneDoppelganger.value = newPage;
    loadMyCloneDoppelganger();  // 切换页码时，重新加载数据
};

//每页数改变
const handleSizeChangeAiAudio = (newPageSize) => {
    pageSizeAiAudio.value = newPageSize;
    loadMyAiAudios();
}

//页数改变
const handlePageChangeAiAudio = (newPage) => {
    currentPageAiAudio.value = newPage;
    loadMyAiAudios();
}

const handleTimeChange = () => {
    cloneDighumForm.demoStartTimeInSec = cloneDighumForm.timeRange[0];
    cloneDighumForm.demoEndTimeInSec = cloneDighumForm.timeRange[1];
}
</script>

<style scoped>
.uploadDighumFormClass {
    margin-top: 50px;
    margin-left: 50px;
    width: 80%;
    font-size: 16px;
}

.cloneDighumFormClass {
    margin-top: 50px;
    margin-left: 50px;
    width: 80%;
    font-size: 16px;
}

.aiReasoningFormClass {
    margin-top: 50px;
    margin-left: 50px;
    width: 80%;
    font-size: 16px;
}

.mx-1 {
    font-size: larger;
}

.slider-demo-block {
    max-width: 600px;
    display: flex;
    align-items: center;
}

.slider-demo-block .el-slider {
    margin-top: 0;
    margin-left: 12px;
}

.card-container {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    /* If you want the cards to wrap to the next line when space runs out */
    justify-content: flex-start;
    /* Space between cards */
    gap: 1rem;
    align-items: center;

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