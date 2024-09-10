import axios from '@/axios'
import { ElNotification } from 'element-plus'

const dighumUrl = process.env.DIGHUM_URL;

const downloadResource = (async (resource) => {
    const response = await axios.get(dighumUrl + resource.resourceUrl, {
        responseType: 'blob' // 设置响应类型为Blob
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    let fileName = resource.comKey.fileName;
    if (!resource.comKey.fileName.includes(".")) {
        fileName = fileName + '.' + resource.resourceUrl.split('.').pop();
    }
    let file
    link.setAttribute('download', resource.comKey.fileName); // 设置文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // 清理
    window.URL.revokeObjectURL(url); // 释放URL对
})

function deleteResource(res, resS) {
    axios.delete("/v1/resource/deleteResource", { data: res }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status = '200') {
            const index = resS.findIndex(resource =>
                resource.comKey.userId === res.comKey.userId &&
                resource.comKey.fileType === res.comKey.fileType &&
                resource.comKey.fileName === res.comKey.fileName
            );
            if (index !== -1) {
                resS.splice(index, 1);
                ElNotification({
                    title: 'Success',
                    message: '删除成功',
                    type: 'success',
                });
            }
        } else {
            ElNotification({
                title: 'Error ',
                message: '删除失败，请联系管理员！',
                type: 'error',
            })
        }

    }).catch(error => {
        ElNotification({
            title: 'Error ',
            message: '内部异常，请联系管理员！' + error,
            type: 'error',
        })
    });
}

export { downloadResource, deleteResource }