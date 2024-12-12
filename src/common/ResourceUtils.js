import axios from '@/axios'
import { ElNotification } from 'element-plus'
import { isEmpty } from './Objects';

const dighumUrl = process.env.DIGHUM_URL;
const downloadResource = (async (resource) => {
    let fileName = resource.comKey.fileName;
    if (!resource.comKey.fileName.includes(".")) {
        fileName = fileName + '.' + resource.resourceUrl.split('.').pop();
    }
    const link = document.createElement('a');
    let preSignedUrl = await fetchPreSignedUrl(resource.comKey.fileType+ '@_@' + resource.comKey.fileName);
    link.href = isEmpty(resource.resourceUrl) ? preSignedUrl : (dighumUrl + resource.resourceUrl);
    link.setAttribute('target', '_blank');
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


const fetchPreSignedUrl = async (id) => {
    try {
        let arr = id.split("@_@");
        const response = await axios.get('/v1/resource/cloud/pres/url/' + arr[0] + '/' + arr[1]);
        return response.data.url;
    } catch (error) {
        console.error("Error fetching fetchPreSignedUrl URL:", error);
        return "";
    }
};

export { downloadResource, deleteResource, fetchPreSignedUrl }