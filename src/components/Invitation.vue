<template>
  <div class="wedding-invitation" :class="{ 'invitation-bounce':canOpen }" :style="computedStyle">
    <div class="invitation-container" :class="{ 'invitation-down':isOpening }">
      <div class="invitation-cover">
        <div class="cover-content" :class="{'invitation-up':isOpening}">
          <transition name="turn">
            <div class="content-inside" v-if="current===-1" key="-1">
              <img class="content-inside-photo" src="../images/photo.jpg">
              <p><b>请来参加我们的婚礼吧！</b></p>
              <p class="name"><b><a href="https://extremej.itscoder.com/" target="_blank">全柟亿</a> & <a href="https://cassieran.github.io/about" target="_blank">冉桂华</a></b></p>
              <p>时间：2020年<b>2月9日</b> 星期天</p>
              <p>婚礼：龙潭镇永兴街66号 <b>福音堂 上午11时</b></p>
              <p>酒宴：龙潭镇渝湘路 <b>恒都酒店 下午2时</b></p>
              <div class="content-inside-wish">
                <input
                  class="content-inside-input"
                  placeholder="轻触写下祝福" 
                  @keyup.enter="loseFocus"
                  @focus="isFocused = true"
                  @blur="isFocused = false, hasEntered = false"
                  v-model="wish"
                  ref="wishInput"
                >
                <div class="content-inside-button" @click="sendBarrage">发送祝福</div>
              </div>
              <span class="prev" @click="back">看弹幕</span>
              <span class="next" @click="next">看照片</span>
            </div>
            <template v-else v-for="(item,index) in pictures">
                <div class="content-inside" :key="index" v-if="current===index">
                    <img class="content-inside-photo" :src="item">
                    <span class="prev" @click="prev">上一个</span>
                    <span class="next" @click="next">下一个</span>
                </div>
            </template>
          </transition>
          
        </div>
        <div class="cover-inside-left" :class="{'opening':isOpening}"><div class="cover-inside-left-title">我们结婚啦！</div></div>
        <div class="cover-inside-right" :class="{'opening':isOpening}"></div>
        <img class="cover-inside-seal" src="../images/seal.png" @click="openInvitation" :class="{'invitation-flight':isOpening}">
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import data from '../mock/data';
export default {
  props: ['canOpen'],
  data() {
    return {
      isOpening: false,
      wish: null,
      isFocused: false,
      hasEntered: false,
      current: -1,
      pictures: [require('../images/pic_1.jpg'),require('../images/pic_2.jpg'),require('../images/pic_3.jpg')],
    }
  },
  created() {
    this.preload()
  },
  computed: {
    computedStyle() {
      let width
      let height
        const standardWidth = 375
        const standardHeight = 667
        const standardRate = standardWidth/standardHeight
        const deviceWidth = document.body.clientWidth //window.screen.availWidth
        const deviceHeight = document.body.clientHeight
        const rate = deviceWidth/deviceHeight
          if(rate > standardRate){
            height = deviceHeight
            width = height * standardWidth/standardHeight
          }else {
            width = deviceWidth
            height = width / (standardWidth/standardHeight)
          }
        console.log(deviceWidth,deviceHeight)

        return `width: ${width}px;height: ${height}px;top:50%;left:50%;margin-top: -${height/2}px;margin-left: -${width/2}px;`
    },
  },
  methods: {
    // 打开邀请函
    openInvitation(){
      this.isOpening = true
    },
    // 发送弹幕
    async sendBarrage(){
        this.hasEntered = true
        if (!this.wish) return
        const res = await axios.post('/api/blessing', {
            blessing: this.wish
        })
        this.$emit('sendBarrage', this.wish)
        this.wish = null

        if(res.data.code === 0) {
          alert('祝福收到啦，我们会仔细看的！')
        }        
    },
    loseFocus(){
      this.$refs.wishInput.blur()
    },
    back() {
      this.isOpening = false
      setTimeout(() => {
          this.$emit('sendBarrage')
        }, 660)
    },
    prev() {
      this.current--
    },
    next() {
      if(this.current===this.pictures.length-1) return this.current = -1
      this.current++
    },
    preload() {
      let count = 0
      for (let img of this.pictures) {
        let image = new Image()
        image.src = img
        image.onload = () => {
          count++
          if(count >= this.pictures.length) console.log('加载完啦！')
        }
      }

    },
  }
}
</script>

<style lang="less">

.turn-enter-active, .turn-leave-active {
  transition: all 1s;
}

.turn-enter-to, .turn-leave {
  transform: rotate3d(0,0,0);
  opacity: 1;
}

