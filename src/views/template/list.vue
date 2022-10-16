<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        :placeholder="$t('template.search')"
        style="width: 500px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('button.search') }}
      </el-button>
      <router-link :to="'/template/create'" class="link-type">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
        >
          {{ $t('button.add') }}
        </el-button>
      </router-link>
      <el-button
        v-waves
        :loading="downloadLoading"
        style="margin-left: 10px;"
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
      <el-table-column :label="$t('template.id')" align="center" width="100">
        <template slot-scope="{row}">
          <router-link :to="'/template/edit/'+row.id" class="link-type">
            <span>{{ row.id }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('template.name')" min-width="150" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/template/edit/'+row.id" class="link-type">
            <span>{{ row.name }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('template.subject')" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.subject }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column :label="$t('template.content')" min-width="150" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.content }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column :label="$t('template.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/template/edit/'+row.id">
            <el-button type="primary" size="mini">
              {{ $t('button.edit') }}
            </el-button>
          </router-link>
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
  </div>
</template>

<script>
import { getTemplates, deleteTemplate } from '@/api/template'
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
        const response = await getTemplates(this.listQuery)
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
    handleDelete(row, index) {
      this.$confirm(this.$t('template.message.delete'), this.$t('message.confirm'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(async() => {
        await deleteTemplate(row.id)
        await this.getList()
      }).catch(() => {
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tb = 'template'
        const headerKey = ['id',
          'name',
          'subject',
          'content']
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
