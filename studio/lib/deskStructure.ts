export const deskStructure = (S: any) =>
    S.list()
        .title('Documents')
        .items([S.listItem()
            .title('Site Settings')
            .child(
                S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')),
        ...S.documentTypeListItems().filter((listItem: any) => !['siteSettings'].includes(listItem.getId()))
        ])