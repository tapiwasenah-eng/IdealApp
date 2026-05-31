import satori from 'satori';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

interface OGPage {
  slug: string;
  title: string;
  subtitle: string;
}

const pages: OGPage[] = [
  { slug: 'home', title: 'AI-Powered Business Document Creator', subtitle: 'Pitch decks, business plans, financial models & more' },
  { slug: 'features', title: 'Powerful Features for Founders', subtitle: 'AI generation · 54 templates · Canvas editor · Investor database' },
  { slug: 'pricing', title: 'Simple, Transparent Pricing', subtitle: 'Free · Pro $12/mo · Enterprise $29/mo' },
  { slug: 'templates', title: '54 Professional Templates', subtitle: 'Pitch decks, business plans, financial models & legal docs' },
  { slug: 'solutions', title: 'Built for Startups', subtitle: 'Investor-ready documents in minutes' },
  { slug: 'investors', title: 'Investor Database', subtitle: 'Find VCs and angels actively investing in startups like yours' },
  { slug: 'blog', title: 'Startup Document Insights', subtitle: 'Pitch deck tips, fundraising guides & AI tools' },
  { slug: 'about', title: 'About Ideal App', subtitle: 'IdealApp Technology Ltd · England & Wales' },
  { slug: 'security', title: 'Enterprise-Grade Security', subtitle: 'UK data residency · GDPR compliant · End-to-end encrypted' },
  { slug: 'contact', title: 'Get in Touch', subtitle: 'Sales · Support · Partnerships' },
];

async function generateOGImage(page: OGPage) {
  try {
    // Fetch font from CDN
    const fontResponse = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-700-normal.woff');
    const fontData = await fontResponse.arrayBuffer();

    const svg = await (satori as any)(
      {
        type: 'div',
        props: {
          style: {
            width: '1200px',
            height: '630px',
            background: 'linear-gradient(135deg, #8b3dff 0%, #6620cc 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px',
            fontFamily: 'Inter',
          },
          children: [
            // Logo placeholder
            {
              type: 'div',
              props: {
                style: { color: 'white', fontSize: '28px', fontWeight: 700, marginBottom: '48px', opacity: 0.9 },
                children: '✦ Ideal App',
              },
            },
            // Title
            {
              type: 'div',
              props: {
                style: { color: 'white', fontSize: '56px', fontWeight: 700, lineHeight: 1.15, marginBottom: '20px', maxWidth: '900px' },
                children: page.title,
              },
            },
            // Subtitle
            {
              type: 'div',
              props: {
                style: { color: 'rgba(255,255,255,0.75)', fontSize: '26px', fontWeight: 400 },
                children: page.subtitle,
              },
            },
            // URL
            {
              type: 'div',
              props: {
                style: { color: 'rgba(255,255,255,0.5)', fontSize: '18px', marginTop: 'auto' },
                children: 'idealapp.technology',
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [{ name: 'Inter', data: fontData, weight: 700 }],
      }
    );

    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    await fs.writeFile(path.join(process.cwd(), `public/og/${page.slug}.png`), png);
    console.log(`Generated: public/og/${page.slug}.png`);
  } catch (error) {
    console.error(`Failed to generate OG image for ${page.slug}:`, error);
  }
}

async function main() {
  await fs.mkdir(path.join(process.cwd(), 'public/og'), { recursive: true });
  for (const page of pages) {
    await generateOGImage(page);
  }
  console.log('All OG images generated.');
}

main();
