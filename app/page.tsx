'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            🎨 Anime Mood Detector
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-95 drop-shadow">
            See your emotions through anime characters in real-time
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: '📹', title: 'Real-Time', desc: 'Live webcam detection every 5 seconds' },
            { icon: '😊', title: '7 Emotions', desc: 'Happy, Sad, Angry, Surprised, Fearful, Disgusted, Neutral' },
            { icon: '✨', title: 'Anime Magic', desc: 'Character matches your detected emotion' },
            { icon: '📊', title: 'Confidence Scores', desc: 'See breakdown of all emotion probabilities' },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-8 text-center text-white hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-sm opacity-90">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12 drop-shadow">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Start Camera', desc: 'Allow camera access' },
              { num: '2', title: 'Face Detection', desc: 'AI detects your face' },
              { num: '3', title: 'Emotion Analysis', desc: 'Predicted every 5 seconds' },
              { num: '4', title: 'See Results', desc: 'Anime shows your mood!' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  {step.num}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                <p className="text-white opacity-80 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-16">
          <Link
            href="/predict"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <span>Start Detecting</span>
            <span className="text-2xl">→</span>
          </Link>
        </div>

        {/* Features List */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'AI-powered emotion detection using deep learning',
              'Customizable anime characters per emotion',
              'Works directly in your browser',
              'No data stored or sent anywhere',
              '7 different emotions supported',
              'Mobile responsive design',
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-2xl text-green-400 flex-shrink-0">✓</span>
                <p className="text-white opacity-90">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center py-6 text-white opacity-75 text-sm">
        <p>Built with Next.js, FastAPI & Machine Learning ❤️</p>
      </footer>
    </main>
  )
}
