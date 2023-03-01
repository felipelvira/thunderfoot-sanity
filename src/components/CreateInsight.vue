
<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-card class="add-insight" v-bind="props">
          <v-card-item>
            <span class="material-icons">
              add
            </span>
            <v-card-subtitle class="subtitle">Add New Insight</v-card-subtitle>
          </v-card-item>
        </v-card>
      </template>



      <v-card>
        <v-card-title>
          <span class="text-h5">Create New Insight</span>
        </v-card-title>
        <v-card-text>
          <v-container>


            <form>
              <v-text-field v-model="state.title" :error-messages="v$.title.$errors.map(e => e.$message)" :counter="200"
                label="Title*" required @input="v$.title.$touch" @blur="v$.title.$touch"></v-text-field>

              <v-textarea counter v-model="state.subtitle" :error-messages="v$.subtitle.$errors.map(e => e.$message)"
                label="Subtitle*" required @input="v$.subtitle.$touch" @blur="v$.subtitle.$touch" rows="3" max-rows="3"
                wrap="hard"></v-textarea>
              <v-row>
                <v-col cols="12" sm="6">
                  <FileUpload :maxSize="1" accept="" @file-uploaded="getUploadedData" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="state.slug" :error-messages="v$.slug.$errors.map(e => e.$message)" :counter="100"
                    label="Slug*" required @input="v$.slug.$touch" @blur="v$.slug.$touch"></v-text-field>
                  <tiptap v-model="state.content" />
                  <!-- <SanityBlocks :blocks="state.content  || []" /> -->
                </v-col>
              </v-row>
            </form>

          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <p style="color: red" v-if="sanityCreationError"> {{ sanityCreationError }}</p>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" v-on:click="submit" type="submit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators';

import client from "../client";

import FileUpload from '../components/FileUpload.vue';
import Tiptap from '../components/ContentEditor.vue';
// import { VueEditor } from "vue2-editor";

const { withAsync } = helpers;
const slugQuery = `*[_type == "Insight"]{
  _id,
  slug,
}`;
export default {
  name: 'CreateInsight',
  components: {
    FileUpload,
    Tiptap
  },
  data() {
    return {
      dialog: false,
      content: null,
      sanityCreationError: false
    }
  },
  setup() {
    const initialState = {
      title: '',
      subtitle: '',
      slug: '',
      image: [],
      content: null,
    }

    const state = reactive({
      ...initialState,
    })

    const rules = {
      title: { required, minLength: minLength(5) },
      subtitle: { required, maxLength: maxLength(279) },
      slug: { required, maxLength: maxLength(200), asyncValidator: helpers.withMessage('Slug must be unique.', withAsync(asyncValidator)) },
    }

    const v$ = useVuelidate(rules, state)

    function clear() {
      v$.value.$reset()

      for (const [key, value] of Object.entries(initialState)) {
        state[key] = value
      }
    }

    return { state, clear, v$ }
  },

  methods: {
    getUploadedData(file) {
      this.state.image = [];
      this.state.image.push(file)
    },
    parsePayload(state) {
      return {
        _type: 'Insight',
        title: state.title,
        subtitle: state.subtitle,
        Content: state.content,
        slug: {
          _type: 'slug',
          current: state.slug
        },
      }
    },
    async submit() {
      if (!await this.v$.$validate())
        return;
      console.log(this.state, this.state.image.length)
      client.create(this.parsePayload(this.state))
        .then(
          (newDocument) => {
            if (this.state.image.length > 0) {
              const selectedFile = this.state.image[0].selectedFile;
              const filename = this.state.image[0].name;
              const contentType = this.state.image[0].type;
              client.assets.upload('image', selectedFile, { contentType: contentType, filename: filename })
                .then(imageAsset => {
                  return client
                    .patch(newDocument._id)
                    .set({
                      image: {
                        _type: 'image',
                        asset: {
                          _type: "reference",
                          _ref: imageAsset._id
                        }
                      }
                    })
                    .commit()
                })
                .then(() => {
                  this.dialog = false;
                  console.log("Done!");
                })
                .catch((error) => {
                  console.error(error)
                })

            }
          },
          (error) => {
            this.sanityCreationError = error.message;
            setTimeout(() => {
              this.sanityCreationError = false;
            }, 2000);
          },
        );

    },
  },
}
async function asyncValidator(incomingSlug) {
  const slugs = await client.fetch(slugQuery);
  const found = slugs.find(sl => sl.slug.current == incomingSlug);
  return Boolean(!found);
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.add-insight {
  margin: auto;
}

.add-insight .subtitle {
  text-align: center;
}
</style>
