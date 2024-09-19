import { ElNotification } from 'element-plus'

function notify(title, message, type, duration) {
    duration = duration == null ? 5000 : duration;
    ElNotification({
        title: title,
        message: message,
        type: type,
        duration: duration
    })
}

export { notify }