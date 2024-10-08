// 在一个单独的文件中，比如 commonMap.js
import { reactive } from 'vue';

const VoiceCloneType = reactive({
  9: '基础版',
  20: '高保真',
  'AI-Model': "模板",
  AI: 'AI',
  ORI: '原始'
  // 更多的键值对
});

function getCloneType(key) {
  return VoiceCloneType[key];
}

export { VoiceCloneType };