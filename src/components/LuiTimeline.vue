<script>
export default {
  name: "LuiCanvas",
  props: {
    el: {
      type: String,
      default: "lui-canvas",
    },
    timelineDuration: {
      type: Number,
      default: null,
    },
    lineWidth: {
      type: Number,
      default: null,
    },
    shortLineColor: {
      type: String,
      default: "green",
    },
    longLineColor: {
      type: String,
      default: "red",
    },
    textFillColor: {
      type: String,
      default: "indianred",
    },
    offsetLeft: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
  },
  mounted() {
    this.startTime = 0;
    if (this.$refs[this.el]) {
      // this.width = window.innerWidth * 6; // Watcher created Canvas.
      if (
        this.timelineDuration !== null &&
        this.timelineDuration <= this.width
      ) {
        this.width = this.timelineDuration;
      } else {
        this.width = 6000;
      }
      this.reRenderX = 2000;
      this.createCanvas();
    }
    // window.addEventListener("resize", (e) => this.resize(e)); Resize event ?????
    document.addEventListener("mouseup", () => this.mouseUp());
    document.addEventListener("mousemove", (e) => this.mouseMove(e));
  },
  beforeUnmount() {
    document.removeEventListener("mouseup", null);
    document.removeEventListener("mousemove", null);
    this.canvas.removeEventListener("mousedown", null);
  },
  data() {
    return {
      canvas: null,
      width: 6000,
      ctx: null,
      reRenderX: null,
      elmLeft: null,
      diffX: null,
      newElmLeft: null,
      isMouseDown: false,
      startTime: null,
      renderedSize: null,
      timelinePosition: null,
      timelineProgression: null,
    };
  },
  watch: {
    // width(to, from) {
    //   if (to > 6000) {
    //     this.width = 6000;
    //   }
    //   this.reRenderX = 2000;
    //   if (to !== from) {
    //     this.createCanvas();
    //   }
    // },
    timelinePosition(to) {
      this.$emit("timelinePosition", to);
    },
  },
  computed: {
    computedStyles() {
      const styles = {
        left: this.toPx(this.offsetLeft),
      };
      return styles;
    },
  },
  methods: {
    createCanvas() {
      this.canvas = this.$refs[this.el];
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.drawLineToCanvas();
      this.fillTextToCanvas(this.startTime);
      this.renderedSize = this.width;
    },
    // resize(e) {
    //   this.width = e.target.innerWidth * 6;
    // },
    drawLineToCanvas() {
      for (let index = 0; index <= this.width; index++) {
        if (index % 100 === 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(index, 100);
          this.ctx.lineTo(index, 70);
          this.ctx.strokeStyle = this.longLineColor;
          this.ctx.stroke();
        }
        if (index % 50 === 0 && index % 100 !== 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(index, 100);
          this.ctx.lineTo(index, 80);
          this.ctx.strokeStyle = this.shortLineColor;
          this.ctx.stroke();
        }
        if (index % 25 === 0 && index % 50 !== 0 && index % 100 !== 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(index, 100);
          this.ctx.lineTo(index, 90);
          this.ctx.strokeStyle = this.shortLineColor;
          this.ctx.stroke();
        }
      }
    },
    fillTextToCanvas(startTime) {
      // const duration = this.config.timelineDuration || startTime + 1;
      this.ctx.clearRect(0, 0, this.width, 51);
      this.ctx.beginPath();

      for (let index = 0; index <= this.width; index++) {
        if (index % 100 === 0) {
          this.ctx.font = "12px Arial";
          // this.ctx.fillStyle = this.textFillColor;
          this.ctx.strokeStyle = this.textFillColor;

          this.ctx.strokeText(index + startTime, index, 50);
        }
      }
    },
    mouseDown(e) {
      let mouseX = e.clientX;
      this.isMouseDown = true;
      this.elmLeft = this.ctx.canvas.offsetLeft;
      this.diffX = mouseX - this.elmLeft;
    },
    mouseMove(e) {
      if (e.movementX != 0) {
        if (!this.isMouseDown) {
          return;
        }
        let newMouseX = e.clientX;
        this.newElmLeft = newMouseX - this.diffX;
        if (this.newElmLeft < this.offsetLeft - this.width) {
          this.newElmLeft = this.offsetLeft - this.width;
        }
        if (this.newElmLeft > this.offsetLeft) {
          this.newElmLeft = this.offsetLeft;
        }
        if (Math.abs(this.newElmLeft) > this.offsetLeft + this.width) {
          this.newElmLeft = this.offsetLeft + this.width * -1;
        }
        // this.timelineProgression += Math.abs(this.newElmLeft - this.offsetLeft);
        console.log(this.timelineProgression);
        this.alignTimeline();
        this.timelinePosition = Math.abs(this.newElmLeft - this.offsetLeft);
      }
    },
    mouseUp() {
      this.isMouseDown = false;

      if (
        this.timelineDuration === null ||
        this.width < this.timelineDuration
      ) {
        if (
          this.width - this.timelinePosition <= this.reRenderX &&
          this.timelineDuration != this.renderedSize
        ) {
          console.log("Right rerender");
          if (
            this.timelineDuration != null &&
            this.renderedSize + this.reRenderX > this.timelineDuration
          ) {
            //Bug fix
            this.startTime = this.timelineDuration - this.width;
            let rX = this.timelineDuration - this.renderedSize;
            this.fillTextToCanvas(this.startTime);
            this.renderedSize = this.timelineDuration;
            // console.log(rX, "T");
            this.newElmLeft = this.newElmLeft + rX;
          } else {
            this.startTime += this.reRenderX;
            this.renderedSize += this.reRenderX;
            this.fillTextToCanvas(this.startTime);
            this.newElmLeft = this.newElmLeft + this.reRenderX;
            this.alignTimeline();
          }
        }
      } else if (
        this.timelineDuration === null &&
        this.width - this.timelinePosition <= this.reRenderX
      ) {
        this.startTime += this.reRenderX;
        this.renderedSize += this.reRenderX;
        this.fillTextToCanvas(this.startTime);
        this.newElmLeft = this.newElmLeft + this.reRenderX;
        this.alignTimeline();
      }
      if (
        this.startTime - this.reRenderX >= 0 &&
        this.timelinePosition <= this.reRenderX
      ) {
        console.log("Left rerender", this.startTime);
        this.startTime -= this.reRenderX;
        this.renderedSize -= this.reRenderX;
        this.fillTextToCanvas(this.startTime);
        this.newElmLeft = this.newElmLeft - this.reRenderX;
        this.alignTimeline(this.newElmLeft);
      }
      // console.log({
      //   rX: this.reRenderX,
      //   rS: this.renderedSize,
      //   tP: this.timelinePosition,
      //   tD: this.timelineDuration,
      //   sT: this.startTime,
      //   nE: this.newElmLeft,
      // });
    },
    alignTimeline() {
      this.ctx.canvas.style.left = this.toPx(this.newElmLeft);
    },
    toPx(val) {
      return `${val}px`;
    },
  },
};
</script>
<template>
  <canvas
    :id="el"
    :ref="el"
    @mousedown="mouseDown($event)"
    class="lui-canvas"
    width="300"
    height="100"
    :style="computedStyles"
  ></canvas>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.lui-canvas {
  border: 1px salmon solid;
  position: absolute;
  z-index: 1000;
  object-fit: contain;
  scroll-behavior: smooth;
  cursor: pointer;
  overflow: hidden;
}
</style>
