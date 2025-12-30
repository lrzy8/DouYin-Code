//**抖音养号插件 */
//**懒人必备 So 懒人资源就分享给大家 */
//** 懒人资源吧唯一网址 www.lrzy8.com*/
//** 作者微信lanrenzy8 */

chrome.action.onClicked.addListener(async (tab) => {
    const { isEnabled } = await chrome.storage.sync.get('isEnabled');
    const newIsEnabled = typeof isEnabled === 'undefined' ? true : !isEnabled;
    await chrome.storage.sync.set({ isEnabled: newIsEnabled });

    // 启用时：打开或刷新抖音页面
    if (newIsEnabled) {
        // 检查当前标签页是否为抖音页面
        if (!tab.url || !tab.url.includes('douyin.com')) {
            // 如果不是抖音页面，则跳转到抖音
            await chrome.tabs.update(tab.id, { url: 'https://www.douyin.com/?recommend=1' });
        } else {
            // 如果已经是抖音页面，则刷新页面（重新注入脚本）
            await chrome.tabs.reload(tab.id);
        }
    }
});

// 检查当前页面是否为抖音页面，如果不是且插件启用，则自动跳转
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.includes('douyin.com')) {
        const { isEnabled } = await chrome.storage.sync.get('isEnabled');
        if (isEnabled === true) {
            // 等待一段时间确保页面完全加载后再跳转
            setTimeout(async () => {
                await chrome.tabs.update(tabId, { url: 'https://www.douyin.com/?recommend=1' });
            }, 1000);
        }
    }
});
