//**抖音养号插件 */
//**懒人必备 So 懒人资源就分享给大家 */
//** 懒人资源吧唯一网址 www.lrzy8.com*/
//** 作者微信lanrenzy8 */

// 立即执行脚本
(async function() {
    console.log('懒人抖音养号插件已启动');
    
    const settings = await chrome.storage.sync.get([
        'videoDurationMin', 'videoDurationMax', 
        'likeFreqMin', 'likeFreqMax',
        'followFreqMin', 'followFreqMax',
        'maxVideos',
        'isEnabled'
    ]);
    
    console.log('插件设置：', settings);
    
    if (!settings.isEnabled) {
        console.log('插件未启用');
        return;
    }

    // 获取随机范围值
    const videoDurationMin = settings.videoDurationMin || 5;
    const videoDurationMax = settings.videoDurationMax || 30;
    const likeFreqMin = settings.likeFreqMin || 3;
    const likeFreqMax = settings.likeFreqMax || 8;
    const followFreqMin = settings.followFreqMin || 5;
    const followFreqMax = settings.followFreqMax || 12;
    const maxVideos = settings.maxVideos || 100;

    // 随机生成播放时长和频率
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let currentVideoDuration = getRandomInt(videoDurationMin, videoDurationMax) * 1000;
    let currentLikeFreq = getRandomInt(likeFreqMin, likeFreqMax);
    let currentFollowFreq = getRandomInt(followFreqMin, followFreqMax);

    let videoCount = 0;
    let likeCounter = 0;
    let followCounter = 0;
    
    // 模拟键盘"向下键"（抖音触发下一个视频的核心方式）
    function pressArrowDown() {
        console.log('尝试切换到下一个视频');
        
        // 方法1：尝试模拟按键事件（keydown + keyup）
        const keydownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            keyCode: 40,
            which: 40,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keydownEvent);
        
        const keyupEvent = new KeyboardEvent('keyup', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            keyCode: 40,
            which: 40,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyupEvent);
        
        // 方法2：尝试在body上触发
        document.body.dispatchEvent(keydownEvent);
        document.body.dispatchEvent(keyupEvent);
        
        // 方法3：尝试查找并点击"下一个"按钮
        const nextButton = document.querySelector('[data-e2e="feed-video-next"]') || 
                          document.querySelector('.video-next') ||
                          document.querySelector('[class*="next"]');
        if (nextButton) {
            console.log('找到下一个按钮，尝试点击');
            nextButton.click();
        }
    }

    // 检测是否为直播
    function isLiveStream() {
        // 检测直播标识：直播标签、直播相关的类名或元素
        const liveIndicators = [
            document.querySelector('[data-e2e="living-tag"]'),
            document.querySelector('.living-tag'),
            document.querySelector('.live-tag'),
            document.querySelector('[class*="living"]'),
            document.querySelector('[class*="live-stream"]')
        ];
        return liveIndicators.some(indicator => indicator !== null);
    }

    // 点赞
    function likeVideo() {
        // 检测是否为直播
        if (isLiveStream()) {
            console.log('检测到直播，跳过点赞');
            return;
        }
            
        console.log('尝试点赞');
            
        // 方法1：模拟Z键（keydown + keyup）
        const keydownEvent = new KeyboardEvent('keydown', {
            key: 'z',
            code: 'KeyZ',
            keyCode: 90,
            which: 90,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keydownEvent);
            
        const keyupEvent = new KeyboardEvent('keyup', {
            key: 'z',
            code: 'KeyZ',
            keyCode: 90,
            which: 90,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyupEvent);
            
        // 方法2：在body上触发
        document.body.dispatchEvent(keydownEvent);
        document.body.dispatchEvent(keyupEvent);
            
        // 方法3：尝试查找并点击点赞按钮
        const likeBtn = document.querySelector('[data-e2e="like-icon"]') ||
                       document.querySelector('[aria-label="点赞"]') ||
                       document.querySelector('.like-icon') ||
                       document.querySelector('[class*="like"]');
        if (likeBtn) {
            console.log('找到点赞按钮，尝试点击');
            likeBtn.click();
        }
            
        console.log('已点赞');
    }

    // 关注
    function followUser() {
        // 检测是否为直播
        if (isLiveStream()) {
            console.log('检测到直播，跳过关注');
            return;
        }
            
        console.log('尝试关注');
            
        // 方法1：模拟G键（keydown + keyup）
        const keydownEvent = new KeyboardEvent('keydown', {
            key: 'g',
            code: 'KeyG',
            keyCode: 71,
            which: 71,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keydownEvent);
            
        const keyupEvent = new KeyboardEvent('keyup', {
            key: 'g',
            code: 'KeyG',
            keyCode: 71,
            which: 71,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyupEvent);
            
        // 方法2：在body上触发
        document.body.dispatchEvent(keydownEvent);
        document.body.dispatchEvent(keyupEvent);
            
        // 方法3：尝试查找并点击关注按钮
        const followBtn = document.querySelector('[data-e2e="follow-icon"]') ||
                         document.querySelector('[aria-label="关注"]') ||
                         document.querySelector('.follow-icon') ||
                         document.querySelector('[class*="follow"]');
        if (followBtn) {
            console.log('找到关注按钮，尝试点击');
            followBtn.click();
        }
            
        console.log('已关注');
    }



    // 自动刷视频主逻辑
    async function autoScroll() {
        // 再次检查插件是否启用（防止用户手动关闭）
        const currentSettings = await chrome.storage.sync.get('isEnabled');
        if (!currentSettings.isEnabled) {
            console.log('插件已被关闭，停止刷视频');
            return;
        }
        
        videoCount++;
        console.log(`第${videoCount}个视频`);
        
        // 检查是否达到最大视频数
        if (videoCount >= maxVideos) {
            console.log(`已达到设定的最大视频数${maxVideos}，自动停止`);
            // 关闭插件
            await chrome.storage.sync.set({ isEnabled: false });
            // 显示提示
            alert(`🎉 任务完成！

已经连续刷了 ${videoCount} 个视频
插件已自动停止。

如需继续使用，请点击插件图标重新启用。`);
            return;
        }

        // 更新计数器
        likeCounter++;
        followCounter++;

        let extraWatchTime = 0; // 额外观看时间
        
        // 达到点赞频率则点赞
        if (likeCounter === currentLikeFreq) {
            likeVideo();
            likeCounter = 0;
            // 点赞后需要额外观看5-10秒
            extraWatchTime = getRandomInt(5, 10) * 1000;
            console.log(`点赞后额外观看${extraWatchTime / 1000}秒`);
            // 重新生成下一个随机频率
            currentLikeFreq = getRandomInt(likeFreqMin, likeFreqMax);
        }
        
        // 达到关注频率则关注
        if (followCounter === currentFollowFreq) {
            followUser();
            followCounter = 0;
            // 关注后也需要额外观看5-10秒
            const followExtraTime = getRandomInt(5, 10) * 1000;
            extraWatchTime = Math.max(extraWatchTime, followExtraTime);
            console.log(`关注后额外观看${followExtraTime / 1000}秒`);
            // 重新生成下一个随机频率
            currentFollowFreq = getRandomInt(followFreqMin, followFreqMax);
        }

        // 模拟向下键，触发下一个视频
        pressArrowDown();

        // 使用当前随机时长 + 额外观看时间作为切换间隔
        const totalWaitTime = currentVideoDuration + extraWatchTime;
        setTimeout(autoScroll, totalWaitTime);
        
        // 重新生成下一个随机播放时长
        currentVideoDuration = getRandomInt(videoDurationMin, videoDurationMax) * 1000;
    }

    // 启动
    console.log('开始自动刷视频');
    autoScroll();
})();