import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function JournalPage() {
  const articles = [
    {
      id: 1,
      title: "The Physics of Carbon Fiber in Cricket Bats",
      category: "Material Science",
      date: "Oct 24, 2024",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800",
      excerpt: "Why the shift from traditional English Willow to high-tensile carbon composite is changing the game forever."
    },
    {
      id: 2,
      title: "Aerodynamics in Modern Football Design",
      category: "Engineering",
      date: "Oct 18, 2024",
      image: "https://images.unsplash.com/photo-1518605368461-1ee11c52b274?auto=format&fit=crop&q=80&w=800",
      excerpt: "Analyzing the micro-textures that allow for unpredictable dip and swerve during a free kick."
    },
    {
      id: 3,
      title: "Interview: The Elite Badminton Stringer",
      category: "Pro Insights",
      date: "Oct 05, 2024",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800",
      excerpt: "We sat down with Olympic stringers to understand tension gradients and their impact on shuttlecock speed."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-foreground/10 pb-8 gap-6">
          <div>
            <span className="text-electric-blue font-bold text-[10px] tracking-widest uppercase mb-2 block">EDITORIAL & INSIGHTS</span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              THE JOURNAL
            </h1>
          </div>
          <div className="flex gap-2 p-1 neumorphic rounded-xl">
            {["All", "Science", "Interviews", "Tech"].map((tag, i) => (
              <button key={i} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${i === 0 ? "neumorphic-inset text-electric-blue" : "text-warm-gray hover:text-foreground"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} href="#" className="group block p-6 neumorphic rounded-[24px] hover:scale-[1.02] transition-transform">
              <div className="w-full h-48 neumorphic-inset rounded-xl overflow-hidden mb-6 relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover mix-blend-multiply opacity-70 group-hover:opacity-100 transition-opacity duration-500" 
                />
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-foreground group-hover:text-electric-blue transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[9px] font-bold tracking-widest uppercase text-electric-blue mb-2 block">{article.category} • {article.date}</span>
              <h3 className="font-black uppercase tracking-tighter text-lg mb-3 text-foreground leading-tight group-hover:text-electric-blue transition-colors">{article.title}</h3>
              <p className="text-[10px] font-medium text-warm-gray line-clamp-3 leading-relaxed">{article.excerpt}</p>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="btn-luxury">Load More Articles</button>
        </div>

      </div>
    </div>
  );
}
