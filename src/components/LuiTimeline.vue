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
    setPosition: {
      type: Number,
      default: null,
    },
  },
  mounted() {
    this.startTime = 0;
    if (this.$refs[this.el]) {
      if (
        this.computedDuration !== null &&
        this.computedDuration <= this.width
      ) {
        this.width = this.computedDuration;
      } else {
        this.width = 6000;
      }
      this.reRenderX = 2000;
      this.createCanvas();
    }
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
    timelinePosition(to) {
      this.$emit("timelinePosition", to);
    },
    timelineProgression(to) {
      this.$emit("timelineProgression", to);
    },
    setPosition(to) {
      console.log(to, "second");
      this.newElmLeft = to * 100 * -1;
      this.alignTimeline();
    },
  },
  computed: {
    computedStyles() {
      const styles = {
        left: this.toPx(this.offsetLeft),
      };
      return styles;
    },
    computedDuration() {
      return this.timelineDuration === null
        ? null
        : this.timelineDuration * 100;
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
      this.ctx.clearRect(0, 0, this.width, 51);
      this.ctx.beginPath();
      for (let index = 0; index <= this.width; index++) {
        if (index % 100 === 0) {
          this.ctx.font = "12px Arial";
          // this.ctx.fillStyle = this.textFillColor;
          this.ctx.fillStyle = this.textFillColor;
          let txt = (index + startTime) * 10;
          this.ctx.fillText(
            `${new Date(txt).toISOString().substr(11, 8)}`,
            index,
            50
          );
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
        this.alignTimeline();
        this.timelinePosition = Math.abs(this.newElmLeft - this.offsetLeft);
        this.timelineProgression -= e.movementX;
      }
    },
    mouseUp() {
      this.isMouseDown = false;

      if (
        this.computedDuration === null ||
        this.width < this.computedDuration
      ) {
        if (
          this.width - this.timelinePosition <= this.reRenderX &&
          this.computedDuration != this.renderedSize
        ) {
          console.log("Right rerender");
          if (
            this.computedDuration != null &&
            this.renderedSize + this.reRenderX > this.computedDuration
          ) {
            //Bug fix
            this.startTime = this.computedDuration - this.width;
            let rX = this.computedDuration - this.renderedSize;
            this.reRenderX = rX;
            this.fillTextToCanvas(this.startTime);
            this.drawLineToCanvas();
            this.renderedSize = this.computedDuration;
            // console.log(rX, "T");
            this.newElmLeft = this.newElmLeft + this.reRenderX;
          } else {
            this.startTime += this.reRenderX;
            this.renderedSize += this.reRenderX;
            this.fillTextToCanvas(this.startTime);
            this.newElmLeft = this.newElmLeft + this.reRenderX;
            this.alignTimeline();
          }
        }
      } else if (
        this.computedDuration === null &&
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
        this.reRenderX = 2000;
      }
    },
    alignTimeline() {
      console.log("Çalıştı.", this.newElmLeft);
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
