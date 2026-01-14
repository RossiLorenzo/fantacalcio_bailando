<template>
  <div v-if="voto == 100"></div>
  <ArgonBadge v-else-if="voto >= 10" size="sm" variant="gradient" color="primary"> {{ voto }} </ArgonBadge>
  <ArgonBadge v-else-if="voto >= 7" size="sm" variant="gradient" color="info"> {{ voto }} </ArgonBadge>
  <ArgonBadge v-else-if="voto >= 6" size="sm" variant="gradient" color="success"> {{ voto }} </ArgonBadge>
  <ArgonBadge v-else-if="voto >= 5" size="sm" variant="gradient" color="warning"> {{ voto }} </ArgonBadge>
  <ArgonBadge v-else size="sm" variant="gradient" color="danger"> {{ voto }} </ArgonBadge>
</template>

<script>
  import ArgonBadge from "@/components/ui/ArgonBadge.vue";

  export default {
    name: "ColorPagella",
    components: {
      ArgonBadge
    },
    props: {
      voto: Number
    }
  };
</script>
