<template>
    <h3 class="h-title">个人声音克隆</h3>
    <div class="container" @click="popVisible = true">
        <el-card class="box-card">
            <div class="box-content">
                <div class="title">声音克隆</div>
                <div class="description">上传音频，打造专属个人声音模型</div>
                <el-button type="primary" round @click="popVisible = true">快速克隆 <el-icon><svg t="1725265775795"
                            class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                            p-id="8192" width="200" height="200">
                            <path
                                d="M686.648889 421.489778L388.721778 719.416889a37.717333 37.717333 0 0 1-53.333334-53.333333l297.927112-297.927112h-248.376889a37.717333 37.717333 0 0 1 0-75.406222h377.144889V669.866667a37.717333 37.717333 0 1 1-75.406223 0v-248.376889z"
                                fill="#ffffff" p-id="8193"></path>
                        </svg></el-icon></el-button>
            </div>
        </el-card>
    </div>

    <el-dialog v-model="popVisible" title="模式选择" width="600px">
        <el-row class="model-card" :gutter="20" v-for="(item, index) in modelItems" :key="index">
            <el-col :span="12">
                <el-card :body-style="{ padding: '20px' }" class="model-el-card" :type="item.type"
                    @click="openDrawer(item.type)">
                    <div class="card-content">
                        <el-image :src="item.image" alt="" class="card-image" />
                        <div class="card-title">{{ item.title }}</div>
                        <div class="card-description">{{ item.description }}</div>
                        <el-tag v-if="item.tag" type="warning" effect="dark">{{ item.tag }}</el-tag>
                    </div>
                </el-card>
            </el-col>
        </el-row>

    </el-dialog>

    <el-drawer v-model="uploadDrawer" direction="rtl" class="upload-drawer" size="45%" :type="form.type">
        <template #title>
            <span class="syclTitle">声音克隆</span>
        </template>
        <el-form ref="uploadForm" :model="form" label-position="top" size="large" :rules="rules">
            <el-form-item prop="audioName">
                <template #label>
                    <span class="symcLabel">声音名称</span>
                </template>
                <el-input v-model="form.audioName" placeholder="请输入声音名称" />
            </el-form-item>
            <el-form-item>
                <template #label>
                    <span class="ckypLabel">参考音频</span>
                </template>
                <div class="consultationAudioDiv">
                    <h4 style="font-size: 15px; color: black; font-weight: bold;">音频要求</h4>
                    <el-text class="mx-1" type="success">文件格式： mp3、m4a、wav</el-text>
                    <el-text class="mx-1" type="primary" style="margin-left: 10px;">音频时长： 5秒~3分钟</el-text>
                    <el-text class="mx-1" type="danger" style="margin-left: 10px;">音频文件大小不超过20M</el-text>
                </div>
                <el-upload class="upload-demo" drag multiple :auto-upload="false" :file-list="audioList" limit=1
                    style="margin-top: 40px;width: 100%;" :on-change="handleAudioChange" :accept="`.mp3,.m4a,.wav`">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text"><el-text class="mx-1" type="success"
                            size="large">将音频文件拖到此处，或<em>点击上传</em></el-text></div>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-form-item>
                <el-button @click="cancelForm" type="danger">取消</el-button>
                <el-button type="primary" :loading="loading" @click="submit">
                    {{ loading ? '上传中...' : '确定' }}
                </el-button>
            </el-form-item>
        </template>
    </el-drawer>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElDrawer, ElMessageBox } from 'element-plus'
import axios from '@/axios'
import { ElMessage, ElNotification } from 'element-plus'
import BasicVoice from '@/assets/images/BasicVoice.png'
import HighFidelitySound from '@/assets/images/HighFidelitySound.png'


const modelItems = [
    {
        image: BasicVoice,
        title: '声音克隆-基础版',
        description: '上传5~30S音频，快速克隆个人声音',
        tag: '',
        type: '9'
    },
    // {
    //     image: HighFidelitySound,
    //     title: '声音克隆-高保真',
    //     description: '上传5~30S音频，高度还原真人音色特点、说话风格、口音和声学环境',
    //     tag: '',
    //     type: '20'
    // }
]
const popVisible = ref(false)
const uploadDrawer = ref(false)
const generateType = ref('')
const loading = ref(false)
const form = reactive({
    type: '',
    audioName: '',
    audio: ''
})
const uploadForm = ref(null);
const rules = reactive({
    audioName: [
        { required: true, message: '声音名称不能为空', trigger: 'blur' },
        { max: 100, message: '声音名过长', trigger: 'blur' }
    ]
});

let audioList = []

const openDrawer = (type) => {
    uploadDrawer.value = true;
    form.type = type;
}
const cancelForm = () => {
    loading.value = false
    uploadDrawer.value = false
}

const submit = (async () => {
    uploadForm.value.validate(async (valid) => {
        if (valid) {
            if (audioList.length == 0) {
                ElNotification({
                    title: 'Warning ',
                    message: '请选择文件上传！',
                    type: 'warning',
                })
                return;
            }
            const result = await checkBeforeSubmit(audioList[0]);
            if (!result) {
                return;
            }
            loading.value = true
            const formData = new FormData();
            formData.append('type', form.type)
            formData.append('fileName', form.audioName)
            formData.append('audioFile', audioList[0].raw);
            try {
                let response = await axios.put("/v1/resource/voiceCreate", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 30000
                });
                loading.value = false
                if (response.status == '200') {
                    var code = response.data.code;
                    if (code == '0' || code == '200') {
                        ElMessage.success('文件上传成功！');
                        uploadDrawer.value = false
                    } else {
                        ElMessage.error('上传失败: ' + response.data.remarks);
                    }
                } else {
                    ElMessage.error('异常，请联系管理员!');
                }
            } catch (error) {
                loading.value = false;
                console.error(error);
                ElMessage.error('文件上传失败!');
                uploadDrawer.value = false;
            }
        }
    })
})



async function checkBeforeSubmit(file) {
    const isLt20M = file.size / 1024 / 1024 <= 20;
    if (!isLt20M) {
        ElMessage.error('文件大小不能超过20MB!');
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
    if (duration < 5 || duration > 180) {
        ElMessage.error('音频时长需要5秒~3分钟!');
        return false;
    }
    return true;
}

// 音频文件变化时触发
function handleAudioChange(file, fileList) {
    if (!checkBeforeSubmit(file)) {
        return false;
    }
    audioList = fileList;
}
</script>

<style scoped>
.syclTitle {
    font-size: 20px;
    color: black;
    font-weight: bolder;
}

.symcLabel {
    font-size: 20px;
    color: black;
    font-weight: bolder;
}

.ckypLabel {
    font-size: 20px;
    color: black;
    font-weight: bolder;
}

.el-form-item {
    margin-top: 30px;
}

.model-el-card {
    width: 570px;
}

.el-image {
    width: 80px;
    height: 80px;
}

.h-title {
    color: black;
    font-size: 20px;
    font-weight: bold;
    margin-left: 30px;
    margin-top: 20px;
}

.container {
    width: 400px;
    align-items: center;
    height: 100vh;
    margin-left: 30px;
    margin-top: 30px;
    cursor: pointer;
}

.box-card {
    width: 400px;
    border: 2px dashed #409eff;
    border-radius: 10px;
    padding: 20px;
}

.box-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
}

.title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}

.description {
    font-size: 14px;
    color: #606266;
    margin-bottom: 20px;
}
</style>