<template>
    <el-form :inline="true" :model="userForm" class="userForm">
        <el-form-item label="姓名">
            <el-input v-model="userForm.userName" clearable />
        </el-form-item>
        <el-form-item label="手机号">
            <el-input v-model="userForm.phoneNumber" clearable />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getSubUsers" :loading="isLoading">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="users" style="width: 100%;margin-left: 30px; margin-top: 30px;">
        <el-table-column fixed prop="userName" label="姓名" width="150" />
        <el-table-column prop="phoneNumber" label="手机号" width="150" />
        <el-table-column prop="balance" label="积分余额" width="100" />
        <el-table-column prop="remarks" label="备注" width="300" />
        <el-table-column label="注册时间" width="200">
            <template #default="{ row }">
                {{ moment(row.createdDate).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200">
            <template #default="{ row }">
                <el-button plain type="success" size="small" @click="openScoreDialog(row.userId)">
                    积分调整
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="paging">
        <el-pagination style="margin-top: 30px; margin-right: 20px; float: right;" v-if="users.length > 0" background
            layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10, 20, 30]" :pager-count="5"
            @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="currentPage"
            :page-size="pageSize" />
    </div>


    <el-dialog v-model="scoreFormVisible" title="积分调整" width="300">
        <el-form :model="scoreForm">
            <el-form-item label="上调" style="width: 270px;">
                <el-input v-model="scoreForm.balanceInc" autocomplete="off" />
            </el-form-item>
            <el-form-item label="扣除" style="width: 270px;">
                <el-input v-model="scoreForm.balanceDec" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeScoreFormDialog()">取消</el-button>
                <el-button type="primary" @click="updateBalance()">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue';
import User from '@/common/dto/User';
import { useUserStore } from '@/stores/UseUserStore';
import { notify } from '@/common/Notification';
import axios from '@/axios';
import moment from 'moment-timezone';
import { isEmpty, isNumber } from '@/common/Objects';

const userForm = reactive(new User());
const userInfo = useUserStore().getUserInfo;
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
let users = reactive([])
const isLoading = ref(false);
const scoreFormVisible = ref(false);
const scoreForm = reactive({
    balanceInc: '',
    balanceDec: '',
    userId: userInfo.userId,
    subUserId: ''
})

const handleSizeChange = (newPageSize) => {
    pageSize.value = newPageSize;
    getSubUsers(); // 切换页码时，重新加载数据
};


const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    getSubUsers(); // 切换页码时，重新加载数据
};

function getSubUsers() {
    userForm.parentUserId = userInfo.userId;
    axios.post("/v1/auth/user/view/subUserList", userForm, {
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
                notify('成功', '无下级用户！', 'success');
            } else {
                total.value = response.data.totalElements;
                //确保使用响应式的方式更新数组
                users.splice(0, users.length, ...response.data.content);
            }
        } else {
            notify('失败', '获取下级用户失败，请联系管理员！', 'error');
        }

    }).catch(error => {
        isLoading.value = false;
        notify('失败', '获取下级用户异常，请联系管理员！', 'error');
    });
}

function openScoreDialog(userId) {
    resetScoreForm();
    scoreFormVisible.value = true;
    scoreForm.subUserId = userId;
    console.log(scoreForm.subUserId)
}

function resetScoreForm() {
    scoreForm.balanceInc = '';
    scoreForm.balanceDec = '';
    scoreForm.subUserId = '';
}


function updateBalance() {
    if (isEmpty(scoreForm.balanceInc) && isEmpty(scoreForm.balanceDec)) {
        notify('', '请输入需要调整的积分值', 'warning');
        return false;
    }
    if ((!isEmpty(scoreForm.balanceInc) && scoreForm.balanceInc <= 0) || (!isEmpty(scoreForm.balanceDec) && scoreForm.balanceDec <= 0)) {
        notify('', '调整的积分值需大于0', 'warning');
        return false;
    }
    if ((!isEmpty(scoreForm.balanceInc) && !isNumber(scoreForm.balanceInc)) || (!isEmpty(scoreForm.balanceDec) && !isNumber(scoreForm.balanceDec))) {
        notify('', '非法输入，请填入数字', 'warning');
        return false;
    }
    if (!isEmpty(scoreForm.balanceInc) && !isEmpty(scoreForm.balanceDec)) {
        notify('', '只能填一项', 'warning');
        return false;
    }
    axios.put('/v1/auth/user/updateBalance', scoreForm, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        let code = response.data.code;
        if (code == 200) {
            notify('成功', '积分调整成功', 'success');
        } else {
            notify('失败', '积分调整失败：' + response.data.remarks, 'error');
        }
    }).catch(error => {
        console.log('error:', error);
        notify('失败', '未知错误，请联系管理员', 'error');
    })
    closeScoreFormDialog();
    resetScoreForm();
}

function closeScoreFormDialog() {
    scoreFormVisible.value = false;
}
</script>
<style scoped>
.userForm {
    margin-left: 30px;
    margin-top: 30px;
}

.userForm .el-input {
    --el-input-width: 220px;
}

.userForm .el-select {
    --el-select-width: 220px;
}

.paging {
    position: relative;
}
</style>