'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ArrowLeft, Shield, Eye, Lock, Users, Server, Mail, CheckCircle, XCircle, Clock, Download } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/app/components/header'

export default function PrivacyPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const lastUpdated = "June 5, 2025"

  return (
    <>
      <Header />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        {/* Enhanced Neural Network Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <svg className="w-full h-full">
            <motion.line
              x1="15%" y1="25%" x2="85%" y2="35%"
              stroke={isDarkMode ? '#60a5fa' : '#2563eb'}
              strokeWidth="1"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.line
              x1="75%" y1="65%" x2="25%" y2="85%"
              stroke={isDarkMode ? '#60a5fa' : '#2563eb'}
              strokeWidth="1"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1, ease: "easeInOut" }}
            />
            <motion.circle
              cx="20%" cy="40%" r="2"
              fill={isDarkMode ? '#60a5fa' : '#2563eb'}
              opacity="0.6"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx="80%" cy="70%" r="1.5"
              fill={isDarkMode ? '#22d3ee' : '#0891b2'}
              opacity="0.5"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            />
          </svg>
        </div>

        {/* Floating glass orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-32 h-32 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${isDarkMode ? '#60a5fa' : '#2563eb'}40, transparent)`,
              filter: 'blur(20px)',
              top: '20%',
              left: '10%'
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-24 h-24 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${isDarkMode ? '#22d3ee' : '#0891b2'}40, transparent)`,
              filter: 'blur(15px)',
              top: '60%',
              right: '15%'
            }}
            animate={{
              y: [0, 15, 0],
              x: [0, -15, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-16 pt-24">
          {/* Enhanced Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/">
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground rounded-full px-6 py-3 backdrop-blur-xl bg-card/60 border border-border/50 hover:bg-card/80 transition-all duration-300 hover:scale-105"
              >
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
            className="max-w-5xl mx-auto"
          >
            {/* Enhanced Header */}
            <div className="text-center mb-20 relative">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 flex items-center justify-center gap-4"
              >
                <motion.div
                  className="p-4 rounded-2xl backdrop-blur-xl bg-card/60 border border-border/50"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-4xl">🔒</span>
                </motion.div>
                <span className="text-xl text-muted-foreground font-medium">
                  Your privacy matters
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-5xl sm:text-7xl font-bold mb-8 text-foreground tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent"
              >
                Privacy Policy
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-8 max-w-3xl mx-auto"
              >
                <p className="text-xl text-muted-foreground leading-relaxed mb-4">
                  We're committed to protecting your privacy and being transparent about how we handle your data.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {lastUpdated}</span>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Privacy Overview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid md:grid-cols-3 gap-8 mb-20"
            >
              {[
                {
                  icon: Shield,
                  color: 'text-green-500',
                  title: 'Data Protection',
                  description: 'Industry-standard encryption and security measures protect your information'
                },
                {
                  icon: Eye,
                  color: 'text-blue-500',
                  title: 'Full Transparency',
                  description: 'Clear, honest information about what we collect and why we need it'
                },
                {
                  icon: Users,
                  color: 'text-purple-500',
                  title: 'Your Control',
                  description: 'You own your data and can access, modify, or delete it anytime'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center p-8 backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl hover-lift group"
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl backdrop-blur-xl bg-card/80 border border-border/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 10 }}
                  >
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content Sections with enhanced glass */}
            <div className="space-y-16">
              
              {/* Information We Collect */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="backdrop-blur-xl bg-card/60 border border-border/50 p-10 rounded-3xl"
              >
                <div className="flex items-center mb-8">
                  <div className="p-3 rounded-xl backdrop-blur-xl bg-card/80 border border-border/50 mr-4">
                    <Server className="w-7 h-7 text-blue-500" />
                  </div>
                  <h2 className="text-3xl font-bold">Information We Collect</h2>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="backdrop-blur-xl bg-card/40 border border-border/30 p-6 rounded-2xl">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Account Information
                      </h3>
                      <ul className="text-muted-foreground space-y-3">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Email address (for account creation and communication)
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Username and profile information
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Profile pictures and custom content you upload
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Social media links and bio information
                        </li>
                      </ul>
                    </div>
                    
                    <div className="backdrop-blur-xl bg-card/40 border border-border/30 p-6 rounded-2xl">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-orange-500 mr-2" />
                        Usage Data
                      </h3>
                      <ul className="text-muted-foreground space-y-3">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Page views and click analytics on your SocioLink
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Device and browser information
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          IP address and general location (city/country level)
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          How you interact with our platform
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-red-500">
                      <XCircle className="w-5 h-5 mr-2" />
                      What We DON'T Collect
                    </h3>
                    <ul className="text-muted-foreground space-y-3">
                      <li className="flex items-start">
                        <XCircle className="w-4 h-4 text-red-500 mt-1 mr-3 flex-shrink-0" />
                        Passwords (we use secure OAuth)
                      </li>
                      <li className="flex items-start">
                        <XCircle className="w-4 h-4 text-red-500 mt-1 mr-3 flex-shrink-0" />
                        Personal messages or private content
                      </li>
                      <li className="flex items-start">
                        <XCircle className="w-4 h-4 text-red-500 mt-1 mr-3 flex-shrink-0" />
                        Data from your linked social accounts beyond public info
                      </li>
                      <li className="flex items-start">
                        <XCircle className="w-4 h-4 text-red-500 mt-1 mr-3 flex-shrink-0" />
                        Financial or payment information
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* How We Use Your Information */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="backdrop-blur-xl bg-card/60 border border-border/50 p-10 rounded-3xl"
              >
                <div className="flex items-center mb-8">
                  <div className="p-3 rounded-xl backdrop-blur-xl bg-card/80 border border-border/50 mr-4">
                    <Lock className="w-7 h-7 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold">How We Use Your Information</h2>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="backdrop-blur-xl bg-green-500/10 border border-green-500/20 p-8 rounded-2xl">
                    <h3 className="text-2xl font-semibold mb-6 text-green-500 flex items-center">
                      <CheckCircle className="w-6 h-6 mr-3" />
                      What We Do
                    </h3>
                    <ul className="text-muted-foreground space-y-4">
                      {[
                        'Provide and improve our service',
                        'Show you analytics about your links',
                        'Send important account updates',
                        'Prevent spam and abuse',
                        'Respond to your support requests'
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 + index * 0.1 }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 p-8 rounded-2xl">
                    <h3 className="text-2xl font-semibold mb-6 text-red-500 flex items-center">
                      <XCircle className="w-6 h-6 mr-3" />
                      What We Don't Do
                    </h3>
                    <ul className="text-muted-foreground space-y-4">
                      {[
                        'Sell your data to third parties',
                        'Send promotional emails without consent',
                        'Track you across other websites',
                        'Share personal info with advertisers',
                        'Use your data for AI training'
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                        >
                          <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Your Rights */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="backdrop-blur-xl bg-card/60 border border-border/50 p-10 rounded-3xl"
              >
                <div className="flex items-center mb-8">
                  <div className="p-3 rounded-xl backdrop-blur-xl bg-card/80 border border-border/50 mr-4">
                    <Shield className="w-7 h-7 text-orange-500" />
                  </div>
                  <h2 className="text-3xl font-bold">Your Privacy Rights</h2>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="backdrop-blur-xl bg-card/40 border border-border/30 p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <Users className="w-6 h-6 text-blue-500 mr-3" />
                      You Can Always
                    </h3>
                    <ul className="text-muted-foreground space-y-3">
                      {[
                        'Access your personal data',
                        'Update or correct information',
                        'Delete your account and data',
                        'Export your data',
                        'Opt out of marketing emails'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="backdrop-blur-xl bg-card/40 border border-border/30 p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <Clock className="w-6 h-6 text-purple-500 mr-3" />
                      Data Retention
                    </h3>
                    <ul className="text-muted-foreground space-y-3">
                      {[
                        'Account data: Until you delete',
                        'Analytics: 24 months max',
                        'Support tickets: 2 years',
                        'Deleted accounts: 30 day recovery',
                        'Backups: 90 days maximum'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <Clock className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="backdrop-blur-xl bg-card/40 border border-border/30 p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <Download className="w-6 h-6 text-green-500 mr-3" />
                      Data Portability
                    </h3>
                    <ul className="text-muted-foreground space-y-3">
                      {[
                        'Download all your data',
                        'JSON format export',
                        'Profile & analytics data',
                        'Link performance history',
                        'Account activity logs'
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <Download className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Enhanced Contact Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-center backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border border-border/50 p-12 rounded-3xl relative overflow-hidden"
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-8 rounded-3xl backdrop-blur-xl bg-card/80 border border-border/50 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Mail className="w-10 h-10 text-blue-500" />
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold mb-6">Questions About Privacy?</h2>
                  
                  <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                    We're here to help. If you have any questions about this privacy policy or how we handle your data, 
                    don't hesitate to reach out.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="lg" 
                        className="px-8 py-4 rounded-2xl text-lg font-medium hover-lift backdrop-blur-xl border-0"
                        style={{
                          background: `linear-gradient(135deg, ${isDarkMode ? '#60a5fa' : '#2563eb'}, ${isDarkMode ? '#22d3ee' : '#0891b2'})`,
                          color: '#ffffff',
                        }}
                      >
                        <Mail className="w-5 h-5 mr-3" />
                        Contact Support
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/about">
                        <Button 
                          variant="ghost" 
                          size="lg" 
                          className="px-8 py-4 rounded-2xl text-lg font-medium backdrop-blur-xl bg-card/60 border border-border/50 hover:bg-card/80"
                        >
                          Learn More About Us
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                  
                  <div className="mt-8 backdrop-blur-xl bg-card/40 border border-border/30 rounded-2xl p-6 max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      privacy@sociolink.com
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Response within 48 hours
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}