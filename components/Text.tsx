import { FC } from 'react';
import { SbEditableContent } from 'storyblok-react';
import { DynamicComponent } from './DynamicComponent';

export type TextProps = {
  blok?: SbEditableContent & {
    text: string;
  };
};

export const Text: FC<TextProps> = ({ blok }) => {
  return (
    <div>
      {blok?.text}
      {blok?.body?.map((child: SbEditableContent) => (
        <DynamicComponent blok={child} key={child._uid} />
      ))}
    </div>
  );
};
