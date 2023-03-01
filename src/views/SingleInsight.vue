<template>
  <div>
    <div class="loading" v-if="loading">Loading...</div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="insight" class="content">
      <h1>{{ insight.title }}</h1>
      <img v-if="insight.image" :src="imageUrlFor(insight.image).width(480)" />

      <h6>{{ insight.subtitle }}</h6>
      <SanityBlocks :blocks="blocks" />
    </div>
  </div>
</template>

<script>
import { SanityBlocks } from "sanity-blocks-vue-component";
import client from "../client";
import imageUrlBuilder from "@sanity/image-url";

const imageBuilder = imageUrlBuilder(client);

const query = `*[slug.current == $slug] {
  _id,
  title,
  subtitle, 
  slug,
  "image": image.asset->url,
  Content
}[0]
`;

export default {
  name: "SinglePost",
  components: { SanityBlocks },
  data() {
    return {
      loading: true,
      insight: [],
      blocks: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    imageUrlFor(source) {
      return imageBuilder.image(source);
    },
    fetchData() {
      this.error = this.insight = null;
      this.loading = true;
      client.fetch(query, { slug: this.$route.params.slug }).then(
        (insight) => {
          this.loading = false;
          this.insight = insight;
          this.blocks = insight.Content || [];
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
.content {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 42em;
}
h1 {
  text-align: center;
}
h6 {
  color: #aaa;
  padding: 1em;
}
</style>