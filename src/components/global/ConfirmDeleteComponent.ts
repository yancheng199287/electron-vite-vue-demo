import {ElMessageBox, ElMessage} from 'element-plus'


function confirmDelete(vueInstance: any, okCallback: () => void, cancelCallback: () => void) {
    ElMessageBox.confirm(
        '删除可能无法撤销，请谨慎确认，要删除吗?',
        '删除警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            if (okCallback) okCallback();
            ElMessage({
                type: 'success',
                message: '已经删除',
            })
        })
        .catch(() => {
            if (cancelCallback) cancelCallback();
        })
}

const ConfirmDeleteComponent = {
    // use方法会自动执行这个方法，把vue实例传进去// use方法会自动执行这个方法，把vue实例传进去
    install: function (vueApp:any, opts:any) {
        vueApp.config.globalProperties.$myConfirmDelete = (okCallback: () => void, cancelCallback: () => void) => confirmDelete(vueApp, okCallback, cancelCallback)
    }
};

export default ConfirmDeleteComponent;


