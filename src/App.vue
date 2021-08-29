<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div style="overflow: hidden; position: absolute; width: 100%; height: 100%">
    <LuiTimeline @timeline-position="position($event)" />
    <!-- <LuiTimeline
      :el="config.el"
      :timelineDuration="config.timelineDuration"
      :lineWidth="config.lineWidth"
      :shortLineColor="config.shortLineColor"
      :longLineColor="config.longLineColor"
      :textFillColor="config.textFillColor"
      :offsetLeft="config.offsetLeft"
      :height="config.height"
    /> -->
  </div>
</template>

<script>
import LuiTimeline from "./components/LuiTimeline.vue";

export default {
  name: "App",
  components: {
    LuiTimeline,
  },
  data() {
    return {
      config: {
        el: "lui-timeline",
        timelineDuration: null,
        lineWidth: null,
        shortLineColor: null,
        longLineColor: null,
        textFillColor: null,
        offsetLeft: null,
        height: null,
      },
    };
  },
  methods: {
    position(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
