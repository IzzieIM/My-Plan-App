<template>
  <NavBar/>
  <!-- <SearchBar/> -->
  <ResultCity/>
  <router-view/>
</template>


<script>
import NavBar from './components/NavBar.vue';
// import SearchBar from './components/SearchBar.vue';
import ResultCity from './components/ResultCity.vue';
export default {
  name: 'App',
  components: {
    NavBar,
    // SearchBar,
    ResultCity
  }
}
</script>



<style>
</style>
