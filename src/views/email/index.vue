<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        :placeholder="$t('email.search')"
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
      <el-table-column :label="$t('email.no')" align="center" width="100">
        <template slot-scope="{ $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('email.email')" align="center" min-width="150">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('email.password')" min-width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('email.proxy')" min-width="110" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="showProxy(row)">{{ `${row.proxyId} (${row.proxyName})` }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('email.actions')" align="center" width="230" class-name="small-padding fixed-width">
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
        <el-form-item :label="$t('email.email')" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item :label="$t('email.password')" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item :label="$t('email.proxy')" prop="proxyId">
          <el-select v-model="temp.proxyId" style="width: 100%" filterable>
            <el-option
              v-for="item in listProxies"
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

    <el-dialog :title="$t('email.proxyInfo')" :visible.sync="dialogProxy">
      <el-form
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
        disabled
      >
        <el-form-item :label="$t('email.proxyId')" prop="proxyId">
          <el-input v-model="temp.proxyId" />
        </el-form-item>
        <el-form-item :label="$t('email.proxyName')" prop="proxyName">
          <el-input v-model="temp.proxyName" />
        </el-form-item>
        <el-form-item :label="$t('email.proxyHost')" prop="proxyHost">
          <el-input v-model="temp.proxyHost" />
        </el-form-item>
        <el-form-item :label="$t('email.proxyPort')" prop="proxyPort">
          <el-input v-model="temp.proxyPort" />
        </el-form-item>
        <el-form-item :label="$t('email.proxyUsername')" prop="proxyUsername">
          <el-input v-model="temp.proxyUsername" />
        </el-form-item>
        <el-form-item :label="$t('email.proxyPassword')" prop="proxyPassword">
          <el-input v-model="temp.proxyPassword" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogProxy = false">
          {{ $t('button.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getEmails, createEmail, updateEmail, deleteEmail } from '@/api/email'
import { getAllProxies } from '@/api/proxy'
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
      listProxies: [],
      temp: {
        email: '',
        password: '',
        proxyId: null
      },
      dialogProxy: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      rules: {
        email: [{ required: true, message: this.$t('email.validate.username'), trigger: 'blur' }, {
          type: 'email',
          message: this.$t('email.validate.username'),
          trigger: 'blur'
        }],
        password: [{ required: true, message: this.$t('email.validate.password'), trigger: 'blur' }],
        proxyId: [{ required: true, message: this.$t('email.validate.proxy'), trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getProxies()
  },
  methods: {
    async getList() {
      try {
        this.listLoading = true
        const response = await getEmails(this.listQuery)
        const { elements, totalElements } = response.data
        this.list = elements
        this.total = totalElements
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.listLoading = false
      }
    },
    getProxies() {
      getAllProxies().then(response => {
        this.listProxies = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
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
          await createEmail(this.temp)
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
    showProxy(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogProxy = true
    },
    updateData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          await updateEmail(tempData)
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
      console.log({
        row,
        index
      })
      this.$confirm(this.$t('email.message.delete'), this.$t('message.confirm'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(async() => {
        await deleteEmail(row.email)
        await this.getList()
      }).catch(() => {
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tb = 'email'
        const headerKey = [
          'email',
          'password',
          'proxy'
        ]
        const tHeader = this.getTHeader(tb, headerKey)
        const data = this.getTableData(['email', 'password', 'proxyId'])
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
