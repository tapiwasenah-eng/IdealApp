import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav } from '../../components/layout/PublicNav';
import { Footer } from '../../components/layout/Footer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import SEOHead from '../../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../../data/seo-schemas';

const posts = [
  {
    id: 1,
    slug: 'how-to-write-a-pitch-deck-in-2026',
    title: 'How to Write a Pitch Deck That Gets Funded in 2026',
    excerpt: 'Investors see hundreds of decks per week. Here is what separates the ones that get meetings from the ones that get archived.',
    category: 'Fundraising',
    date: 'March 28, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
  },
  {
    id: 2,
    slug: 'ai-business-plan-vs-traditional',
    title: 'AI-Generated Business Plans vs. Traditional Consulting: A Founder\'s Guide',
    excerpt: 'We compared AI-generated business plans from Ideal App against plans from boutique consulting firms. The results surprised us.',
    category: 'Product',
    date: 'March 15, 2026',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
  {
    id: 3,
    slug: 'financial-model-startup-2026',
    title: '5 Financial Model Mistakes That Kill Fundraising Rounds',
    excerpt: 'Your financials can make or break an investor conversation. Here are the most common mistakes — and how to fix them instantly.',
    category: 'Finance',
    date: 'February 28, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },
  {
    id: 4,
    slug: 'data-room-best-practices',
    title: 'Setting Up a Data Room: Best Practices for Startup Founders',
    excerpt: 'A well-organised data room speeds up due diligence and signals professionalism. Here\'s how to build one that investors love.',
    category: 'Fundraising',
    date: 'February 14, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  {
    id: 5,
    slug: 'one-pager-template-guide',
    title: 'The Perfect One-Pager: How to Compress Your Business Into One Page',
    excerpt: 'A one-pager is often the first document an investor reads. Make it count with this step-by-step guide.',
    category: 'Templates',
    date: 'January 30, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
  },
  {
    id: 6,
    slug: 'gdpr-startup-compliance',
    title: 'GDPR Compliance for Early-Stage Startups: What You Actually Need to Do',
    excerpt: 'Most startup founders overcomplicate GDPR. Here\'s a practical, no-fluff guide to staying compliant from day one.',
    category: 'Legal',
    date: 'January 12, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
  },
];

const BlogPage: React.FC = () => {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Blog — AI Document Tips, Pitch Deck Advice & Startup Guides"
        description="Expert guides on pitch decks, business plans, fundraising documents, and AI tools for startups. Stay ahead with Ideal App's startup content hub."
        keywords="pitch deck tips, AI document blog, startup fundraising guide, business plan advice, how to create a pitch deck, startup document blog, investor pitch deck examples, AI business plan blog"
        canonicalUrl="https://idealapp.technology/blog"
        ogImage="https://idealapp.technology/og/blog.png"
        structuredData={[organizationSchema, breadcrumbSchema('/blog', 'Blog')]}
      />
      <PublicNav />
      <main className="pt-16">
        <section className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Ideal App Blog</h1>
            <p className="text-xl text-[#e0e7ff]">
              Founder guides, fundraising tips, product updates, and AI insights.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          {/* Featured post */}
          <div className="mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-4">Featured</h2>
            <div className="grid md:grid-cols-2 gap-8 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <img src={featured.image} alt={featured.title} className="w-full h-64 object-cover" />
              <div className="p-8 flex flex-col justify-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">{featured.category}</span>
                <h3 className="text-2xl font-bold text-[#352459] mb-3">{featured.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{featured.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                </div>
                <Link to={`/blog/${featured.slug}`} className="flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:gap-2 transition-all">
                  Read article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Post grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <article key={post.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img src={post.image} alt={post.title} className="w-full h-44 object-cover" />
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{post.category}</span>
                  <h3 className="text-lg font-bold text-[#352459] mt-1 mb-2 leading-snug">{post.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
