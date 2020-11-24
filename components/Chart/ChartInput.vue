<template>
  <v-card flat>
    <v-card-title>
      <slot name="label">
        {{ label }}
      </slot>
    </v-card-title>
    <v-card-text>
      <v-text-field v-model="value" :type="type" />
    </v-card-text>
    <v-card-actions>
      <slot name="actions">
        <v-btn small color="primary" @click.stop="$emit('save', value)">
          Сохранить
        </v-btn>
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Input',
  props: {
    flat: {
      type: Boolean,
    },
    type: {
      type: String,
      default: 'Number',
    },
    label: {
      type: String,
    },
  },
  data: () => ({
    value: 0,
  }),
}
</script>

<style scoped></style>
