'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/app/components/header'

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-16 pt-24">

          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <header className="mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">About SocioLink</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              One link for everything. Your digital identity, simplified.
            </p>
          </header>

          <div className="space-y-12 text-[15px] leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold mb-4">Why we built this</h2>
              <p className="text-muted-foreground mb-4">
                Managing a dozen social profiles shouldn&apos;t require a dozen links. SocioLink gives you one clean page that connects everything — your socials, your content, your identity.
              </p>
              <p className="text-muted-foreground">
                No clutter, no noise. Just you.
              </p>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">What makes it different</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Mood modes</h3>
                  <p className="text-sm text-muted-foreground">Switch between zen and vibrant to match your style.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Clean by default</h3>
                  <p className="text-sm text-muted-foreground">Minimal design that puts your content first.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Free forever</h3>
                  <p className="text-sm text-muted-foreground">No premium tiers, no paywalls, no catch.</p>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">What we believe in</h2>
              <ul className="text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                <li>Simplicity over complexity</li>
                <li>Privacy by default</li>
                <li>Design that stays out of your way</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="bg-muted/50 border border-border rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-3">Ready to start?</h2>
              <p className="text-muted-foreground mb-6">
                Create your page in under a minute. No credit card, no setup hassle.
              </p>
              <Link href="/">
                <Button>
                  Create Your SocioLink
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}