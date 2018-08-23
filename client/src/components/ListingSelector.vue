<template>
    <div>
        <el-select v-model="selectedExperience" filterable placeholder="Select Listing"
                   @change="onExperienceChange">
            <el-option v-for="experience in experiences" :key="experience.id" :label="experience.name"
                       :value="experience.id">
            </el-option>
        </el-select>
    </div>
</template>

<script>
  import {HTTP} from '../http-common';

  export default {
    name: 'ListingSelector',
    props: ['onExperienceChange'],

    data() {
      return {
        experiences: [],
        selectedExperience: ''
      }
    },

    watch: {
      selectedExperience: function() {
        let experience = this.experiences.find(function(experience) {
          return experience.id === this.selectedExperience;
        }, this);
        this.onExperienceChange(experience)
      }
    },

    created: function() {
      let self = this;
      let sellerId = '55c2b026ad2171f0438b45e7';
      HTTP.get('api/experiences?seller=' + sellerId)
        .then(response => {
          self.experiences = self.parseExperiences(response.data.data);
          self.selectedExperience = self.experiences[0].id
        })
    },

    methods: {
      parseExperiences: data => {
        let parsedData = [];
        for (let experience of data) {
          parsedData.push({id: experience.id, name: experience.name})
        }
        return parsedData;
      }
    }
  }
</script>

<style scoped>

</style>
