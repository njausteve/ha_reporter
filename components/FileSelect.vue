<template>
  <label class="file-select" style="display: flex;">
    <div class="select-button ant-btn ant-btn-primary">
      <a-icon type="file-excel" />
      <span v-if="value"> Select file</span>
      <span v-else>Select File</span>
    </div>
    <input
      type="file"
      style="verticle-align: middle;"
      :accept="excelFormats"
      @change="handleFileChange"
    >
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default () {
        return {
          file: null
        }
      }
    }
  },
  data () {
    return {
      excelFormats: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
    }
  },
  methods: {
    handleFileChange (e) {
      this.$emit('input', e.target.files[0])
    }
  }
}
</script>

<style scoped>
.file-select > input[type="file"] {
  display: none;
}
</style>
