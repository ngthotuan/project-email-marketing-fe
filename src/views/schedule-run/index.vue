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
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t('button.export') }}
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
      <el-table-column :label="$t('scheduleRun.id')" align="center" width="100">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.email')" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.emailTos')" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.emailTos }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.proxy')" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.proxy.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.schedule')" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.schedule.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.template')" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.template.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.enable')" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.enable }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('scheduleRun.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
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
        <el-form-item :label="$t('scheduleRun.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('scheduleRun.host')" prop="host">
          <el-input v-model="temp.host" />
        </el-form-item>
        <el-form-item :label="$t('scheduleRun.port')" prop="port">
          <el-input v-model="temp.port" />
        </el-form-item>
        <el-form-item :label="$t('scheduleRun.username')" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item :label="$t('scheduleRun.password')" prop="password">
          <el-input v-model="temp.password" />
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
  </div>
</template>

<script>
import { getAllScheduleRun, createScheduleRun, updateScheduleRun, deleteScheduleRun } from '@/api/schedule-run'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
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
      temp: {
        id: null,
        name: '',
        host: '',
        port: '',
        username: '',
        password: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      rules: {
        name: [{ required: true, message: this.$t('scheduleRun.validate.name'), trigger: 'blur' }],
        host: [{ required: true, message: this.$t('scheduleRun.validate.host'), trigger: 'blur' }],
        port: [{ required: true, message: this.$t('scheduleRun.validate.port'), trigger: 'blur' }],
        username: [{ required: true, message: this.$t('scheduleRun.validate.username'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('scheduleRun.validate.password'), trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: null,
        name: '',
        host: '',
        port: '',
        username: '',
        password: ''
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
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          await updateScheduleRun(tempData)
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
    handleDelete(row, index) {
      this.$confirm(this.$t('scheduleRun.message.delete'), this.$t('message.confirm'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(async() => {
        await deleteScheduleRun(row.id)
        await this.getList()
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
    }
  }
}
</script>
