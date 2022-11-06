<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <router-link :to="'/template'" class="link-type">
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
          >
            {{ $t('button.cancel') }}
          </el-button>
        </router-link>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" :disabled="loading" @click="submitForm">
          {{ this.$t('button.confirm') }}
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item :label="$t('template.name')" prop="name">
          <el-input v-model="postForm.name" />
        </el-form-item>
        <el-form-item :label="$t('template.subject')" prop="subject">
          <el-input v-model="postForm.subject" />
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" :upload-u-r-l="uploadURL" />
        </el-form-item>
        <el-form-item :label="$t('template.attachment.title')">
          <div>
            <input ref="file-upload" class="file-upload" type="file" @change="handleClick">
            <div class="drop" @dragenter="handleDragover" @dragover="handleDragover" @drop="handleDrop">
              <el-button :loading="loading" size="mini" style="margin-left:16px;" type="primary" @click="handleUpload">
                {{ $t('upload.clickUpload') }}
              </el-button>
            </div>
            <el-table
              v-loading="loading"
              :data="listFile"
              border
              fit
              highlight-current-row
              style="margin-top: 10px; width: 100%;"
            >
              <el-table-column :label="$t('template.attachment.no')" align="center" width="200">
                <template slot-scope="{ $index}">
                  <span>{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('template.attachment.name')" align="center" min-width="150">
                <template slot-scope="{row}">
                  <span v-if="row.isNew">{{ row.originName }}</span>
                  <a v-else :href="row.url" class="link-type" target="_blank">{{ row.originName }}</a>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('template.attachment.actions')"
                align="center"
                class-name="small-padding fixed-width"
                width="250"
              >
                <template slot-scope="{row,$index}">
                  <el-button size="mini" type="danger" @click="handleDeleteFile(row, $index)">
                    {{ $t('button.delete') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import { addTemplateFile, createTemplate, deleteTemplateFile, getTemplate, updateTemplate } from '@/api/template'

const defaultForm = {
  name: '',
  subject: '',
  content: ''
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadURL: process.env.VUE_APP_UPLOAD_FILE_URL || 'https://httpbin.org/post',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        name: [{ required: true, message: this.$t('template.validate.name'), trigger: 'blur' }],
        subject: [{ required: true, message: this.$t('template.validate.subject'), trigger: 'blur' }],
        content: [{ required: true, message: this.$t('template.validate.content'), trigger: 'blur' }]
      },
      tempRoute: {},
      listFile: [] // attachments
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      getTemplate(id).then(response => {
        const { files, ...data } = response.data
        this.postForm = data
        this.listFile = files || []
        // set tagsview title
        this.setTagsViewTitle()
        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.$t('route.editTemplate')
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = this.$t('route.editTemplate')
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      if (this.isEdit) {
        this.updateData()
      } else {
        this.createData()
      }
    },
    createData() {
      this.$refs['postForm'].validate(async(valid) => {
        if (valid) {
          this.loading = true
          // lấy file ra và upload lên server
          const files = this.listFile.filter(item => item.isNew)
          const formData = new FormData()
          formData.append('data', JSON.stringify(this.postForm))
          files.forEach(file => {
            formData.append('files', file.rawFile)
          })
          await createTemplate(formData)
          this.$message.success({
            message: this.$t('message.success'),
            type: 'success',
            showClose: true
          })
          this.loading = false
        }
      })
    },
    updateData() {
      this.$refs['postForm'].validate(async(valid) => {
        if (valid) {
          this.loading = true
          const tempData = Object.assign({}, this.postForm)
          await updateTemplate(tempData)
          this.$message.success({
            message: this.$t('message.success'),
            type: 'success',
            showClose: true
          })
          this.loading = false
        }
      })
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['file-upload'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    async upload(rawFile) {
      this.loading = true
      if (!this.isEdit) {
        // new thì chỉ cần lưu vào listFile
        this.listFile.push({
          isNew: true,
          originName: rawFile.name,
          rawFile
        })
        this.loading = false
        return
      }
      // edit thì upload file lên server và cập nhật vào listFile
      try {
        const formData = new FormData()
        formData.append('file', rawFile)
        const { data } = await addTemplateFile(this.postForm.id, formData)
        this.listFile = data.files
        this.$message.success({
          message: this.$t('message.success'),
          type: 'success',
          showClose: true
        })
      } catch (err) {
        this.$message.error({
          message: this.$t('message.error'),
          type: 'error',
          showClose: true
        })
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    handleDeleteFile(row, index) {
      this.$confirm(this.$t('template.attachment.delete'), this.$t('message.confirm'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(async() => {
        if (this.isEdit) {
          // edit thì xóa file trên server
          try {
            await deleteTemplateFile(this.postForm.id, row.name)
            this.listFile.splice(index, 1)
            this.$message.success({
              message: this.$t('message.success'),
              type: 'success',
              showClose: true
            })
          } catch (err) {
            this.$message.error({
              message: this.$t('message.error'),
              type: 'error',
              showClose: true
            })
            console.log(err)
          }
        } else {
          // new thì xóa file trong listFile
          this.listFile.splice(index, 1)
        }
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 20px 45px 20px 40px;
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.file-upload {
  display: none;
  z-index: -9999;
}

.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
