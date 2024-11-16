export interface RawGoogleBook {
    id: string,
    selfLink: string,
    volumeInfo: {
        title: string,
        authors: string[] | undefined,
        publisher: string | undefined,
        publishedDate: string | undefined,
        industryIdentifiers: {
            type: string,
            identifier: string
        }[] | undefined,
        categories: string[] | undefined,
        imageLinks: {
            smallThumbnail: string | undefined,
            thumbnail: string | undefined
        } | undefined
    }
}