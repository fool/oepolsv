import { FC } from 'react';
import { SbEditableContent } from 'storyblok-react';
import { DynamicComponent } from './DynamicComponent';

export type PageProps = {
  blok?: SbEditableContent;
};

export const Page: FC<PageProps> = ({ blok }) => {
  return (
    <div>
      {blok?.body?.map((child: SbEditableContent) => (
        <DynamicComponent blok={child} key={child._uid} />
      ))}
    </div>
  );
};
