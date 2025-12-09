// script.js
document.addEventListener('DOMContentLoaded', function() {
  // 初始化變數
  let minutes = 3;
  let seconds = 0;
  let timer = null;
  let isRunning = false;
  
  // DOM 元素
  const timerDisplay = document.getElementById('timer');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const presetBtns = document.querySelectorAll('.btn-preset');
  const adjustBtns = document.querySelectorAll('.btn-adjust');
  const modeBtns = document.querySelectorAll('.btn-mode');
  const modeTitle = document.getElementById('mode-title');
  const musicBtn = document.getElementById('musicBtn');
  const musicPlayer = document.getElementById('musicPlayer');
  
  // 更新顯示
  function updateDisplay() {
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  // 添加用戶交互事件監聽器，為音频播放做準備
  document.addEventListener('click', function() {
    // 預加載音频，但不播放
    if (musicPlayer.readyState === 0) {
      musicPlayer.load();
    }
  }, { once: true });
  
  // 開始/暫停計時器
  function toggleTimer() {
    if (isRunning) {
      clearInterval(timer);
      startBtn.textContent = '開始';
    } else {
      // 確保有剩餘時間
      if (minutes === 0 && seconds === 0) return;
      
      timer = setInterval(function() {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            isRunning = false;
            startBtn.textContent = '開始';
            return;
          }
          minutes--;
          seconds = 59;
        } else {
          seconds--;
        }
        updateDisplay();
      }, 1000);
      startBtn.textContent = '暫停';
    }
    isRunning = !isRunning;
  }
  
  // 重設計時器
  function resetTimer() {
    clearInterval(timer);
    minutes = 3;
    seconds = 0;
    isRunning = false;
    startBtn.textContent = '開始';
    updateDisplay();
  }
  
  // 設定預設時間
  function setPreset(mins) {
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
      startBtn.textContent = '開始';
    }
    minutes = mins;
    seconds = 0;
    updateDisplay();
  }
  
  // 調整時間
  function adjustTime(value) {
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
      startBtn.textContent = '開始';
    }
    minutes = Math.max(1, minutes + value);
    seconds = 0;
    updateDisplay();
  }
  
  // 切換模式
  function switchMode(mode, title) {
    if (modeTitle) {
      modeTitle.textContent = title;
    }
    
    // 根據模式設定預設時間
    switch(mode) {
      case 'break':
        setPreset(5); // 休息預設 5 分鐘
        break;
      case 'start':
        setPreset(10); // 開場預設 10 分鐘
        break;
      case 'practice':
        setPreset(10); // 練習預設 10 分鐘
        break;
    }
  }
  
  // 事件監聽器
  startBtn.addEventListener('click', function() {
    toggleTimer();
    // 開始計時器時自動播放音樂（如果音樂按鈕已經設置為播放狀態）
    if (musicBtn.classList.contains('playing') && !isMusicPlaying()) {
      playMusic();
    }
  });
  resetBtn.addEventListener('click', resetTimer);
  musicBtn.addEventListener('click', toggleMusic);
  
  presetBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      setPreset(parseInt(this.dataset.minutes));
    });
  });
  
  adjustBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      adjustTime(parseInt(this.dataset.adjust));
    });
  });
  
  modeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除所有按鈕的 active 類
      modeBtns.forEach(b => b.classList.remove('active'));
      // 添加 active 類到當前按鈕
      this.classList.add('active');
      // 切換模式
      switchMode(this.dataset.mode, this.dataset.title);
    });
  });
  
  // 初始化顯示
  updateDisplay();
  
  // 音樂播放相關功能
  
  function toggleMusic() {
    if (musicBtn.classList.contains('playing')) {
      // 停止音樂
      pauseMusic();
      musicBtn.classList.remove('playing');
      musicBtn.textContent = '🎵';
      document.body.classList.remove('music-playing');
    } else {
      // 播放音樂
      // 先嘗試靜音加載音频，然後再播放
      musicPlayer.muted = true;
      musicPlayer.load();
      musicPlayer.play().then(() => {
        // 加載成功後取消靜音並重新播放
        musicPlayer.muted = false;
        musicPlayer.currentTime = 0;
        playMusic();
        musicBtn.classList.add('playing');
        musicBtn.textContent = '⏸️';
        document.body.classList.add('music-playing');
      }).catch(error => {
        console.log('預加載失敗:', error);
        // 如果預加載失敗，直接嘗試播放
        playMusic();
        musicBtn.classList.add('playing');
        musicBtn.textContent = '⏸️';
        document.body.classList.add('music-playing');
      });
    }
  }
  
  function playMusic() {
    // 設置音量為 0.5 (50%)
    musicPlayer.volume = 0.5;
    
    // 先加載音樂文件
    musicPlayer.load();
    
    // 使u用 Promise 包裝播放操作，並處理可能的錯誤
    const playPromise = musicPlayer.play();
    
    // 現代瀏覽器要求用戶互動才能播放音樂
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // 播放成功
        console.log('音樂播放成功');
      }).catch(error => {
        // 播放失敗，可能是瀏覽器的自動播放政策阻止了播放
        console.log('播放音樂失敗:', error);
        // 將按鈕狀態重置為未播放
        musicBtn.classList.remove('playing');
        musicBtn.textContent = '🎵';
        document.body.classList.remove('music-playing');
      });
    }
  }
  
  function pauseMusic() {
    musicPlayer.pause();
  }
  
  function isMusicPlaying() {
    return !musicPlayer.paused;
  }
  
  // 粒子背景
  const particlesContainer = document.getElementById('particles');
  const particleCount = 30;
  
  // 創建粒子
  for (let i = 0; i < particleCount; i++) {
    createParticle();
  }
  
  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // 隨機尺寸與位置
    const size = Math.random() * 15 + 5;
    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    const opacity = Math.random() * 0.3 + 0.1;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    // 設定樣式
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}px`;
    particle.style.top = `${posY}px`;
    particle.style.opacity = opacity;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    // 隨機選擇顏色
    const colors = ['rgba(33, 164, 177, 0.2)', 'rgba(255, 217, 102, 0.2)'];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    particlesContainer.appendChild(particle);
    
    // 動畫結束後重新創建
    particle.addEventListener('animationend', function() {
      particle.remove();
      createParticle();
    });
  }
});
