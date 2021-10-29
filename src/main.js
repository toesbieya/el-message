const ProgressBar = {
  name: 'ElMessageProgressBar',

  props: {
    // 进度条时长，单位毫秒，为空或0时不渲染进度条
    timeout: Number,
    // 是否正在执行动画
    isRunning: Boolean
  },

  computed: {
    style() {
      return {
        animationDuration: `${this.timeout}ms`,
        animationPlayState: this.isRunning ? 'running' : 'paused'
      }
    }
  },

  methods: {
    onAnimationEnded() {
      this.$emit('end')
    }
  },

  render(h) {
    return h(
      'div',
      {
        staticClass: 'el-message__progress',
        style: this.style,
        on: {
          animationend: this.onAnimationEnded
        }
      }
    )
  }
}

export default {
  name: 'ElMessage',

  data() {
    return {
      visible: false,
      duration: 3000,
      isProgressRunning: true,
      iconClass: null,
      onClose: null
    }
  },

  computed: {
    messageClass() {
      return [
        'el-message',
        this.type && !this.iconClass ? `el-message--${this.type}` : '',
        this.center ? 'is-center' : '',
        this.showClose ? 'is-closable' : '',
        this.customClass
      ]
    },
    positionStyle() {
      return {
        'top': `${this.verticalOffset}px`
      }
    }
  },

  methods: {
    // 过渡动画结束后销毁本组件实例
    handleAfterLeave() {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    close() {
      this.closed = true
      typeof this.onClose === 'function' && this.onClose(this)
    },
    onMouseenter() {
      this.isProgressRunning = true
    },
    onMouseleave() {
      this.isProgressRunning = false
    },

    renderTransition(h, children) {
      return h(
        'transition',
        {
          props: {
            name: 'el-message-fade'
          },
          on: {
            afterLeave: this.handleAfterLeave
          }
        },
        children
      )
    },
    renderMessage(h) {
      return h(
        'div',
        {
          directives: [{
            name: 'show',
            rawName: 'v-show',
            value: this.visible,
            expression: 'show'
          }],
          class: this.messageClass,
          style: this.positionStyle,
          on: {
            mouseenter: this.onMouseenter,
            mouseleave: this.onMouseleave
          }
        }
      )
    },
    renderTypeIcon(h) {
      const className = this.iconClass || `el-message__icon el-icon-${this.type}`
      return h('i', { class: className })
    },
    renderProgressBar(h) {
      return h(
        ProgressBar,
        {
          props: {
            timeout: this.duration,
            isRunning: this.isProgressRunning
          }
        }
      )
    }

  },

  render(h) {
    return this.renderTransition(h, [this.renderMessage])
  }
}
