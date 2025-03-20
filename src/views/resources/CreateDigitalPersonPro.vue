<template>

  <el-steps style="max-width: 100%" :active="currentStep" finish-status="success" simple>
    <el-step title="上传分身" style="cursor: pointer;" @click="stepTo(0)" />
    <el-step title="克隆分身" style="cursor: pointer;" @click="stepTo(1)" />
    <el-step title="AI推理" style="cursor: pointer;" @click="stepTo(2)" />
  </el-steps>
  <div v-if="currentStep === 0">

    <el-form ref="uploadDighumFormRef" :model="uploadDighumForm" label-width="100px" label-position="left"
      :rules="uploadDighumFormRules" class="uploadDighumFormClass">
      <el-form-item prop="fileName" label="分身名称">
        <el-input v-model="uploadDighumForm.fileName" placeholder="请输入分身名称" style="width: 350px;" />
      </el-form-item>
      <el-form-item style="margin-top: 50px;">
        <template #label>
          <span class="ckypLabel">上传视频</span>
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
          <el-progress v-if="localVideoProgressVisible" :percentage="localVideoUploadProgress" :color="ProgressColors"
            type="dashboard"></el-progress>
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

  <div v-else-if="currentStep === 1">
    <el-form ref="cloneDighumFormRef" :model="cloneDighumForm" label-width="100px" label-position="left"
      :rules="cloneDighumFormRules" class="cloneDighumFormClass">

      <el-form-item prop="name" label="分身名称">
        <el-input v-model="cloneDighumForm.name" placeholder="请输入分身名称" style="width: 350px;" />
      </el-form-item>

      <el-form-item prop="gender" label="分身性别">
        <el-select v-model="cloneDighumForm.gender" placeholder="请选择" size="large" style="width: 350px">
          <el-option v-for="(value, key) in Gender" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item>

      <el-form-item label="时间范围(秒)" style="width: 80%">
        <el-slider v-model="cloneDighumForm.timeRange" range :max="cloneDighumForm.maxTime"
          @change="handleTimeChange" />
        <el-text class="mx-1" type="danger" style="font-weight: bolder;">选中分身后范围默认取最大范围，可手动调整区间</el-text>
      </el-form-item>

      <el-form-item label="分身选择" prop="doppelganger">
        <div style="width: 100%;display: flex;justify-content: flex-start;">
          <el-pagination v-if="doppelgangers.length > 0" background layout="total, sizes, prev, pager, next, jumper"
            :total="totalDoppelganger" :page-sizes="[8, 12, 16]" :pager-count="5"
            @size-change="handleSizeChangeDoppelganger" @current-change="handlePageChangeDoppelganger"
            :current-page="currentPageDoppelganger" :page-size="pageSizeDoppelganger" />&nbsp;&nbsp;&nbsp;<el-icon
            title="刷新" style="color: #6771ff; margin-top: 4px; font-size: 25px;" @click="loadMyDoppelganger('refresh')">
            <Refresh />
          </el-icon>
        </div>
        <div class="card-container" style="margin-top: 20px;">
          <el-card v-for="(video, index) in doppelgangers" :key="index" style="width: 250px;height: 200px;"
            :class="{ 'card-v active': index === doppelgangerIndex }">
            <template #header>
              <div class="card-header" @click="toggleCheckmarkDoppelganger(index, video)">
                <el-tooltip class="box-item" effect="dark"
                  :content="moment(video.createDate).format('YYYY-MM-DD HH:mm:ss') + ': ' + video.showFileName"
                  placement="top-start">
                  <span style="font-size: 15px;">{{ video.showFileName
                  }}</span></el-tooltip>
                <div :class="{ 'div-checkmark active': index === doppelgangerIndex }">
                  <span :class="{ 'checkmark active': index === doppelgangerIndex }" v-if="index == doppelgangerIndex">
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
                      <el-dropdown-item command="delete" @click="deleteResource(video, doppelgangers)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <videoPlayer width="210px" height="120px" :video-url=null :poster="video.coverUrl"
              :id="video.comKey.fileType + '@_@' + video.comKey.fileName" />
          </el-card>
        </div>
        <el-text type="warning" v-if="doppelgangers.length == 0">无分身，可以先上传分身！</el-text>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="cloneDoppelganger" style="width: 100%; height: 50px; font-size: 20px;"
          :loading="isLoading" :disabled="isButtonDisabled">克隆
        </el-button>

      </el-form-item>

    </el-form>

  </div>
  <!-- AI推理 -->
  <div v-else-if="currentStep === 2">
    <el-form :model="aiReasoningForm" label-width="100px" label-position="left" class="aiReasoningFormClass">
      <el-form-item label="音频选择">
        <el-pagination v-if="aiAudios.length > 0" background layout="total, sizes, prev, pager, next, jumper"
          :total="totalAiAudio" :page-sizes="[8, 12, 16]" :pager-count="5" @size-change="handleSizeChangeAiAudio"
          @current-change="handlePageChangeAiAudio" :current-page="currentPageAiAudio" :page-size="pageSizeAiAudio"
          style="width: 100%;" />
        <div class="card-container">
          <el-card v-for="(audio, index) in aiAudios" :key="index" style="width: 250px;height: 200px;"
            :class="{ 'card-v active': index === aiAudioIndex }">
            <template #header>
              <div class="card-header" @click="toggleCheckmarkAu(index, audio)">
                <el-tooltip class="box-item" effect="dark"
                  :content="moment(audio.createDate).format('YYYY-MM-DD HH:mm:ss') + ': ' + audio.showFileName"
                  placement="top-start">
                  <span style="font-size: 15px;">{{ audio.showFileName }}</span>
                </el-tooltip>
                <div :class="{ 'div-checkmark active': index === aiAudioIndex }">
                  <span :class="{ 'checkmark active': index === aiAudioIndex }" v-if="index == aiAudioIndex">
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
                      <el-dropdown-item command="delete" @click="deleteResource(audio, aiAudios)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <videoPlayer width="210px" height="120px" :video-url="audio.resourceUrl" :poster="dighumUrl + audioCoverUrl"
              :id="audio.comKey.fileType + '@_@' + audio.comKey.fileName" />

          </el-card>
        </div>
        <el-text type="warning" v-if="aiAudios.length == 0 && !localAudio">无声音，需先生成AI音频！</el-text>
      </el-form-item>

      <el-form-item label="克隆分身选择">
        <div style="width: 100%;display: flex;justify-content: flex-start;">
          <el-pagination v-if="cloneDoppelgangers.length > 0" background
            layout="total, sizes, prev, pager, next, jumper" :total="totalCloneDoppelganger" :page-sizes="[8, 12, 16]"
            :pager-count="5" @size-change="handleSizeChangeCloneDoppelganger"
            @current-change="handlePageChangeCloneDoppelganger" :current-page="currentPageCloneDoppelganger"
            :page-size="pageSizeCloneDoppelganger" />&nbsp;&nbsp;&nbsp;<el-icon title="刷新"
            style="color: #6771ff; margin-top: 4px; font-size: 25px;" @click="loadMyCloneDoppelganger('refresh')">
            <Refresh />
          </el-icon>
        </div>
        <div class="card-container">
          <el-card v-for="(video, index) in cloneDoppelgangers" :key="index" style="width: 250px;height: 200px;"
            :class="{ 'card-v active': index === cloneDoppelgangerIndex }">
            <template #header>
              <div class="card-header" @click="toggleCheckmarkCloneDoppelganger(index, video)">
                <el-tooltip class="box-item" effect="dark"
                  :content="moment(video.createDate).format('YYYY-MM-DD HH:mm:ss') + ': ' + video.showFileName"
                  placement="top-start">
                  <span style="font-size: 15px;">{{ video.showFileName
                  }}</span></el-tooltip>
                <div :class="{ 'div-checkmark active': index === cloneDoppelgangerIndex }">
                  <span :class="{ 'checkmark active': index === cloneDoppelgangerIndex }"
                    v-if="index == cloneDoppelgangerIndex">
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
                      <el-dropdown-item command="delete" @click="deleteResource(video, videos)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <videoPlayer v-if="video.status == 'PUBLISHED'" width="210px" height="120px" :video-url=null
              :poster="video.coverUrl" :id="video.comKey.fileType + '@_@' + video.comKey.fileName" />
            <el-text type="danger" style="font-size: 20px;">{{ Status[video.status] }}</el-text>
          </el-card>
        </div>
        <el-text type="warning" v-if="cloneDoppelgangers.length == 0">无克隆分身，可以先上传并克隆分身！</el-text>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="aiDoppelganger" style="width: 100%; height: 50px; font-size: 20px;"
          :loading="isLoading" :disabled="isButtonDisabled">推理
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
import moment from 'moment-timezone'
import videoPlayer from "@/components/videos/videoPlayer.vue"
import { isEmpty, isResChecked } from '@/common/Objects'
import { fetchPreSignedUrl } from '@/common/ResourceUtils'
import { ElMessage } from 'element-plus'
import { Status } from '@/common/Status'
import router from '@/router'
import { deleteResource } from '@/common/ResourceUtils'

const uploadDighumFormRef = ref(null)
const dighumUrl = process.env.DIGHUM_URL;
const audioCoverUrl = process.env.AUDIO_COVER_URL;
let videoList = []
const currentStep = ref(0)
const localVideoProgressVisible = ref(false)
const localVideoUploadProgress = ref(0)
const isLoading = ref(false)
const isButtonDisabled = ref(false)
const uploadDighumForm = reactive({
  fileName: ''
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
const cloneDighumFormRules = reactive({
  name: [
    { required: true, message: '分身名称不能为空', trigger: 'blur' },
    { max: 100, message: '分身名称过长', trigger: 'blur' },
    { pattern: fileNameRegex, message: '分身名称不能包含特殊字符或中文标点符号', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择分身性别', trigger: 'change' }
  ]
});



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
 * 上传分身
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
            stepTo(1);
            notify('Success', '上传成功，请克隆分身！', 'success');
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

const stepTo = (step) => {
  currentStep.value = step;
  //克隆分身
  if (step == 1) {
    loadMyDoppelganger();
  }
  //AI推理
  if (step == 2) {
    loadMyAiAudios();
    loadMyCloneDoppelganger();
  }
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