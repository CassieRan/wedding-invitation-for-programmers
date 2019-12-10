<template>
  <div class="wedding-editor" ref="editor">
    <header class="editor-header">
        <a href="javascript:;"></a>
        <a href="javascript:;" class="minimum"></a>
        <a href="javascript:;" class="maximum"></a>
    </header>
    <!-- 日期 -->
    <p class="code">Last login: <span>{{ startDate }}</span> on ttys001</p>
    <!--代码编辑区-->
    <pre>
      <code v-html="highlightedCode"></code>
    </pre>
    <Executions :canExecute="canExecute" @onUpdating="scrollToBottom" @onFinish="canClickOpen = canOpen = true;"/>
    <invitation :canOpen="canOpen" @sendBarrage="onAfterSending" @close="canOpen = false"/>
    <Barrage :canStart="canStart" :wish="wish"/>
    <div class="open-button" @click="canOpen = true" v-show="canOpen != true && canClickOpen"></div>
  </div>
</template>

<script>
  import Prism from 'prismjs'
  import 'prismjs/themes/prism-okaidia.css'
  import '../utils/raf'
  import data from '../mock/data'

  import Executions from './Executions'
  import Invitation from './Invitation'
  import Barrage from './Barrage'

  export default {
    name: 'Editor',
    components: { Executions, Invitation, Barrage },
    data() {
      return {
        startDate: '',
        code: data.code,
        currentCode: '',
        isCursorVisible: 1,
        canExecute: false,
        canOpen: false,
        wish: '',
        canStart: false,
        canClickOpen: process.env.NODE_ENV === 'development'?true:false
      }
    },
    async created() {
      this.startDate = (new Date()).toDateString()
      await this.progressivelyTyping()
    },
    updated() {
      this.scrollToBottom()
    },
    computed: {
      highlightedCode () {
        const code = Prism.highlight(
            this.currentCode,
            Prism.languages.javascript
          )
        const codeWithCursor = `${code}<span style="opacity:${this.isCursorVisible}"> ▍</span>`
        return codeWithCursor
      }
    },
    methods: {
      scrollToBottom() {
        // 保持页面一直滚到最下面
        this.$refs.editor.scrollTop = this.$refs.editor.scrollHeight
      },
      // 代码输入
      progressivelyTyping() {
        return new Promise((resolve) => {
          let count = 0, typingCount = 0, typing
          // 写代码每一帧的函数
          let step = () => {
            let randomNumber = Math.round(Math.random() * 6)
            // 摸你打字的随机速度
            if(count % 2 === 0 && randomNumber % 4 === 0){
              this.currentCode = this.code.substring(0, typingCount)
              typingCount++
            }
            // 大约每 24 帧光标闪动一次
            if(count % 24 === 0){
              this.isCursorVisible = this.isCursorVisible === 0 ? 1 : 0
            }
            count++
            if (typingCount <= this.code.length) {
              typing = requestAnimationFrame(step)
            } else {
              resolve()
              this.canExecute = true
              cancelAnimationFrame(typing)
            }
          }
          typing = requestAnimationFrame(step)
        })
      },
      // 发送弹幕之后
      onAfterSending(wish) {
        if(!wish) this.canOpen = false
        this.wish=wish
        setTimeout(() => {
          this.canStart = true
        }, 800)
      }
    }
  }
</script>

<style lang="less">
.wedding-editor{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 15px;
  padding-top: 50px;
  background: #151534;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
  transform-origin: 0 0;
  -webkit-transform-origin: 0 0;
  transition: all 1.6s cubic-bezier(0.4, 0, 1, 1);
  -webkit-transition: all 1.6s cubic-bezier(0.4, 0, 1, 1);
  .editor-header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 12px;
    overflow: hidden;
    z-index: 3;
    background-color: #151534;
    >a{
      float: left;
      display: block;
      width: 16px;
      height: 16px;
      margin-right: 5px;
      border-radius: 8px;
      background: #FC615D;
      &.minimum{
        background: #FDBC40;
      }
      &.maximum{
        background: #34C84A;
      }
    }
  }
  p.code{
    margin: 0;
    color: #BBB;
    line-height: 1.2;
    font-family: 'Roboto Mono', 'Menlo', 'Monaco', Courier, monospace !important;
    font-weight: 500 !important;
    font-size: 16px!important; /* not convert */ 
  }
  pre{
    margin: 0;
    white-space: pre-wrap;
    code{
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 16px!important; /* not convert */ 
      margin: 0;
      color: #BBB;
      line-height: 1.2;
      font-family: 'Roboto Mono', 'Menlo', 'Monaco', Courier, monospace !important;
      font-weight: 500 !important;
      background: transparent;
    }
  }
  // .open-button {
  //   box-sizing: border-box;
  //   animation: shine 2s ease infinite;
  //   position: fixed;
  //   right: 25px;
  //   bottom: 25px;
  //   width: 30px;
  //   height: 30px;
  //   border-radius: 50%;
  //   border: 5px solid #ffd69b;
  //   color: #a9895d;
  //   background: #FFF1DE;
  //   z-index: 1000;
  // }
  .open-button {
    z-index: 1000;
    position: fixed;
    right: 25px; /* not convert */ 
    bottom: 25px; /* not convert */ 
    width: 44px; /* not convert */ 
    height: 44px; /* not convert */ 
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
    background: #a9895d;
    overflow: hidden;
    animation-timing-function: ease-in-out;
    animation-name: breathe;
    animation-duration: 1500ms;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

@keyframes breathe {
    0% {
        opacity: .4;
        box-shadow: 0 0 2px #FFF1DE, 0 0 1px #FFF1DE inset; /* not convert */ 
    }

    100% {
        opacity: 1;
        box-shadow: 0 0 10px #FFF1DE, 0 0 10px #FFF1DE inset; /* not convert */ 
    }
}
}
</style>