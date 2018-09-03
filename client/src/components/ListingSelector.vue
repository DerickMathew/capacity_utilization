<template>
    <div>
        <el-select v-model="selectedExperience" filterable placeholder="Select Listing">
            <el-option v-for="experience in experiences" :key="experience.id" :label="experience.name"
                       :value="experience.id">
            </el-option>
        </el-select>
    </div>
</template>

<script>
  import {XOLA_API} from '../http-common';

  export default {
    name: 'ListingSelector',
    props: ['onExperienceChange', 'sellerId'],

    data() {
      return {
        experiences: [],
        selectedExperience: ''
      }
    },

    watch: {
      selectedExperience() {
        let experience = this.experiences.find(function(experience) {
          return experience.id === this.selectedExperience;
        }, this);
        this.onExperienceChange(experience)
      }
    },

    created() {
      let self = this;
      let params = {seller: this.sellerId};
      XOLA_API.get('api/experiences', {params: params})
        .then(response => {
          self.experiences = self.parseExperiences(response.data.data);
          self.selectedExperience = self.experiences[0].id
        })
    },

    methods: {
      parseExperiences(data) {
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
