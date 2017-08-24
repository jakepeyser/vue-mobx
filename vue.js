import Vue from 'vue';
import cities from './cities';

Vue.component('travel-log', {
  template: `
  <div class="travel-log">
    <div class="travel-log__alert" :style="{ opacity: alert ? 1 : 0 }">
      <span>Travel log updated!</span>
    </div>
    <div class="travel-log__content">
      <div class="travel-log__selected">
        <div class="city" v-if="selectedCity">
          <img class="city__icon" :src="selectedCity.icon" />
          <ul class="city__info">
            <div class="city__info--bit"><span>Name:</span><span>{{selectedCity.name}}</span></div>
            <div class="city__info--bit"><span>Language:</span><span>{{selectedCity.language}}</span></div>
            <div class="city__info--bit"><span>Currency:</span><span>{{selectedCity.currency}}</span></div>
            <div class="city__info--bit"><span>Population:</span><span>{{selectedCity.population}}</span></div>
          </ul>
        </div>
        <span v-else class="travel-log__selected--none">Please select a city</span>
      </div>
      <ul class="travel-log__cities">
        <div class="travel-log__cities--single" v-for="city in sortedCities" key="city.id">
          <h2 :class="{ selected: city.id === selectedCityId }" @click="selectCity(city.id)">{{city.name}}</h2>
          <div :class="{ 'travel-log__cities--single-visit': true, visited: visited[city.id] }" @click="toggleCity(city.id)" />
        </div>
      </ul>
    </div>
  </div>
`,

  data: function() {
    return {
      cities: cities,
      selectedCityId: null,
      visited: {},
      alert: false,
      clearAlert: null
    }
  },

  computed: {
    selectedCity() {
      return this.cities.find(city => city.id === this.selectedCityId);
    },

    sortedCities() {
      return this.cities.sort((a, b) => a.name > b.name ? 1 : -1);
    }
  },

  watch: {
    visited() {
      if (this.clearAlert) {
        clearTimeout(this.clearAlert);
      }

      this.clearAlert = setTimeout(() => {
        this.alert = false;
      }, 3000);
      this.alert = true;
    }
  },

  methods: {
    selectCity(cityId) {
      this.selectedCityId = cityId;
    },

    toggleCity(cityId) {
      if (this.visited[cityId]) {
        const { [cityId]: city, ...rest } = this.visited;
        this.visited = rest;
      } else {
        this.visited = { ...this.visited, [cityId]: true };
      }
    }
  }
});

new Vue({
  el: '#app'
});
