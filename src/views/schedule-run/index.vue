<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        :placeholder="$t('scheduleRun.search')"
        style="width: 500px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('button.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('button.add') }}
      </el-button>
      <el-button class="filter-item" icon="el-icon-refresh" type="success" @click="handleReload">
        {{ $t('schedule.reload') }}
      </el-button>
      <!--      <el-button-->
      <!--        v-waves-->
      <!--        :loading="downloadLoading"-->
      <!--        class="filter-item"-->
      <!--        type="primary"-->
      <!--        icon="el-icon-download"-->
      <!--        @click="handleDownload"-->
      <!--      >-->
      <!--        {{ $t('button.export') }}-->
      <!--      </el-button>-->
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('scheduleRun.id')" align="center" width="70">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.email')" min-width="120" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="showEmail(row)">{{ row.email.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.emailTos')" min-width="220" align="center">
        <template slot-scope="{row}">
          <span>{{ row.emailTos }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.proxy')" min-width="120" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="showProxy(row)">{{ row.proxy.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.schedule')" min-width="150" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="showSchedule(row)">{{ row.schedule.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.template')" min-width="100" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="showTemplate(row)">{{ row.template.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.enable')" min-width="80" align="center">
        <template slot-scope="{row}">
          <el-tag
            size="medium"
            :type="row.enable ? 'success' : 'danger'"
          >{{ $t('scheduleRun.status.' + row.enable) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.enable" size="mini" type="warning" @click="handleModifyStatus(row)">
            {{ $t('scheduleRun.status.false') }}
          </el-button>
          <el-button v-else size="mini" type="success" @click="handleModifyStatus(row)">
            {{ $t('scheduleRun.status.true') }}
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('button.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('button.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <el-dialog :title="$t('dialog.' + dialogStatus)" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item :label="$t('scheduleRun.email')" prop="email">
          <el-select v-model="temp.email" style="width: 100%" filterable>
            <el-option
              v-for="item in emails"
              :key="item.email"
              :label="item.email"
              :value="item.email"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('scheduleRun.emailTos')" prop="emailTos">
          <el-input v-model="temp.emailTos" style="width: 100%" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('scheduleRun.schedule')" prop="scheduleId">
          <el-select v-model="temp.scheduleId" style="width: 100%" filterable>
            <el-option
              v-for="item in schedules"
              :key="item.id"
              :label="`${item.id} - ${item.name}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('scheduleRun.template')" prop="templateId">
          <el-select v-model="temp.templateId" style="width: 100%" filterable>
            <el-option
              v-for="item in templates"
              :key="item.id"
              :label="`${item.id} - ${item.name}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('button.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('button.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('scheduleRun.email')" :visible.sync="dialogEmailVisible">
      <el-form
        :model="temp"
        label-position="left"
        label-width="150px"
        style="margin-left:50px;"
        disabled
      >
        <el-form-item :label="$t('email.emailName')" prop="emailName">
          <el-input v-model="temp.emailName" />
        </el-form-item>
        <el-form-item :label="$t('email.email')" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item :label="$t('email.password')" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEmailVisible = false">
          {{ $t('button.close') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('scheduleRun.proxy')" :visible.sync="dialogProxyVisible">
      <el-form
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
        disabled
      >
        <el-form-item :label="$t('proxy.id')" prop="proxyId">
          <el-input v-model="temp.proxyId" />
        </el-form-item>
        <el-form-item :label="$t('proxy.name')" prop="proxyName">
          <el-input v-model="temp.proxyName" />
        </el-form-item>
        <el-form-item :label="$t('proxy.host')" prop="proxyHost">
          <el-input v-model="temp.proxyHost" />
        </el-form-item>
        <el-form-item :label="$t('proxy.port')" prop="proxyPort">
          <el-input v-model="temp.proxyPort" />
        </el-form-item>
        <el-form-item :label="$t('proxy.username')" prop="proxyUsername">
          <el-input v-model="temp.proxyUsername" />
        </el-form-item>
        <el-form-item :label="$t('proxy.password')" prop="proxyPassword">
          <el-input v-model="temp.proxyPassword" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogProxyVisible = false">
          {{ $t('button.close') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('scheduleRun.schedule')" :visible.sync="dialogScheduleVisible">
      <el-form
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
        disabled
      >
        <el-form-item :label="$t('schedule.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('schedule.cron')" prop="cron">
          <el-input v-model="temp.cron" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogScheduleVisible = false">
          {{ $t('button.close') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('scheduleRun.template')" :visible.sync="dialogTemplateVisible">
      <el-form
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
        disabled
      >
        <el-form-item :label="$t('template.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('template.subject')" prop="subject">
          <el-input v-model="temp.subject" />
        </el-form-item>
        <el-form-item :label="$t('template.content')" prop="content">
          <el-input v-html="temp.content" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTemplateVisible = false">
          {{ $t('button.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createScheduleRun,
  deleteScheduleRun,
  disableScheduleRun,
  enableScheduleRun,
  getAllScheduleRun,
  updateScheduleRun
} from '@/api/schedule-run'
import { getAllEmails } from '@/api/email'
import { getSchedules, reschedule } from '@/api/schedule'
import { getAllTemplates } from '@/api/template'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        search: undefined
      },
      emails: [],
      schedules: [],
      templates: [],
      temp: {
        id: null,
        email: null,
        emailTos: null,
        scheduleId: null,
        templateId: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      dialogEmailVisible: false,
      dialogProxyVisible: false,
      dialogTemplateVisible: false,
      dialogScheduleVisible: false,
      rules: {
        email: [{ required: true, message: this.$t('scheduleRun.validate.email'), trigger: 'blur' }],
        emailTos: [{ required: true, message: this.$t('scheduleRun.validate.emailTos'), trigger: 'blur' }],
        scheduleCronjobId: [{ required: true, message: this.$t('scheduleRun.validate.scheduleCronjobId'), trigger: 'blur' }],
        scheduleId: [{ required: true, message: this.$t('scheduleRun.validate.scheduleId'), trigger: 'blur' }],
        templateId: [{ required: true, message: this.$t('scheduleRun.validate.templateId'), trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getEmails()
    this.getSchedules()
    this.getTemplates()
  },
  methods: {
    async getList() {
      try {
        this.listLoading = true
        const response = await getAllScheduleRun(this.listQuery)
        const { elements, totalElements } = response.data
        this.list = elements
        this.total = totalElements
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.listLoading = false
      }
    },
    async getEmails() {
      try {
        const response = await getAllEmails()
        this.emails = response.data
      } catch (error) {
        this.$message.error(error)
      }
    },
    async getSchedules() {
      try {
        const response = await getSchedules()
        this.schedules = response.data
      } catch (error) {
        this.$message.error(error)
      }
    },
    async getTemplates() {
      try {
        const response = await getAllTemplates()
        this.templates = response.data
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: null,
        email: null,
        emailTos: null,
        scheduleId: null,
        templateId: null
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          await createScheduleRun(this.temp)
          this.$message.success({
            message: this.$t('message.success'),
            type: 'success',
            showClose: true
          })
          await this.getList()
          this.dialogFormVisible = false
        }
      })
    },
    handleUpdate(row) {
      this.temp = {
        id: row.id,
        email: row.email.email,
        emailTos: row.emailTos,
        scheduleId: row.schedule.id,
        templateId: row.template.id
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    showEmail(row) {
      this.dialogEmailVisible = true
      this.temp = {
        ...row.email
      }
    },
    showProxy(row) {
      this.dialogProxyVisible = true
      this.temp = {
        ...row.email
      }
    },
    showTemplate(row) {
      this.dialogTemplateVisible = true
      this.temp = {
        ...row.template
      }
    },
    showSchedule(row) {
      this.dialogScheduleVisible = true
      this.temp = {
        ...row.schedule
      }
    },
    updateData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          await updateScheduleRun(tempData)
          await this.getList()
          this.dialogFormVisible = false
          this.$message.success({
            message: this.$t('message.success'),
            type: 'success',
            showClose: true
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm(this.$t('scheduleRun.message.delete'), this.$t('message.confirm'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(async() => {
        await deleteScheduleRun(row.id)
        await this.getList()
        this.$message.success({
          message: this.$t('message.success'),
          type: 'success',
          showClose: true
        })
      }).catch(() => {
      })
    },
    handleModifyStatus(row) {
      this.$confirm(this.$t('scheduleRun.message.modifyStatus'), this.$t('message.confirm'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(async() => {
        const enabled = row.enable
        if (enabled) {
          await disableScheduleRun(row.id)
        } else {
          await enableScheduleRun(row.id)
        }
        await this.getList()
        this.$message.success({
          message: this.$t('message.success'),
          type: 'success',
          showClose: true
        })
      }).catch(() => {
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tb = 'schedule-run'
        const headerKey = ['id',
          'name',
          'host',
          'port',
          'username',
          'password']
        const tHeader = this.getTHeader(tb, headerKey)
        const data = this.getTableData(headerKey)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `${tb}_${Date.now()}`
        })
        this.downloadLoading = false
      })
    },
    getTHeader(prefix, headerKey) {
      if (headerKey) {
        return headerKey.map(key => this.$t(`${prefix}.${key}`))
      }
      return []
    },
    getTableData(headerKey) {
      return this.list.map(v => headerKey.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
