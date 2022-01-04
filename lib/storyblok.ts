import { debounce, merge } from 'lodash-es';
import { useEffect, useState } from 'react';
import StoryblokClient, {
  StoryblokComponent,
  StoryData,
} from 'storyblok-js-client';

declare const window: Window & { StoryblokBridge: any };

export const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_TOKEN,
  cache: {
    clear: 'auto',
    type: 'memory',
  },
});

function addBridge(callback: any) {
  const existingScript = document.getElementById('storyblokBridge');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = '//app.storyblok.com/f/storyblok-v2-latest.js';
    script.id = 'storyblokBridge';
    document.body.appendChild(script);
    script.onload = () => {
      // once the scrip is loaded, init the event listeners
      callback();
    };
  } else {
    callback();
  }
}


export function useStoryblok(originalStory: StoryData, preview: boolean) {
  let [story, setStory] = useState(originalStory);

  useEffect(() => {
    if (preview) {
      // first load the bridge, then initialize the event listeners
      addBridge(initEventListeners);
    }
  }, [originalStory, preview, setStory]);

  useEffect(() => {
    setStory(originalStory);
  }, [originalStory]);
  


function initEventListeners(story: StoryData) {
  const { StoryblokBridge } = window;
  if (typeof StoryblokBridge !== 'undefined') {
    // initialize the bridge with your token
    const storyblokInstance = new StoryblokBridge();

    // reload on Next.js page on save or publish event in the Visual Editor
    storyblokInstance.on(['change', 'published'], () => location.reload());

    // live update the story on input events
    storyblokInstance.on('input', (event: any) => {
      console.log('editmode')
      // check if the ids of the event and the passed story match
      if (story && event.story.content._uid === story.content._uid) {
        // change the story content through the setStory function
        setStory(event.story);
      }
    });

    storyblokInstance.on('enterEditmode', (event: any) => {
      // loading the draft version on initial enter of editor
      Storyblok.get(`cdn/stories/${event.storyId}`, {
        version: 'draft',
      })
        .then(({ data }) => {
          if (data.story) {
            setStory(data.story);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}

  return story;
}
