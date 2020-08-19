<template>
  <v-card>
    <v-card-title>
      <slot name="title">
        {{ title }}
      </slot>
    </v-card-title>
    <v-card-text>
      <slot>
        <v-select :items="items" v-model="selected"></v-select>
      </slot>
    </v-card-text>
    <v-card-actions>
      <slot>
        <v-btn color="primary" @click="$emit('select', selected)">
          {{ textBtn }}
        </v-btn>
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ChartSelect',
  props: {
    items: {
      type: Array,
    },
    textBtn: {
      type: String,
      default: 'Выбрать',
    },
    title: {
      type: String,
      default: 'Выбор',
    },
  },
  data: () => ({
    selected: null,
  }),
}
</script>

<style scoped></style>
