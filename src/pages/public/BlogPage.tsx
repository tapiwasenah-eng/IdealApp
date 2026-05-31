import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav } from '../../components/layout/PublicNav';
import { Footer } from '../../components/layout/Footer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import SEOHead from '../../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../../data/seo-schemas';
import { blogSeoStrategy } from '../../data/blog-seo-strategy';

const BlogPage: React.FC = () => {
  const [featured, ...rest] = blogSeoStrategy.map((post, idx) => ({
    id: idx + 1,
    slug: post.slug,
    title: post.title,
    excerpt: post.metaDescription,
    category: 'Startup Guide',
    date: 'February 10, 2026',
    readTime: `${Math.ceil(post.suggestedWordCount / 200)} min read`,
    image: `https://images.unsplash.com/photo-${1551836022 + idx}-d5d88e9218df?w=800&q=80`,
  }));

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
          {featured && (
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
          )}

          {/* Post grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <article key={post.id} className="block group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/blog/${post.slug}`}>
                  <img src={post.image} alt={post.title} className="w-full h-44 object-cover" />
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 group-hover:text-indigo-700 transition-colors">{post.category}</span>
                    <h3 className="text-lg font-bold text-[#352459] mt-1 mb-2 leading-snug group-hover:text-[#8b3dff] transition-colors">{post.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
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
