<template>
  <div>
    <a-layout>
      <a-layout-header style="background: white;" />
      <a-layout-content style="background: white;">
        <a-row type="flex" justify="center" style="height: 80vh; margin-top: 60px;">
          <a-col :span="4">
            <a-steps
              size="default"
              :current="current"
              direction="vertical"
              style="height: 100px;"
            >
              <a-step
                v-for="item in steps"
                :key="item.title"
                :title="item.title"
                :description="item.description"
              />
            </a-steps>
          </a-col>
          <a-col :span="10">
            <div class="steps-content">
              <!-- {{ steps[current].content }} -->

              <div v-show="current === 1">
                <h1>Step 2</h1>
                <h3>Choose the Outstanding claims sheet at beginning of reporting period</h3>
                <p>Claims Outstanding at the begining of the reporting period needs to include the following column names</p>
                <ul>
                  <li>field 1 </li>
                  <li>field 2</li>
                  <li>field 3</li>
                  <li>field 4</li>
                </ul>

                <div>
                  <a-upload
                    :file-list="fileList"
                    list-type="picture"
                    :accept="excelFormats"
                    :remove="handleRemove"
                    :before-upload="beforeUpload"
                  >
                    <a-button v-show="fileList.length < 1">
                      <a-icon type="upload" /> Select {{ files[0] }} File
                    </a-button>
                  </a-upload>
                </div>
              </div>

              <div v-show="current === 2">
                <h1>Step 2</h1>
                <h3>Choose the paid claims sheet</h3>
                <p>These are the claims paid by the insurers during the reporting period. Required fields include</p>
                <ul>
                  <li>field 1 </li>
                  <li>field 2</li>
                  <li>field 3</li>
                  <li>field 4</li>
                </ul>

                <div>
                  <a-upload
                    :file-list="paidFileList"
                    list-type="picture"
                    :accept="excelFormats"
                    :remove="handleRemove"
                    :before-upload="beforeUpload"
                  >
                    <a-button v-show="paidFileList.length < 1">
                      <a-icon type="upload" /> Select {{ files[2] }} File
                    </a-button>
                  </a-upload>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer style="position: fixed; bottom: 0; width: 100%;">
        <div class="steps-action">
          <a-button v-if="current < steps.length - 1" type="primary" @click="next">
            Next
          </a-button>
          <a-button
            v-if="current == steps.length - 1"
            type="primary"
            @click="$message.success('Processing complete!')"
          >
            Done
          </a-button>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
            Previous
          </a-button>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script>
export default {
  data () {
    return {
      excelFormats: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
      fileList: [],
      current: 0,
      files: [
        'beginningEstimate',
        'intimated',
        'paid',
        'endEstimate'
      ],
      steps: [
        {
          title: 'Step 1',
          content: 'First-content'
        },
        {
          title: '',
          content: 'Second-content'
        },
        {
          title: '',
          content: 'Third-content'
        },
        {
          title: 'Select the Paid sheet',
          content: 'Second-content'
        },
        {
          title: 'Select the OS End sheet',
          content: 'Second-content'
        },
        {
          title: 'Generate Report',
          content: 'Last-content'
        }
      ]
    }
  },
  methods: {
    next () {
      this.current++
    },
    prev () {
      this.current--
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      this.fileList = [...this.fileList, file]

      // eslint-disable-next-line no-console
      console.log('file', file)

      return false
    }
  }
}
</script>
<style scoped>
.steps-content {
  margin-left: 50px;
  height: 80vh;
}

.steps-action {
  margin-top: 24px;
}
</style>
