import Image from 'next/image';

type PlaceThumbProps = {
  alt?: string;
  src?: string;
  tone?: string;
};

export default function PlaceThumb({ alt = '', src, tone = 'sea' }: PlaceThumbProps) {
  return (
    <div className={`place-thumb ${tone}`}>
      {src ? <Image alt={alt} fill sizes="(max-width: 760px) 100vw, 168px" src={src} unoptimized /> : null}
    </div>
  );
}
