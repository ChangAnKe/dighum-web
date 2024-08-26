<template>
    <el-switch v-model="switchStatus" class="mb-2"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #00BFFF;left: 85px;" active-text="音频+视频"
        inactive-text="文本+视频" @onclick="switchTypes" />
    <div class="scrollable-container">
        <el-form ref="formRef" :model="form" label-width="80px">
            <el-form-item v-if="!switchStatus"><el-input v-model="textarea" maxlength="1000"
                    style="width: 1000px;margin-top: 50px;" placeholder="请输入文本" show-word-limit type="textarea"
                    autosize="{ minRows: 2, maxRows: 200 }" /></el-form-item>
            
            <el-form-item v-if="switchStatus">
                <el-upload ref="audioUpload" class="upload-demo" drag multiple :auto-upload="false"
                    :file-list="audioList" limit=1 style="margin-top: 50px;" :before-upload="beforeAudioUpload"
                    :on-change="handleAudioChange"
                    :accept="`.mp3,.m4a,.wav`">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text"><el-text class="mx-1" type="warning"
                            size="large">将音频文件拖到此处，或<em>点击上传</em></el-text></div>
                    <template #tip>
                        <div class="el-upload__tip">
                            <el-text class="mx-1" type="warning" style="font-size: 20px;"> 格式支持： .mp3 .m4a .wav</el-text>
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
                        <!-- <div class="el-upload__tip">
                            格式支持： mkv/mp4/avi
                        </div> -->
                    </template>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="submitFiles" style="width: 1000px; height: 50px; font-size: 20px;" :loading="isLoading">上传<el-icon class="el-icon--right"><Upload /></el-icon>
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from '@/axios'

const isLoading = ref(false);
const switchStatus = ref(true)
const textarea = ref('')
const formRef = ref(null)
const auidoTypeArr = ['mp3','m4a','wav']
let audioList = []
let videoList = []

function switchTypes() {

}



function beforeAudioUpload(file) {

}

// 音频文件变化时触发
function handleAudioChange(file, fileList) {
    audioList = fileList;
}

// 视频文件变化时触发
function handleVideoChange(file, fileList) {
    videoList = fileList
}

// 删除文件时触发
function handleRemove(file, fileList) {
    console.log(file, fileList)
}

// 预览文件时触发
function handlePreview(file) {
    console.log(file)
}

// 删除文件前触发
function beforeRemove(file, fileList) {
    return true
}


// 提交文件
function submitFiles() {
    isLoading.value = true;
    // 创建 FormData 对象
    const formData = new FormData();
    // 添加文件和其他参数
    formData.append('fileCom', switchStatus.value ? 'AV' : 'TV');
    formData.append('audio', audioList[0].raw);
    formData.append('video', videoList[0].raw);

    // 发送请求
    axios.post("/v1/resource/upload", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => {
        isLoading.value = false;
        ElMessage.success('文件上传成功！');
    }).catch(error => {
        isLoading.value = false;
        ElMessage.error('文件上传失败!');
    });
}
</script>

<style scoped>
.upload-demo {
    width: 1000px;
}

.el-upload-dragger {
    width: 300px;
}

.el-upload.el-upload--picture-card.is-drag {
    width: 300px;
    height: 300px;
}

</style>