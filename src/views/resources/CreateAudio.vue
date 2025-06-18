<template>
    <div class="scrollable-container">
        <el-form ref="formRef" :model="form" label-width="80px" :label-position="top" class="driver-form"
            :rules="driveRules">
            <!-- 文本驱动 -->
            <div>
                <el-form-item style="margin-top: 30px;" prop="newFileName">
                    <el-input v-model="form.newFileName" placeholder="请输入文件名（非必填）" style="width: 900px;" maxlength="50"
                        show-word-limit />
                </el-form-item>
                <el-form-item>
                    <template #label>
                        <el-text style="font-weight: bolder; color: black;">细粒度控制（需添加<|phoneme_start|>标签），如：</el-text>
                        <el-text style="color: red;font-weight: bolder;">给</el-text>
                        <el-text style="color: #00BFFF;">予</el-text>
                        <el-text style="font-weight: bolder; color: black;">&nbsp;&nbsp;可修改为&nbsp;&nbsp;</el-text>
                        <el-text style="font-weight: bolder;color: red;">
                            <|phoneme_start|>ji3<|phoneme_start|>
                        </el-text>
                        <el-text style="color: #00BFFF;">予</el-text>
                        <el-text style="font-weight: bolder;color: black">, 数字3代表取第三声</el-text>
                    </template>
                    <el-input v-model="form.textarea" maxlength="2000" style="width: 900px;"
                        placeholder="老师<|phoneme_start|>ji3<|phoneme_start|>予了我很多鼓励，让我在困难面前不再退缩。" show-word-limit
                        type="textarea" :rows=5></el-input></el-form-item>
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
            <el-form-item>
                <el-button type="success" @click="submitFiles" style="width: 80%; height: 50px; font-size: 20px;"
                    :loading="isLoading" :disabled="isButtonDisabled">提交
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/axios'
import VideoPlayer from "@/components/videos/videoPlayer.vue"
import moment from 'moment-timezone'
import { notify } from '@/common/Notification'
import router from '@/router'
import { deleteResource } from '@/common/ResourceUtils'
import { fileNameRegex } from '@/common/ApplicationConstant'
import { isEmpty } from '@/common/Objects'
import { fetchPreSignedUrl } from '@/common/ResourceUtils'

const dighumUrl = process.env.DIGHUM_URL;
const audioVoverUrl = process.env.AUDIO_COVER_URL;
const isLoading = ref(false);
const isButtonDisabled = ref(false)
const isTextDrive = ref(true)
const formRef = ref(null)
let form = reactive({
    newFileName: '',
    output: '1',
    textarea: ''
})
const top = 'top'
let audios = reactive([])
const driveRules = reactive({
    newFileName: [
        { pattern: fileNameRegex, message: '文件名不能包含特殊字符或中文标点符号', trigger: 'blur' }
    ]
});
const resourceAudios = reactive({
    comKey: {
        fileType: "AU",
    },
    tag: 'AI-Model'
})
const currentPageAudio = ref(1)
const pageSizeAudio = ref(8)
const totalAudio = ref(0)
const auIndex = ref(-1)

let auVoiceId = ''
let audioFileName = ''
let audioUrl = ''
let fishId = ''
let resUrl = ''

const handleSizeChangeAudio = (newPageSize) => {
    pageSizeAudio.value = newPageSize;
    loadMyAudios(); // 切换页码时，重新加载数据
};


const handlePageChangeAudio = (newPage) => {
    currentPageAudio.value = newPage;
    loadMyAudios(); // 切换页码时，重新加载数据
};

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


function validBeforeCreateAIData(reqJson) {
    if ("0" === form.output) {
        if (isEmpty(reqJson.voice_id) || isEmpty(reqJson.video_url)) {
            ElMessage.success('请选择音频或者分身！');
            return false;
        }
    }
    if ("1" === form.output && isEmpty(reqJson.fishId)) {
        ElMessage.success('请选择音频！');
        return false;
    }
    if (reqJson.fileName == null || reqJson.fileName == '') {
        ElMessage.success('未获取到文件名！');
        return false;
    }
    return true;
}


// 提交文件
async function submitFiles() {
    const valid = await formRef.value.validate();
    if (!valid) return;
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
            fishId: fishId,
            newFileName: form.newFileName
        }
        if ("0" === outputType && !isEmpty(resUrl)) {
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

onMounted(() => {
    loadMyAudios();
});

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