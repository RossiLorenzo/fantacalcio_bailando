<template>
  {{ final_rank }}
  <span v-if="final_rank < initial_rank" style="color: green">
   <i class="fas fa-arrow-alt-circle-up"></i>
 </span>
 <span v-else-if="final_rank == initial_rank">
   <i class="fas fa-equals"></i>
 </span>
 <span v-else style="color: red">
   <i class="fas fa-arrow-alt-circle-down"></i>
 </span>
</template>

<script>
  export default {
    name: "lorenzo-ranking-arrows",
    props: {
      final_rank: Number,
      initial_rank: Number
    }
  };
</script>
