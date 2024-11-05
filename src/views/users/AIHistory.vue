<template>
    <el-form :inline="true" :model="searchForm" class="searchForm">
        <el-form-item label="">
            <el-date-picker v-model="searchForm.startDate" type="datetime" placeholder="起始日期" format="YYYY/MM/DD"
                time-format="HH:mm" value-format="YYYY/MM/DD" />
        </el-form-item>
        <el-form-item label="">
            <el-date-picker v-model="searchForm.endDate" type="datetime" placeholder="结束时间" format="YYYY/MM/DD"
                time-format="HH:mm" value-format="YYYY/MM/DD" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getAIHistory" :loading="isLoading">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="userLogs" style="width: 100%;margin-left: 30px; margin-top: 30px;">
        <el-table-column fixed prop="logDate" label="操作日期" :formatter="formatDate" width="200" />
        <el-table-column prop="remarks" label="记录" width="500" />
        <el-table-column prop="balance" label="积分余额" width="100" />
    </el-table>
    <div class="paging">
        <el-pagination style="margin-top: 30px; margin-right: 20px; float: right;" v-if="userLogs.length > 0" background
            layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10, 20, 30]" :pager-count="5"
            @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="currentPage"
            :page-size="pageSize" />
    </div>

</template>
<script setup>
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/UseUserStore';
import { notify } from '@/common/Notification';
import axios from '@/axios';

const userInfo = useUserStore().getUserInfo;
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
let userLogs = reactive([])
const isLoading = ref(false);
const searchForm = reactive({
    startDate: null,
    endDate: null,
    userId: userInfo.userId
})

const handleSizeChange = (newPageSize) => {
    pageSize.value = newPageSize;
    getAIHistory(); // 切换页码时，重新加载数据
};


const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    getAIHistory(); // 切换页码时，重新加载数据
};

const formatDate = (row, column, cellValue) => {
    if (!cellValue) return '';
    const date = new Date(cellValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

function getAIHistory() {
    axios.post("/v1/auth/user/aiHistory", searchForm, {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 20000,
        params: {
            page: currentPage.value - 1, //后端从0开始前端从1开始
            pageSize: pageSize.value
        }
    }).then(response => {
        isLoading.value = false;
        if (response.status = '200') {
            if (response.data.totalElements == 0) {
                notify('成功', '无AI记录！', 'success');
            } else {
                total.value = response.data.totalElements;
                //确保使用响应式的方式更新数组
                userLogs.splice(0, userLogs.length, ...response.data.content);
            }
        } else {
            notify('', '查询失败，请联系管理员！', 'error');
        }

    }).catch(error => {
        isLoading.value = false;
        notify('', '查询异常，请联系管理员！', 'error');
    });
}


</script>
<style scoped>
.searchForm {
    margin-left: 30px;
    margin-top: 30px;
}

.paging {
    position: relative;
}
</style>