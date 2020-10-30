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
                v-for="(item, index) in steps"
                :key="index"
                :status="item.status"
                :title="item.title"
                :description="item.description"
              />
            </a-steps>
          </a-col>
          <a-col :span="10">
            <div class="steps-content">
              <div v-if="steps[current].valid !== null && steps[current].valid">
                <a-result
                  status="success"
                  title="Successfully Purchased Cloud Server ECS!"
                  sub-title="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                />
                <div class="" :style="{display: 'flex', justifyContent: 'center'}">
                  <a-button
                    v-if="current > 0"
                    key="console"
                    size="large"
                    style="margin-left: 8px"
                    @click="prev"
                  >
                    <a-icon type="left" />
                    Go Back
                  </a-button>
                  <a-button
                    v-if="current < steps.length - 1"
                    key="buy"
                    style="margin-left: 30px"
                    size="large"
                    type="primary"
                    @click="next"
                  >
                    Next
                    <a-icon type="right" />
                  </a-button>
                </div>
              </div>
              <div v-if="steps[current].valid !== null && !steps[current].valid">
                <div class="">
                  <a-result
                    status="error"
                    title="File check Failed"
                    sub-title="Please check and modify the following information before resubmitting."
                  >
                    <div class="desc">
                      <p style="font-size: 16px;">
                        <strong>The file you submitted has the following errors:</strong>
                      </p>
                      <p>
                        <a-icon :style="{ color: 'red' }" type="close-circle" /> Your account has been frozen
                        <a>Thaw immediately &gt;</a>
                      </p>
                      <p>
                        <a-icon :style="{ color: 'red' }" type="close-circle" /> Your account is not yet eligible to
                        apply <a>Apply Unlock &gt;</a>
                      </p>
                    </div>
                  </a-result>
                  <div class="" :style="{display: 'flex', justifyContent: 'center'}">
                    <a-button
                      v-if="current > 0"
                      key="console"
                      size="large"
                      style="margin-left: 8px"
                      @click="steps[current].valid = null"
                    >
                      okay got it
                      <a-icon type="like" />
                    </a-button>
                  </div>
                </div>
              </div>
              <div
                v-for="(name, index) in fileNames"
                :key="index"
              >
                <div v-show="current === Object.keys(fileNames).indexOf(index) + 1">
                  <a-spin :delay="500" tip="Loading..." :spinning="steps[current].validating">
                    <div v-show="steps[current].valid === null" class="spin-content">
                      <div>
                        <h1>Step {{ Object.keys(fileNames).indexOf(index) + 2 }}</h1>
                        <div class="ant-result-content">
                          <h3>Choose the Outstanding claims sheet at beginning of reporting period</h3>
                          <p>Claims Outstanding at the begining of the reporting period needs to include the following column names</p>
                          <ul>
                            <li>field 1 </li>
                            <li>field 2</li>
                            <li>field 3</li>
                            <li>field 4</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div style="margin-top: 45px">
                      <div v-if="steps[current].valid === null">
                        <div>
                          <FileSelect v-model="fileNames[index]" @input="validateInput" />
                          <span v-show="fileNames[index].name">
                            <a-icon type="file-excel" />
                            {{ fileNames[index].name }}
                          </span>

                          <a-button type="primary" :disabled="!fileNames[index].name" @click="handleValidateClick(steps[current])">
                            validate file
                          </a-button>
                        </div>
                      </div>
                    </div>
                  </a-spin>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer
        v-show="current === Object.keys(fileNames).indexOf(index) + 1"
        style="position: fixed; bottom: 0; width: 100%;"
      >
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
      current: 0,
      fileList: [],
      file: null,
      fileNames: {
        beginningEstimate: { file: null },
        intimated: { file: null },
        paid: { file: null },
        endEstimate: { file: null }
      },
      steps: [
        {
          title: 'Step 1',
          content: 'First-content',
          validating: false,
          valid: null
        },
        {
          title: '',
          content: 'Second-content',
          validating: false,
          valid: null
        },
        {
          title: '',
          content: 'Third-content',
          validating: false,
          valid: null
        },
        {
          title: 'Select the Paid sheet',
          content: 'Second-content',
          validating: null
        },
        {
          title: 'Select the OS End sheet',
          content: 'Second-content',
          validating: null
        },
        {
          title: 'Generate Report',
          content: 'Last-content',
          validating: null
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
    validateInput (e) {
      // eslint-disable-next-line no-console
      console.log('e', e)

      // eslint-disable-next-line no-console
      console.log('filelist before', this.fileList)
      this.fileList.push(e)

      // eslint-disable-next-line no-console
      console.log('filelist after', this.fileList)
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    async handleValidateClick (step) {
      step.validating = true

      try {
        const response = await this.delay(4000)
        // eslint-disable-next-line no-console
        console.log(response)

        step.valid = false
        step.valid ? step.status = 'success' : step.status = 'error'
        step.validating = false
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
        step.validating = false
      }
    },
    delay (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
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
