declare module '@storyblok/storyblok-editable' {
  export function sbEditable(blok: any): {
    'data-blok-c': string;
    'data-blok-uid': string;
  };
}
