import { defineCustomElement } from 'vue'
import TimeLineComponent from './LuiTimeline.ce.vue'
console.log(TimeLineComponent, 'test')
// convert into custom element constructor
const LuiTimeline = defineCustomElement(TimeLineComponent)
// register
customElements.define('lui-timeline', LuiTimeline)

console.log(TimeLineComponent.styles) // ["/* inlined css */"]
