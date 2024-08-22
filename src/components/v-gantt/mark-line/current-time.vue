<template>
  <mark-line
      :timeConfig="{ time: currentTime, color: 'rgba(255,0,0,.4)' }"
      :getPositionOffset="getPositionOffset"
  ></mark-line>
</template>

<script>
import dayjs from "dayjs";
import MarkLine from "./index.vue";
import emitter from 'tiny-emitter/instance'

export default {
  name: "CurrentTime",
  components: {MarkLine},
  props: {
    getPositionOffset: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      currentTime: dayjs().toString()
    };
  },
  created() {
    const timeNow = setInterval(() => {
      this.currentTime = dayjs().toString();
      emitter.emit("updateCurrentTime", dayjs());
    }, 1000);
    emitter.once("hook:beforeDestroy", () => {
      clearInterval(timeNow);
    });
  }
};
</script>
