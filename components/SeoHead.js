import Head from 'next/head';
import { absoluteUrl, SITE_NAME, SOCIAL_IMAGE_PATH } from '../lib/seo';

const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export default function SeoHead({
  title,
  description,
  path = '/',
  type = 'website',
  image = SOCIAL_IMAGE_PATH,
  imageAlt = 'Kiwango, compagnon financier de voyage',
  robots = DEFAULT_ROBOTS,
  schema = [],
}) {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const schemas = Array.isArray(schema) ? schema : [schema];

  return <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content={robots} />
    <meta name="author" content="Ndiaga Ndiaye" />
    <meta name="application-name" content={SITE_NAME} />
    <link rel="canonical" href={canonical} />

    <meta property="og:type" content={type} />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={imageUrl} />
    <meta property="og:image:secure_url" content={imageUrl} />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={imageAlt} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={imageUrl} />
    <meta name="twitter:image:alt" content={imageAlt} />

    {schemas.filter(Boolean).map((item, index) => <script key={`schema-${index}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />)}
  </Head>;
}
