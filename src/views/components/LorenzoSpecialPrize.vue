<template>
  <div class="card">
    <div class="p-3 pb-0 card-header">
      <div class="mb-1 row align-items-center">
        <img :src="Image" style="height:220px" />
        <h6 class="mb-0 text-sm">{{Title}}</h6>
        <p class="text-xs text-secondary mb-2">{{Subtitle}}</p>
      </div>
    </div>
    <!-- https://c.tenor.com/4Zl464BlTSUAAAAM/football-haiti.gif --> 
    <div class="pb-0 pt-2 card-body">
      <LorenzoImageText 
      :image="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2023/' + dataset[0].Jersey"
      :text="dataset[0].Name" 
      :secondary_text="dataset[0].Coach"
      />
      <div class="mb-1 mt-3 row align-items-center">
        <div class="table-responsive">
          <table class="table align-items-center">
            <thead>
              <th></th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0"><i :class="'fas ' + Col1.Icon" :style="'color: ' + Col1.Icon_Color"></i>{{ Col1.Name }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0"><i :class="'fas ' + Col2.Icon" :style="'color: ' + Col2.Icon_Color"></i>{{ Col2.Name }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">{{ Col3.Name }}</th>
            </thead>
            <tbody>
              <tr v-for="(squadra, index) in dataset" :key="index" >
                <td style="padding: 0rem 0.5rem !important">
                  <LorenzoImageText 
                  :image="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2023/' + squadra.Jersey"
                  />
                </td>
                <td style="padding: 0rem 0.5rem !important"> {{ squadra.Col1 }} </td>
                <td style="padding: 0rem 0.5rem !important"> {{ squadra.Col2 }} </td>
                <td style="padding: 0rem 0.5rem !important"> {{ squadra.Col3 }} </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LorenzoImageText from "@/views/components/LorenzoImageText.vue";

  export default {
    name: "lorenzo-special-prize",
    components: {
      LorenzoImageText
    },
    props: {
      dataset: {},
      Title: String,
      Subtitle: String,
      Image: String,
      Col1: Object,
      Col2: Object,
      Col3: Object,
    }
  };
</script>
