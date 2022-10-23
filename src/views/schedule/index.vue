<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-refresh" @click="handleReload">
        {{ $t('schedule.reload') }}
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('schedule.id')" align="center" width="100">
        <template slot-scope="{ $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('schedule.name')" min-width="150">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('schedule.cron')" min-width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cron }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('schedule.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('button.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog class="cron-dialog" :title="$t('dialog.update')" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
      >
        <el-form-item :label="$t('schedule.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('schedule.cron')" prop="cron">
          <VueCronEditorBuefy
            v-model="temp.cron"
            :preserve-state-on-switch-to-advanced="true"
            :locale="'en'"
            :cron-syntax="'quartz'"
          />
          <span>{{ temp.cron }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('button.cancel') }}
        </el-button>
        <el-button type="primary" @click="updateData()">
          {{ $t('button.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
  .cron-dialog > .el-dialog {
    width: 70% !important;
  }
</style>

<script>
import { getSchedules, updateSchedule, reschedule } from '@/api/schedule'
import VueCronEditorBuefy from 'vue-cron-editor-buefy'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'ComplexTable',
  directives: { waves },
  components: {
    VueCronEditorBuefy
  },
  data() {
    return {
      list: null,
      listLoading: true,
      temp: {
        name: '',
        cron: ''
      },
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: this.$t('schedule.validate.name'), trigger: 'blur' }],
        cron: [{ required: true, message: this.$t('schedule.validate.cron'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.listLoading = true
        const response = await getSchedules()
        this.list = response.data
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.listLoading = false
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          await updateSchedule(tempData)
          const index = this.list.findIndex(v => v.id === this.temp.id)
          this.list.splice(index, 1, this.temp)
          this.dialogFormVisible = false
          this.$message.success({
            message: this.$t('message.success'),
            type: 'success',
            showClose: true
          })
        }
      })
    },
    handleReload() {
      reschedule().then(() => {
        this.$message.success({
          message: this.$t('message.success'),
          type: 'success',
          showClose: true
        })
      })
    }
  }
}
</script>
