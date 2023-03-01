export async function isUniqueAcrossAllDocuments(slug: any, context: any) {
    const { document, getClient } = context
    const client = getClient({ apiVersion: '2021-10-21' })
    const id = document._id.replace(/^drafts\./, '')
    const params = {
        draft: `drafts.${id}`,
        published: id,
        slug,
    }
    const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug][0]._id)`
    const result = await client.fetch(query, params)
    return result
}