.turn-enter, .turn-leave-to {
  transform: rotate3d(0,1,0,180deg);
  opacity: 0;
}
  .wedding-invitation{
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    padding: 60px 20px 30px;
    z-index: 4;
    transform: scale(0.05);
    -webkit-transform: scale(0.05);
    opacity: 0;
    transition: transform 0.8s cubic-bezier(.26,1.84,.39,.61), opacity 0.5s linear;
    -webkit-transition: -webkit-transform 0.8s cubic-bezier(.26,1.84,.39,.61), opacity 0.5s linear;
    background-size: 100%;
    // overflow: hidden;
    &.invitation-bounce{
      opacity: 1;
      transform: scale(1);
      -webkit-transform: scale(1);
    }
    .invitation-container{
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s cubic-bezier(0.4, 0, 1, 1);
      -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.4, 0, 1, 1);
      &.invitation-down{
        transform: translateY(20px);
        -webkit-transform: translateY(20px);
      }
      .invitation-cover{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f77269;
        border-radius: 10px;
        perspective: 500px;
        box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.15);
        .cover-content{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 10px 20px;
          transition: transform 0.6s cubic-bezier(0.4, 0, 1, 1);
          -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.4, 0, 1, 1);
          &.invitation-up{
            transform: translateY(-60px);
            -webkit-transform: translateY(-60px);
          }
          .content-inside{
            // backface-visibility:hidden;
            position: absolute;
            top: 10px;
            left: 10px;
            width: calc(100% - 20px);
            height: calc(100% - 20px);
            padding: 20px;
            border-radius: 2px;
            color: #a9895d;
            background-color: #FFF1DE;
            text-align: center;
            overflow: auto;
            .content-inside-photo{
              width: 100%;
              margin-bottom: 10px;
              padding: 5px;
              border: 1px solid #f7debb;
            }
            .name{
              a{
                color:#a9895d !important;
                // text-decoration: underline;
                font-style: oblique;
                border-bottom: 1px solid #a9895d;
              }
            }
            p{
              margin-top: 0;
              margin-bottom: 5px;
            }
            .content-inside-wish {
              display: flex;
              align-items: center;
              margin-top: 10px;
              .content-inside-input{
                flex: 1;                
                height: 30px;
                outline: none;
                border: none;
                border-bottom: 1px solid #f7debb;
                color: #a9895d;
                background: transparent;
                &::-webkit-input-placeholder { color: #E8D1B1;font-size: 12px; } /* not convert */ 
                &::-moz-placeholder { color: #E8D1B1;font-size: 12px; } /* not convert */ 
                &:-ms-input-placeholder { color: #E8D1B1;font-size: 12px; } /* not convert */ 
                &:-moz-placeholder { color: #E8D1B1;font-size: 12px; } /* not convert */ 
              }
              .content-inside-button {
                height: 30px;
                line-height: 30px;
                padding: 0 10px;
                margin-left: 10px;
                color: #a9895d;
                background: #f7debb;
                border-radius: 4px;
              }
            }
            
            .prev {
              position: absolute;
              left: 20px;
              bottom: 20px;
            }
            .next {
              position: absolute;
              right: 20px;
              bottom: 20px;
            }
          }
        }
        .cover-inside-left{
          position: absolute;
          left: 0;
          top: 0;
          width: 70%;
          height: 100%;
          border-radius: 10px;
          background-color: #f77269;
          box-shadow: 5px 0 10px rgba(0,0,0,0.2);
          z-index: 6;
          transition: transform 0.5s;
          -webkit-transition: -webkit-transform 0.5s;
          transform-origin: 0 50%;
          -webkit-transform-origin: 0 50%;
          &.opening{
            transform: rotate3d(0,1,0,-140deg);
            -webkit-transform: rotate3d(0,1,0,-140deg);
          }
          .cover-inside-left-title {
            position: absolute;
            right: 15px;
            top: 15px;
            width: 28px;
            padding: 5px 0;
            text-align: center;
            letter-spacing: 3px;
            font-family: serif;
            writing-mode: vertical-rl;
            color: #a9885d;
            background: #fff1de;
            border: 3px solid #ffd69b;
          }
        }
        .cover-inside-right{
          position: absolute;
          right: 0;
          top: 0;
          width: 40%;
          height: 100%;
          border-radius: 10px;
          background-color: #f77269;
          box-shadow: -5px 0 10px rgba(0,0,0,0.2);
          z-index: 5;
          transition: transform 0.5s;
          -webkit-transition: -webkit-transform 0.5s;
          transform-origin: 100% 50%;
          -webkit-transform-origin: 100% 50%;
          &.opening{
            transform: rotate3d(0,1,0,140deg);
            -webkit-transform: rotate3d(0,1,0,140deg);
          }
        }
        .cover-inside-seal{
          position: absolute;
          left: 70%;
          bottom: 100px;
          width: 80px;
          height: 80px;
          margin-left: -40px;
          z-index: 7;
          transform-origin: 50% 50%;
          -webkit-transform-origin: 50% 50%;
          transition: all 0.8s cubic-bezier(0.4, 0, 1, 1);
          -webkit-transition: all 0.8s cubic-bezier(0.4, 0, 1, 1);
          &.invitation-flight{
            opacity: 0;
          }
        }
      }
    }
  }
</style>
