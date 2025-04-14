<!-- 协议内容弹窗 -->
<template>
    <el-dialog title="NQAI数字人" v-model="props.currentAgreement" @close="handleAgreementClose" width="80%" top="50px">
        <!-- 用户协议 -->
        <div v-if="props.currentAgreement === 'user'" class="agreement-content" v-html="content"></div>
        <!-- 隐私政策 -->
        <div v-if="props.currentAgreement === 'privacy'" class="agreement-content" v-html="content"></div>
        <!-- 免责声明 -->
        <div v-if="props.currentAgreement === 'disclaimer'" class="agreement-content" v-html="content"></div>
    </el-dialog>
</template>
<script setup>
import { ref, watch } from 'vue'
import mammoth from 'mammoth'

const props = defineProps({
    currentAgreement: {
        type: String,
        required: true
    }
})

async function loadDocx(path) {
    const response = await fetch(path)
    const arrayBuffer = await response.arrayBuffer()
    const { value } = await mammoth.convertToHtml({ arrayBuffer })
    content.value = value
}

const content = ref('')
watch(() => props.currentAgreement, async (newVal) => {
    if (newVal) {
        const fileMap = {
            'user': 'src/assets/docs/user.docx',
            'privacy': 'src/assets/docs/privacy.docx',
            'disclaimer': 'src/assets/docs/disclaimer.docx'
        }
        await loadDocx(fileMap[newVal])
    }
}, { immediate: true })

const handleAgreementClose = () => {}
</script>