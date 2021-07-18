/* 
    1. Render songs --> ok
    2. Scrool top   --> ok
    3. Play/ pause/ seek 
    4. CD rotate
    5. next/ prev
    6. random
    7. next/ repeat when ended
    8. Active Song
    9.Scroll active song intro view
    10. play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const playList = $('.playlist')
const Cdthumb = $('.cd-thumb');
const cd = $('.cd');
const heading = $('h2');
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-back')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-reload')
const song = $('.song')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Oh Nah Nah',
            singer: '$ATIVA',
            path: './assets/music/ok-nah-nah-$ativa.mp3',
            image: './assets/image/ok-nah-nah.jpg'
        },
        {
            name: 'Ai',
            singer: 'DSK',
            path: './assets/music/ai-dsk.mp3',
            image: './assets/image/ai.jpg'
        },
        {
            name: 'Bạn Bè',
            singer: 'JGKiD',
            path: './assets/music/ban-be-thom.mp3',
            image: './assets/image/ban-be.jpg'
        },
        {
            name: 'Chuyện Đời',
            singer: 'JGKiD',
            path: './assets/music/chuyen-doi-thom.mp3',
            image: './assets/image/chuyen-doi.jpg'
        },
        {
            name: 'CILU',
            singer: 'Da Lad',
            path: './assets/music/cilu-thom.mp3',
            image: './assets/image/cilu.jpg'
        },
        {
            name: 'Cổ Lùn',
            singer: 'JGKiD',
            path: './assets/music/co-lun-thom.mp3',
            image: './assets/image/co-lun.jpg'
        },
        {
            name: 'Đôi Bờ',
            singer: 'DSK',
            path: './assets/music/doi-bo-dsk.mp3',
            image: './assets/image/doi-bo.jpg'
        },
        {
            name: 'Hà Nội Của Bố',
            singer: 'JGKiD',
            path: './assets/music/ha-noi-cua-bo-thom.mp3',
            image: './assets/image/ha-noi-cua-bo.jpg'
        },
        {
            name: 'Hát Cho Đời Và Cho Em',
            singer: 'JGKiD',
            path: './assets/music/hat-cho-doi-va-cho-em-thom.mp3',
            image: './assets/image/hat-cho-doi-va-cho-em.jpg'
        },
        {
            name: 'HOT',
            singer: 'WXRDIE',
            path: './assets/music/hot-wxrdie.mp3',
            image: './assets/image/hot.jpg'
        },
        {
            name: 'Malibu',
            singer: '$ATIVA',
            path: './assets/music/malibu-$ativa.mp3',
            image: './assets/image/malibu.jpg'
        },
        {
            name: 'Marlboro',
            singer: 'Lê Minh',
            path: './assets/music/marlboro-minh.mp3',
            image: './assets/image/marlboro.jpg'
        },
        {
            name: 'Tan Ka',
            singer: 'JGKiD',
            path: './assets/music/tan-ka-thom.mp3',
            image: './assets/image/tan-ka.jpg'
        }
    ],
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return  `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index =${index}>
                <div class="thumb" style="background-image: url(${song.image});">
                </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>`
        })
        playList.innerHTML = htmls.join('\n');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        var cdWidth = cd.offsetWidth;
        let _this = this;
        //Xử lý CD quay / dừng
        const CdThumbAnimate = Cdthumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        CdThumbAnimate.pause()
        // Xử lý Phóng to / thu nhỏ
        document.onscroll = function(){
            let scrollTop = window.scrollY;
            let newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }
        // Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        // Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            CdThumbAnimate.play()
        }
        // Khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            CdThumbAnimate.pause()
        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // Xử lý khi tua xong
        progress.oninput = function(e){
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime;
        }
        // Khi next bài hát 
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.nextSong()
            }
            audio.play()
        },
        // Khi prev bài hát
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.prevSong()
            }
            audio.play();
            _this.render();
        }
        // Khi random bài hát
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // Xử lý repeat bài hát
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                _this.loadCurrentSong()
            }else{
                nextBtn.click()
            }
            audio.play();
        }
        // Lắng nghe click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || !e.target.closest('.option')){
                //Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout( ()=> {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        Cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        this.render();
        this.scrollToActiveSong();
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();

    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    start: function(){
        // Load config khi ứng dụng chạy
        this.loadConfig();
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (Dom Events)
        this.handleEvents();
        
        // Tải thông tin bài hát vào UI khi chạy
        this.loadCurrentSong();
        //Render playlist
        this.render();
        // Hiển thị trạng thái ban đầu của btn Repeat và Random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start()