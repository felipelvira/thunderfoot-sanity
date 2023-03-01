
<template>
  <v-container class="home">
    <h2>Insights</h2>
    <div class="loading" v-if="loading">Loading...</div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <v-row class="masonry">
      <v-col v-for="insight in insights" :key="insight._id" class="child" cols="12" sm="4">
        <v-card class="pa-2" dark :to="`/insight/${insight.slug.current}`">
          <v-img v-if="insight.image" :src="insight.image" height="200px" cover></v-img>
          <v-img v-else src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px" cover></v-img>
          <v-card-title class="title">{{ insight.title }}</v-card-title>
          <v-card-subtitle class="subtitle"> {{ insight.subtitle }}</v-card-subtitle>
          <v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="4" cols="4" class="create-container">
        <CreateInsight v-model="showCreateInsight" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import client from "../client";
import Masonry from 'masonry-layout';
import imageUrlBuilder from "@sanity/image-url";
import CreateInsight from "../components/CreateInsight.vue"

const imageBuilder = imageUrlBuilder(client);
const query = `*[_type == "Insight" && !(_id in path("drafts.**"))] | order(_createdAt asc){
  _id,
  title,
  subtitle,
  slug,
  Content,
  "image": image.asset->url
}[0...50]`;

export default {
  name: "HomeView",
  components: {
    CreateInsight
  },
  data() {
    return {
      loading: true,
      showCreateInsight: false,
      insights: [],
    };
  },
  created() {
    this.fetchData();
    new Masonry('.masonry', {
      // options
      itemSelector: "[class*='col-']",
    });
    // client
    //   .delete({ query: '*[_type == "Insight" && _id =="Jzlypt0ryAmKlLEIJRu82D"]' })
    //   .then(console.log)
    //   .catch(console.error)
  },
  methods: {
    imageUrlFor(source) {
      return imageBuilder.image(source);
    },

    fetchData() {
      this.error = this.post = null;
      this.loading = true;
      client.fetch(query).then(
        (insights) => {
          this.loading = false;
          this.insights = insights;
        },
        (error) => {
          this.error = error;
        }
      );
    },
  },
};
</script>

<style scoped>
.home h2 {
  text-align: left;
  margin-bottom: 2%;
}

.home .title,
.home .subtitle {
  font-weight: bold;
  text-align: left;
}

.create-container {
  display: flex;
  align-items: center;
}
</style>