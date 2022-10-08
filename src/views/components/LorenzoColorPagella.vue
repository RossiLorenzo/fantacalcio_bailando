<template>
  <div v-if="voto == 100"></div>
  <ArgonBadge v-else-if="voto >= 10" size="sm" variant="gradient" color="primary"> {{ voto }} </ArgonBadge>
  <ArgonBadge v-else-if="voto >= 7" size="sm" variant="gradient" color="info"> {{ voto }} </ArgonBadge>
  <ArgonBadge v-else-if="voto >= 6" size="sm" variant="gradient" color="success"> {{ voto }} </ArgonBadge>
  <ArgonBadge v-else-if="voto >= 5" size="sm" variant="gradient" color="warning"> {{ voto }} </ArgonBadge>
  <ArgonBadge v-else size="sm" variant="gradient" color="danger"> {{ voto }} </ArgonBadge>
</template>

<script>
  import ArgonBadge from "@/components/ArgonBadge.vue";

  export default {
    name: "lorenzo-color-pagella",
    components: {
      ArgonBadge
    },
    props: {
      voto: Number
    }
  };
</script>

- resource_template: https://services-api.ryanair.com/farfnd/v4/oneWayFares/STN/PSA/cheapestPerDay?currency=GBP&outboundMonthOfDate={{now().strftime('%Y-%m-%d')}}
  scan_interval: 86400
  method: GET
  sensor:
    - name: ryanair_stn_psa_month_0
      value_template: "OK"
      json_attributes_path: "$.outbound"
      json_attributes:
        - fares
- resource_template: https://services-api.ryanair.com/farfnd/v4/oneWayFares/STN/PSA/cheapestPerDay?currency=GBP&outboundMonthOfDate={{strptime((now() + timedelta(days=31)).year|string + '-' + (now() + timedelta(days=31)).month|string + '-01', '%Y-%m-%d').strftime('%Y-%m-%d')}}
  scan_interval: 86400
  method: GET
  sensor:
    - name: ryanair_stn_psa_month_1
      value_template: "OK"
      json_attributes_path: "$.outbound"
      json_attributes:
        - fares
- resource_template: https://services-api.ryanair.com/farfnd/v4/oneWayFares/STN/PSA/cheapestPerDay?currency=GBP&outboundMonthOfDate={{strptime((now() + timedelta(days=61)).year|string + '-' + (now() + timedelta(days=61)).month|string + '-01', '%Y-%m-%d').strftime('%Y-%m-%d')}}
  scan_interval: 86400
  method: GET
  sensor:
    - name: ryanair_stn_psa_month_2
      value_template: "OK"
      json_attributes_path: "$.outbound"
      json_attributes:
        - fares
- resource_template: https://services-api.ryanair.com/farfnd/v4/oneWayFares/STN/PSA/cheapestPerDay?currency=GBP&outboundMonthOfDate={{strptime((now() + timedelta(days=91)).year|string + '-' + (now() + timedelta(days=91)).month|string + '-01', '%Y-%m-%d').strftime('%Y-%m-%d')}}
  scan_interval: 86400
  method: GET
  sensor:
    - name: ryanair_stn_psa_month_3
      value_template: "OK"
      json_attributes_path: "$.outbound"
      json_attributes:
        - fares

- resource_template: https://services-api.ryanair.com/farfnd/v4/oneWayFares/PSA/STN/cheapestPerDay?currency=GBP&outboundMonthOfDate={{now().strftime('%Y-%m-%d')}}
  scan_interval: 86400
  method: GET
  sensor:
    - name: ryanair_psa_stn_month_0
      value_template: "OK"
      json_attributes_path: "$.outbound"
      json_attributes:
        - fares
- resource_template: https://services-api.ryanair.com/farfnd/v4/oneWayFares/PSA/STN/cheapestPerDay?currency=GBP&outboundMonthOfDate={{strptime((now() + timedelta(days=31)).year|string + '-' + (now() + timedelta(days=31)).month|string + '-01', '%Y-%m-%d').strftime('%Y-%m-%d')}}
  scan_interval: 86400
  method: GET
  sensor:
    - name: ryanair_psa_stn_month_1
      value_template: "OK"
      json_attributes_path: "$.outbound"
      json_attributes:
        - fares
- resource_template: https://services-api.ryanair.com/farfnd/v4/oneWayFares/PSA/STN/cheapestPerDay?currency=GBP&outboundMonthOfDate={{strptime((now() + timedelta(days=61)).year|string + '-' + (now() + timedelta(days=61)).month|string + '-01', '%Y-%m-%d').strftime('%Y-%m-%d')}}
  scan_interval: 86400
  method: GET
  sensor:
    - name: ryanair_psa_stn_month_2
      value_template: "OK"
      json_attributes_path: "$.outbound"
      json_attributes:
        - fares
- resource_template: https://services-api.ryanair.com/farfnd/v4/oneWayFares/PSA/STN/cheapestPerDay?currency=GBP&outboundMonthOfDate={{strptime((now() + timedelta(days=91)).year|string + '-' + (now() + timedelta(days=91)).month|string + '-01', '%Y-%m-%d').strftime('%Y-%m-%d')}}
  scan_interval: 86400
  method: GET
  sensor:
    - name: ryanair_psa_stn_month_3
      value_template: "OK"
      json_attributes_path: "$.outbound"
      json_attributes:
        - fares