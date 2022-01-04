import {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import Head from 'next/head';
import { DynamicComponent } from '../components/DynamicComponent';
import { Storyblok, useStoryblok } from '../lib/storyblok';

export default function Page({
  story,
  preview,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // const enableBridge = true; // load the storyblok bridge everywhere
  // const enableBridge = preview; // enable bridge only in prevew mode
  story = useStoryblok(story, preview);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <pre>Preview: {JSON.stringify(preview)}</pre>
        <h1>{story ? story.name : 'My Site'}</h1>
      </header>

      {story && <DynamicComponent blok={story?.content} />}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  // join the slug array used in Next.js catch-all routes
  let slug = params?.slug
    ? (Array.isArray(params) ? params[0] : params).slug.join('/')
    : 'home';

  let { data } = await Storyblok.get(`cdn/stories/${slug}`, {
    version: preview === true ? 'draft' : 'published',
    ...(!!preview && { cv: Date.now() }),
  });

  return {
    props: {
      story: data ? data.story : null,
      preview,
    },
    revalidate: 10, // enable static content to be updated dynamically every 10 sec
    // revalidate: 60 * 60, // revalidate every hour
  };
};

export const getStaticPaths: GetStaticPaths = async (config) => {
  // get all links from Storyblok
  let { data } = await Storyblok.get('cdn/links/');
  let paths: GetStaticPathsResult['paths'] = [];

  // create a routes for every link
  Object.keys(data.links).forEach((linkKey) => {
    // do not create a route for folders
    if (data.links[linkKey].is_folder) {
      return;
    }

    // get array for slug because of catch all
    const slug = data.links[linkKey].slug;
    let splittedSlug = slug.split('/');

    // creates all the routes
    paths.push({ params: { slug: splittedSlug } });
  });

  return {
    paths: paths,
    // fallback:'blocking', //  false,
    fallback: true,
  };
};
