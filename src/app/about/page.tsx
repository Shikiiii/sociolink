'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ArrowLeft, Heart, Sparkles, Wind, Zap, Coffee } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/app/components/header'

export default function AboutPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <>
      <Header />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        {/* Neural Network Background - simplified version */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <svg className="w-full h-full">
            <motion.line
              x1="10%" y1="20%" x2="80%" y2="30%"
              stroke={isDarkMode ? '#60a5fa' : '#2563eb'}
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.line
              x1="70%" y1="60%" x2="20%" y2="80%"
              stroke={isDarkMode ? '#60a5fa' : '#2563eb'}
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-16 pt-24">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground glass-card rounded-full px-4">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header with emoji */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6 flex items-center justify-center gap-3"
              >
                <span className="text-4xl">🌱</span>
                <span className="text-lg text-muted-foreground font-medium">
                  Our story, our mission
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl sm:text-6xl font-bold mb-6 text-foreground tracking-tight"
              >
                About SocioLink
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              >
                One link to rule them all. Your digital identity, simplified.
              </motion.p>
            </div>

            {/* Story Section with glass cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid md:grid-cols-2 gap-8 mb-16"
            >
              <motion.div 
                className="glass-card p-8 rounded-xl hover-lift"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Heart className="w-6 h-6 mr-3 text-red-500" />
                  Our Story
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Born from the chaos of managing countless social profiles, SocioLink emerged as the solution 
                  we all needed but never had. No more juggling multiple links, no more outdated bios.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe your online presence should be as unique as you are, whether you're feeling 
                  zen or vibrant, minimal or expressive.
                </p>
              </motion.div>

              <motion.div 
                className="glass-card p-8 rounded-xl hover-lift"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-purple-500" />
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To create the most intuitive, beautiful, and personalized link-in-bio experience. 
                  Every creator, influencer, and individual deserves a digital presence that truly represents them.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We're not just another link aggregator – we're your digital identity companion.
                </p>
              </motion.div>
            </motion.div>

            {/* Features with personality */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why SocioLink?</h2>
                <p className="text-muted-foreground">Because your vibe matters</p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div 
                  className="text-center p-8 glass-card rounded-xl hover-lift"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Wind className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-3">Zen Mode</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Clean, minimal design for those who value simplicity and focus. Peace in pixels.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="text-center p-8 glass-card rounded-xl hover-lift"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-xl font-semibold mb-3">Vibrant Mode</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Dynamic, colorful interface for creators who want to stand out. Express yourself boldly.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="text-center p-8 glass-card rounded-xl hover-lift sm:col-span-2 lg:col-span-1"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <h3 className="text-xl font-semibold mb-3">Built with Love</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every detail crafted with care for the best user experience. No compromises.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Values Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">What we believe</h2>
                <p className="text-muted-foreground">The principles that guide us</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                  <h3 className="font-semibold mb-2">Simplicity</h3>
                  <p className="text-sm text-muted-foreground">Complex problems deserve simple solutions</p>
                </div>
                
                <div className="text-center">
                  <Coffee className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                  <h3 className="font-semibold mb-2">Authenticity</h3>
                  <p className="text-sm text-muted-foreground">Be real, be you, always</p>
                </div>
                
                <div className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Always pushing boundaries</p>
                </div>
              </div>
            </motion.div>

            {/* CTA with personality */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-center glass-card p-12 rounded-xl"
            >
              <div className="mb-6">
                <span className="text-3xl mb-4 block">🚀</span>
                <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  Join thousands of creators who've simplified their digital presence. Your audience is waiting.
                </p>
              </div>
              
              <Link href="/">
                <Button 
                  size="lg" 
                  className="px-8 py-3 rounded-xl text-lg font-medium hover-lift"
                  style={{
                    background: `linear-gradient(45deg, ${isDarkMode ? '#60a5fa' : '#2563eb'}, ${isDarkMode ? '#22d3ee' : '#0891b2'})`,
                    color: '#ffffff',
                    border: 'none'
                  }}
                >
                  Create Your SocioLink
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Button>
              </Link>
              
              <p className="mt-4 text-xs text-muted-foreground">
                Free forever. No credit card required.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}