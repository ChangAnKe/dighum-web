<template>
    <div :width="props.width" :height="props.height" :id="props.id">
        <img v-if="showImage" style="background-color: black; object-fit: cover" :width="props.width"
            :height="props.height" :src="props.poster" @click="clickImage" />
    </div>
</template>
​
<script setup lang="ts">
import { ref } from "vue";
import Player from "xgplayer";
import "xgplayer/dist/index.min.css";
import { isEmpty } from '@/common/Objects'
import { fetchPreSignedUrl } from "@/common/ResourceUtils";

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        default: () => ""
    },
    poster: {
        type: String,
        default: () => ""
    },
    playsinline: {
        type: Boolean,
        default: true
    },
    width: {
        type: String,
        default: "100%"
    },
    height: {
        type: String,
        default: "100%"
    }
});

const showImage = ref(true);
// 定义一个变量来存储 player 实例
let player: Player;

const clickImage = async () => {
    if (player == null) {
        //console.log("id:" + props.id);
        //console.log("url:" + props.videoUrl);
        let preSinedUrl = "";
        if (isEmpty(props.videoUrl)) {
            preSinedUrl = await fetchPreSignedUrl(props.id);
        }
        initPlayer(preSinedUrl);
        showImage.value = false;
    }
};

// 初始化西瓜视频
const initPlayer = (preSinedUrl: any) => {
    player = new Player({
        lang: "zh",
        volume: 0.3,
        id: props.id,
        url: preSinedUrl || props.videoUrl,
        poster: props.poster,
        playsinline: props.playsinline,
        height: props.height,
        width: props.width,
        closeVideoClick: true, //单击暂停/播放
        closeVideoDblclick: true, //双击全屏
        // cssFullscreen: false, //显示样式全屏
        // download: true, //显示下载按钮
        // controls: false,
        // marginControls: true,
        controls: {
            mode: "bottom"
        },
        // icons: {
        //   startPlay: `<div></div>`,
        //   startPause: `<div></div>`
        // },
        // ignores: ["start", "progresspreview"],
        commonStyle: {
            // 进度条底色
            progressColor: "",
            // 播放完成部分进度条底色
            playedColor: "#1e90ff",
            // 缓存部分进度条底色
            cachedColor: "#ff9700",
            // 进度条滑块样式
            sliderBtnStyle: {},
            // 音量颜色
            volumeColor: "#ff9700"
        },
        playbackRate: [0.25, 0.5, 1, 1.5, 2, 3],
        // inactive: 1500, //播放器focus状态自动消失延迟时长，单位为ms
        // leavePlayerTime: 1500, //鼠标移出播放器区域就隐藏时间
        autoplay: false, // 禁止自动播放
        preload: "none", // 禁止在播放前加载视频资源
        whitelist: [""]
    });
    
    player.play();
};

</script>