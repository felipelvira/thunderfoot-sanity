<template>
  <v-app>
    <v-app-bar :elevation="4">
      <a class="site-logo" href="/">
        <img v-if="siteSettings" :src="imageUrlFor(siteSettings.logo).width(100)" />
      </a>
      <h2 style="margin: auto;">Sanity + Vue : Thunderfoot test</h2>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-footer class="bg-grey-lighten-1">
      <v-row justify="center" no-gutters>
        <v-col v-if="siteSettings" class="site-footer text-center mt-4" cols="12">
          {{ new Date().getFullYear() }} — <strong>{{siteSettings.copy}}</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import client from "./client";
import imageUrlBuilder from "@sanity/image-url";

const imageBuilder = imageUrlBuilder(client);

const query = `*[_type == "siteSettings" && !(_id in path("drafts.**"))] {
  _id,
  copy,
  "logo": logo.asset->url,
}[0]`;

export default {
  data: () => ({
    siteSettings: {},
  }),
  created() {
    this.fetchData();
  },
  methods: {
    imageUrlFor(source) {
      return imageBuilder.image(source);
    },
    fetchData() {
      this.error = this.siteSettings = null;
      client.fetch(query).then(
        (siteSettings) => {
          this.siteSettings = siteSettings;
        },
        (error) => {
          this.error = error;
        }
      );
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.site-logo img{
  border-radius: 50%;
  max-width: 50px;
}
.site-logo{
  border-radius: 50%;
  max-width: 50px;
  margin-left: 2%;
}
</style>
