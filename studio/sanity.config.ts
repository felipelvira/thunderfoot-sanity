import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { deskStructure } from './lib/deskStructure'

export default defineConfig({
  name: 'default',
  title: 'Thunderfoot Project',

  projectId: 'z68nypqk',
  dataset: 'production',

  plugins: [deskTool({
    structure: deskStructure,
  }), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
