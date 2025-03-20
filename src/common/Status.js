// 在一个单独的文件中，比如 commonMap.js
import { reactive } from 'vue';

const GlobalQueryStatus = reactive({
  1: '等待中',
  2: '处理中',
  3: '成功',
  4: '失败'
});

const Status = reactive({
  1: '等待中',
  2: '处理中',
  3: '成功',
  4: '失败',
  'PENDING': '等待中',
  'TRAINING': '处理中',
  'COMPLETED': '处理中',
  'FAILED': '失败',
  'PUBLISHED': '成功',
  'REVOKED': '失败',
  'DM_1': '等待中',
  'DM_2': '处理中',
  'DM_3': '失败',
  'DM_4': '成功',
  'DM_5': '处理中'
  // 更多的键值对
});

export { Status, GlobalQueryStatus };