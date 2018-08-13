<template>
    <div>
        <el-select v-model="selectedListing" filterable placeholder="Select Listing"
                   @change="onListingChange">
            <el-option v-for="experience in listings" :key="experience.value" :label="experience.label"
                       :value="experience.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
  import {HTTP} from '../http-common';

  export default {
    name: 'ListingSelector',
    props: ['onListingChange'],

    data() {
      return {
        listings: [],
        selectedListing: ''
      }
    },

    created: function() {
      let self = this;
      let sellerId = '55c2b026ad2171f0438b45e7';
      HTTP.get('api/experiences?seller=' + sellerId)
        .then(response => {
          self.listings = self.parseExperiences(response.data.data);
          self.selectedListing = self.listings[0].value
        })
    },

    methods: {
      parseExperiences: data => {
        let parsedData = [];
        for (let experience of data) {
          parsedData.push({value: experience.id, label: experience.name})
        }
        return parsedData;
      }
    }
  }
</script>

<style scoped>

</style>
