export default {
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        {
            name: 'logo',
            title: 'Navbar Logo',
            type: 'image',
            options: {
                hotspot: true
            },
        },
        {
            name: 'copy',
            title: 'Copyright',
            type: 'text'
        }
    ]
}