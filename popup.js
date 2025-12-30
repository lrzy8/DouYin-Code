//**抖音养号插件 */
//**懒人必备 So 懒人资源就分享给大家 */
//** 懒人资源吧唯一网址 www.lrzy8.com*/
//** 作者微信lanrenzy8 */

document.addEventListener('DOMContentLoaded', async () => {
    // 获取DOM元素
    const videoDurationMinInput = document.getElementById('videoDurationMin');
    const videoDurationMaxInput = document.getElementById('videoDurationMax');
    const likeFreqMinInput = document.getElementById('likeFreqMin');
    const likeFreqMaxInput = document.getElementById('likeFreqMax');
    const followFreqMinInput = document.getElementById('followFreqMin');
    const followFreqMaxInput = document.getElementById('followFreqMax');
    const maxVideosInput = document.getElementById('maxVideos');
    const saveButton = document.getElementById('saveButton');
    const enableSwitch = document.getElementById('enableSwitch');
    const websiteButton = document.getElementById('websiteButton');

    // 加载已保存的设置
    async function loadSettings() {
        const saved = await chrome.storage.sync.get([
            'videoDurationMin', 'videoDurationMax', 
            'likeFreqMin', 'likeFreqMax',
            'followFreqMin', 'followFreqMax',
            'maxVideos',
            'isEnabled'
        ]);
        
        videoDurationMinInput.value = saved.videoDurationMin || 5;
        videoDurationMaxInput.value = saved.videoDurationMax || 30;
        likeFreqMinInput.value = saved.likeFreqMin || 3;
        likeFreqMaxInput.value = saved.likeFreqMax || 8;
        followFreqMinInput.value = saved.followFreqMin || 5;
        followFreqMaxInput.value = saved.followFreqMax || 12;
        maxVideosInput.value = saved.maxVideos || 100;
        enableSwitch.checked = saved.isEnabled !== undefined ? saved.isEnabled : true;
    }
    
    // 初始加载设置
    await loadSettings();
    
    // 监听 storage 变化，实时更新开关状态
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && changes.isEnabled) {
            enableSwitch.checked = changes.isEnabled.newValue;
            console.log('插件状态已更新：', changes.isEnabled.newValue);
        }
    });

    // 保存开关状态
    enableSwitch.addEventListener('change', async () => {
        await chrome.storage.sync.set({ isEnabled: enableSwitch.checked });
    });
    
    // 访问网站按钮
    websiteButton.addEventListener('click', () => {
        window.open('https://www.lrzy8.com', '_blank');
    });

    // 保存设置
    saveButton.addEventListener('click', async () => {
        const videoDurationMin = parseInt(videoDurationMinInput.value);
        const videoDurationMax = parseInt(videoDurationMaxInput.value);
        const likeFreqMin = parseInt(likeFreqMinInput.value);
        const likeFreqMax = parseInt(likeFreqMaxInput.value);
        const followFreqMin = parseInt(followFreqMinInput.value);
        const followFreqMax = parseInt(followFreqMaxInput.value);
        const maxVideos = parseInt(maxVideosInput.value);

        // 验证输入值
        if (isNaN(videoDurationMin) || isNaN(videoDurationMax) || 
            videoDurationMin < 1 || videoDurationMax > 60 || videoDurationMin > videoDurationMax ||
            isNaN(likeFreqMin) || isNaN(likeFreqMax) || 
            likeFreqMin < 1 || likeFreqMax > 50 || likeFreqMin > likeFreqMax ||
            isNaN(followFreqMin) || isNaN(followFreqMax) || 
            followFreqMin < 1 || followFreqMax > 50 || followFreqMin > followFreqMax ||
            isNaN(maxVideos) || maxVideos < 1 || maxVideos > 1000) {
            alert('请检查输入值：\n- 播放时长范围1-60秒，最小值需小于等于最大值\n- 点赞/关注频率范围1-50，最小值需小于等于最大值\n- 自动停止视频数范围1-1000');
            return;
        }

        await chrome.storage.sync.set({
            videoDurationMin,
            videoDurationMax,
            likeFreqMin,
            likeFreqMax,
            followFreqMin,
            followFreqMax,
            maxVideos
        });
        alert('设置已保存');
    });
});