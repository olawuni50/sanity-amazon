import sanityClient from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

export const client = sanityClient({
    projectId:'mw7b13n3',
    // projectId:process.env.NEXT_PROJECT_ID,
    dataset:'production',
    apiVersion:'2022-08-15',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source)
