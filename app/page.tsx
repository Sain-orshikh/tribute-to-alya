'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#12121a' }}>
      {/* Clustered Rotating GIFs - Scattered and Repeated */}
      {[
        { src: '/alya.gif', top: '8%', left: '12%', size: 'w-32 h-32', rotate: '-15deg' },
        { src: '/alya-sometimes-hides-her-feelings-in-russian-roshidere.gif', top: '5%', left: '55%', size: 'w-40 h-40', rotate: '25deg' },
        { src: '/alyaxshame.gif', top: '12%', left: '78%', size: 'w-28 h-28', rotate: '-35deg' },
        { src: '/ken2903.gif', top: '3%', left: '35%', size: 'w-36 h-36', rotate: '12deg' },
        { src: '/oi.gif', top: '10%', left: '68%', size: 'w-24 h-24', rotate: '45deg' },
        
        { src: '/alya-eating.gif', top: '32%', left: '8%', size: 'w-40 h-40', rotate: '30deg' },
        { src: '/alya-roshidere.gif', top: '28%', left: '75%', size: 'w-32 h-32', rotate: '-20deg' },
        { src: '/anime-roshidere.gif', top: '35%', left: '45%', size: 'w-36 h-36', rotate: '55deg' },
        { src: '/alya-alisa.gif', top: '30%', left: '22%', size: 'w-28 h-28', rotate: '-45deg' },
        
        { src: '/alisa-kujou-roshidere.gif', top: '48%', left: '15%', size: 'w-36 h-36', rotate: '20deg' },
        { src: '/childegf-cici-core.gif', top: '50%', left: '72%', size: 'w-32 h-32', rotate: '-30deg' },
        { src: '/roshidere-tokidoki-bosotto.gif', top: '45%', left: '38%', size: 'w-40 h-40', rotate: '40deg' },
        { src: '/alya-san-hides-her-feelings-in-russian-tokidoki-bosotto-russia-go-de-dereru-tonari-no-alya-san.gif', top: '52%', left: '60%', size: 'w-28 h-28', rotate: '-50deg' },
        
        { src: '/tokidoki-bosotto-roshia-go-de-dereru-tonari-no-alya-san-alya-sometimes-hides-her-feelings-in-russian.gif', top: '68%', left: '25%', size: 'w-24 h-24', rotate: '15deg' },
        { src: '/alisa-kujou-roshidere (1).gif', top: '70%', left: '58%', size: 'w-32 h-32', rotate: '-25deg' },
        { src: '/alisa-kujou-roshidere (2).gif', top: '65%', left: '10%', size: 'w-36 h-36', rotate: '35deg' },
        { src: '/alya-anime.gif', top: '75%', left: '42%', size: 'w-28 h-28', rotate: '-15deg' },
        { src: '/alya-tokidoki-bosotto-russiago-de-dereru-tonari-no-alya-san.webp', top: '78%', left: '82%', size: 'w-40 h-40', rotate: '25deg' },
      ].map((gif, idx) => (
        <div
          key={idx}
          className={`absolute ${gif.size} rounded-xl border-4 border-gray-300 shadow-lg overflow-hidden hover:scale-110 transition-transform duration-300`}
          style={{
            top: gif.top,
            left: gif.left,
            transform: `rotate(${gif.rotate})`,
          }}
        >
          <img
            src={gif.src}
            alt="anime"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Center Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Link
          href="/predict"
          className="text-black font-black py-6 px-16 rounded-full text-3xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-4 border-white relative"
          style={{
            backgroundImage: `url('/images (1).jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <span>🎬 START</span>
        </Link>
      </div>


    </main>
  )
}
