'use client'

import { ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/app/components/header'

export default function PrivacyPage() {
  const lastUpdated = "June 5, 2025"

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
            <p className="text-sm text-muted-foreground mb-3">Last updated {lastUpdated}</p>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              How we handle your data — no surprises, no fine print tricks.
            </p>
          </header>

          <div className="space-y-12 text-[15px] leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold mb-4">What we collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect only what&apos;s necessary to make SocioLink work for you:
              </p>
              <ul className="text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                <li>Email address for account creation</li>
                <li>Username and profile information you provide</li>
                <li>Profile pictures and content you upload</li>
                <li>Social media links you add</li>
                <li>Basic usage data (page views, clicks)</li>
                <li>Device and browser info for compatibility</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">What we don&apos;t collect</h2>
              <ul className="text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                <li>Passwords — we use secure OAuth</li>
                <li>Private messages or personal content</li>
                <li>Data from your linked social accounts beyond public info</li>
                <li>Financial or payment information</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">How we use it</h2>
              <p className="text-muted-foreground mb-4">Your data helps us:</p>
              <ul className="text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                <li>Run and improve the service</li>
                <li>Show you analytics about your links</li>
                <li>Send important account updates</li>
                <li>Prevent spam and abuse</li>
                <li>Respond to support requests</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We don&apos;t sell your data, send unsolicited marketing, track you across other websites, or share info with advertisers.
              </p>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">Your rights</h2>
              <p className="text-muted-foreground mb-4">You can always:</p>
              <ul className="text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                <li>Access, update, or delete your data</li>
                <li>Export everything in JSON format</li>
                <li>Opt out of marketing emails</li>
                <li>Delete your account entirely</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">Data retention</h2>
              <ul className="text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                <li>Account data kept until you delete it</li>
                <li>Analytics retained for up to 24 months</li>
                <li>Deleted accounts recoverable for 30 days</li>
                <li>Backups purged after 90 days</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section className="bg-muted/50 border border-border rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-3">Questions?</h2>
              <p className="text-muted-foreground mb-6">
                Reach out at <span className="text-foreground font-medium">anikuro@proton.me</span> — we respond within 48 hours.
              </p>
              <div className="flex gap-3">
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Link href="/about">
                  <Button variant="outline">About Us</Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}