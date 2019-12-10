<template>
    <Editor/>
</template>

<script>
  import Editor from "./components/Editor.vue"

  export default {
    props: [],
    components: {
      Editor
    },
    name: 'Wedding'
  }

</script>

<style lang="less">
@import './assets/base.less';
html,
body{
  height: 100%;
  background-color: #151534;
}
</style>
