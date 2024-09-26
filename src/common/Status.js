// 在一个单独的文件中，比如 commonMap.js
import { reactive } from 'vue';

const Status = reactive({
  1: '等待中',
  2: '处理中',
  3: '成功',
  4: '失败'
  // 更多的键值对
});

export { Status };