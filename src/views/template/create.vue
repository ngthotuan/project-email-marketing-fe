<template>
  <template-detail :is-edit="false" />
</template>

<script>
import TemplateDetail from './components/TemplateDetail'

export default {
  name: 'CreateTemplate',
  components: { TemplateDetail }
}
</script>

