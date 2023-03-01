import { InsightCustomInput } from "../components/InsightCustomInput";
import { isUniqueAcrossAllDocuments } from "../lib/isUniqueAcrossAllDocuments";

// schemas/Insight.js
export default {
  name: 'Insight',
  type: 'document',
  title: 'Insight',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule:any) => Rule.required().min(6).max(200)
    },
    {
      name: 'subtitle',
      type: 'text',
      title: 'Subtitle',
      rows: 3,
      options: {
        maxRows: 3,
        autoGrow: false
      },
      validation: (Rule:any) => Rule.required().max(279)
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        isUnique: (input: string, context: any) => isUniqueAcrossAllDocuments(input, context),
        slugify: (input: string) => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 200)
      }
    },
    {
      title: 'Feature Image',
      name: 'image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
        {
          // Editing this field will be hidden behind an "Edit"-button
          name: 'attribution',
          type: 'string',
          title: 'Attribution',
        }
      ]
    },
    {
      name: 'customInput',
      title: 'Custom Component 1',
      type: 'string',
      components: {
        input: InsightCustomInput
      }
    },
    {
      title: 'Content',
      name: 'Content',
      type: 'array',
      of: [{ type: 'block' }]
    }
  ]
}