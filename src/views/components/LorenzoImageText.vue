<template>
  <div class="d-flex px-2 py-1">
    <div>
      <img
      :src="image"
      class="avatar avatar-xs me-1"
      alt="user1"
      />
    </div>
    <div class="d-flex flex-column justify-content-center">
      <h6 v-if="sub" class="mb-0 text-xs"><s>{{ text }}</s></h6>
      <h6 v-else class="mb-0 text-xs">{{ text }}</h6>
      <p class="text-xs text-secondary mb-0">{{ secondary_text }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "lorenzo-image-text",
    props: {
      image: String,
      text: String,
      sub: Boolean,
      secondary_text: {
        type: String,
        default: ''
      }
    }
  };
</script>
