'use client'

import { ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/app/components/header'

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The short version: use SocioLink responsibly, and we&apos;ll take care of the rest.
            </p>
          </header>

          <div className="space-y-12 text-[15px] leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold mb-4">Acceptance</h2>
              <p className="text-muted-foreground">
                By using SocioLink, you agree to these terms. If you disagree, please don&apos;t use the service. We&apos;ll notify you 30 days before any changes — continued use after that means you accept them.
              </p>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">What you can do</h2>
              <ul className="text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                <li>Create and customize your profile</li>
                <li>Share your links across platforms</li>
                <li>Use analytics to track performance</li>
                <li>Connect multiple social accounts</li>
                <li>Customize themes and appearance</li>
                <li>Use SocioLink for personal or business</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">What you can&apos;t do</h2>
              <ul className="text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                <li>Share illegal, harmful, or offensive content</li>
                <li>Impersonate others or create fake profiles</li>
                <li>Spam or harass other users</li>
                <li>Attempt to hack or compromise the service</li>
                <li>Violate copyright or intellectual property</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">Your content</h2>
              <p className="text-muted-foreground">
                You own everything you upload. We don&apos;t claim ownership of your data. You grant us a license to display it on the platform, and you can delete it anytime.
              </p>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">Account &amp; security</h2>
              <p className="text-muted-foreground mb-4">
                You&apos;re responsible for keeping your account secure. Report suspicious activity immediately and we&apos;ll help with legitimate recovery requests.
              </p>
              <ul className="text-muted-foreground space-y-2 ml-4 list-disc list-inside">
                <li>You can delete your account anytime</li>
                <li>We may suspend accounts that violate these terms</li>
                <li>30-day notice before any service termination</li>
                <li>Data export is always available before deletion</li>
              </ul>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">Service availability</h2>
              <p className="text-muted-foreground">
                We aim for 99.9% uptime but can&apos;t guarantee 100%. The service is provided &quot;as is.&quot; We&apos;re not liable for indirect damages, and maximum liability equals any fees you&apos;ve paid.
              </p>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="text-xl font-semibold mb-4">Disputes</h2>
              <p className="text-muted-foreground">
                We prefer resolving issues through conversation. If needed, disputes go through binding arbitration. Reach out before considering legal action.
              </p>
            </section>

            <hr className="border-border" />

            <section className="bg-muted/50 border border-border rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-3">Questions?</h2>
              <p className="text-muted-foreground mb-6">
                Contact us at <span className="text-foreground font-medium">legal@sociolink.com</span> — we respond within 48 hours.
              </p>
              <div className="flex gap-3">
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Link href="/privacy">
                  <Button variant="outline">Privacy Policy</Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}