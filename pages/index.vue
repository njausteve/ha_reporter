<template>
  <div>
    <a-layout id="components-layout-demo-fixed">
      <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
        <div :style="{ background: '#fff', padding: '24px', minHeight: '380px' }">
          <div class="container">
            <a-upload-dragger
              name="file"
              :accept="FileTypeToUpload"
              :multiple="false"
              action="api/upload"
              @change="handleChange"
            >
              <div class="" :style="{padding: '10px 40px 30px'}">
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">
                  Click or drag excel template file to this area to upload
                </p>
                <p class="ant-upload-hint">
                  You can only upload excel files
                </p>
              </div>
            </a-upload-dragger>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      FileTypeToUpload: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
    }
  },
  methods: {
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        // eslint-disable-next-line
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
