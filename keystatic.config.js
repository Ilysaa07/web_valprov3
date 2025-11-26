import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Judul' } }),
        content: fields.document({
          label: 'Isi',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),
  },
});