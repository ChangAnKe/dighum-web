// 在一个单独的文件中，比如 commonMap.js
import { reactive } from 'vue';

const Tag = reactive({
    'AI': 'AI',
    'AI-Model': 'AI-模板',
    'ORI': '原始文件',
    // 更多的键值对
});

const Gender = reactive({
    'male': "男",
    'female': "女"
});

export { Tag, Gender };