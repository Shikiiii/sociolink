'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ArrowLeft, Heart, Sparkles, Wind } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
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
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl font-bold mb-6 text-foreground"
            >
              About SocioLink
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              One link to rule them all. Your digital identity, simplified.
            </motion.p>
          </div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid md:grid-cols-2 gap-12 mb-16"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-red-500" />
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
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-purple-500" />
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To create the most intuitive, beautiful, and personalized link-in-bio experience. 
                Every creator, influencer, and individual deserves a digital presence that truly represents them.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We're not just another link aggregator – we're your digital identity companion.
              </p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Why SocioLink?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg backdrop-blur-sm border border-opacity-20" 
                style={{ borderColor: 'var(--themed-input-border)' }}>
                <Wind className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Zen Mode</h3>
                <p className="text-muted-foreground">Clean, minimal design for those who value simplicity and focus.</p>
              </div>
              
              <div className="text-center p-6 rounded-lg backdrop-blur-sm border border-opacity-20"
                style={{ borderColor: 'var(--themed-input-border)' }}>
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Vibrant Mode</h3>
                <p className="text-muted-foreground">Dynamic, colorful interface for creators who want to stand out.</p>
              </div>
              
              <div className="text-center p-6 rounded-lg backdrop-blur-sm border border-opacity-20 sm:col-span-2 lg:col-span-1"
                style={{ borderColor: 'var(--themed-input-border)' }}>
                <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Built with Love</h3>
                <p className="text-muted-foreground">Every detail crafted with care for the best user experience.</p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of creators who've simplified their digital presence.</p>
            <Link href="/">
              <Button size="lg" className="px-8">
                Create Your SocioLink
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}