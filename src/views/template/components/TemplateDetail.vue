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
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import { createTemplate, getTemplate, updateTemplate } from '@/api/template'

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
      tempRoute: {}
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
        this.postForm = response.data
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
          await createTemplate(this.postForm)
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
</style>
