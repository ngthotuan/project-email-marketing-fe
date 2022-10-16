<template>
  <template-detail :is-edit="true" />
</template>

<script>
import TemplateDetail from './components/TemplateDetail'

export default {
  name: 'EditTemplate',
  components: { TemplateDetail }
}
</script>

