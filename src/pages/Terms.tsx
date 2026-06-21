import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContactUsModal } from '../components/ContactUsModal';

export function Terms() {
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white p-6 relative overflow-hidden">
      <Helmet>
        <title>Terms and Conditions | Touchline Hub</title>
        <meta name="description" content="Review the Terms and Conditions for Touchline Hub. Learn about our football team management services, subscription plans, free trials, and acceptable usage rules." />
        <link rel="canonical" href="https://touchlinehub.com/terms" />
        <meta property="og:title" content="Terms and Conditions | Touchline Hub" />
        <meta property="og:description" content="Review the Terms and Conditions for Touchline Hub. Learn about our football team management services, subscription plans, free trials, and acceptable usage rules." />
        <meta property="og:url" content="https://touchlinehub.com/terms" />
      </Helmet>

      {/* Background patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,163,74,0.05),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03] pitch-grid" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-black uppercase font-display mb-2 text-white">Touchline Hub Terms and Conditions</h1>
          <p className="text-pitch-green font-medium mb-12">Last Updated: June 2026</p>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">1. Introduction</h2>
              <p className="mb-4">Welcome to Touchline Hub ("we", "our", "us").</p>
              <p className="mb-4">Touchline Hub is a football coaching and team management platform designed to help grassroots football coaches manage teams, players, fixtures, attendance, and matchday activities.</p>
              <p className="mb-4">By creating an account or using Touchline Hub, you agree to these Terms and Conditions.</p>
              <p>If you do not agree with these Terms, please do not use the platform.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">2. Eligibility</h2>
              <p className="mb-4">You must be at least 18 years old to create and manage a Touchline Hub account.</p>
              <p>If you are creating an account on behalf of a football team, club, or organisation, you confirm that you have the authority to do so.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">3. Account Registration</h2>
              <p className="mb-4">You may register using:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Email and password</li>
                <li>Google Sign-In</li>
              </ul>
              <p className="mb-4">When registering through Google, certain information may be provided by Google, including your name and email address.</p>
              <p>You are responsible for maintaining the security of your account and password.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">4. Data Collection</h2>
              <p className="mb-4">Touchline Hub collects and stores information necessary to operate the platform, including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Team information</li>
                <li>Player information entered by coaches</li>
                <li>Usage and account information</li>
              </ul>
              <p className="mb-4">Payment information is not stored by Touchline Hub.</p>
              <p>All payments are securely processed by Stripe and are subject to Stripe's own terms and privacy policies.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">5. Free Trial</h2>
              <p className="mb-4">New teams may be eligible for a free trial period of up to three (3) months.</p>
              <p className="mb-4">The free trial period begins on the date the team account is created.</p>
              <p className="mb-4">At the end of the trial period, continued access to certain features may require an active subscription.</p>
              <p>Touchline Hub reserves the right to modify or withdraw free trial offers at any time.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">6. Subscription Plans</h2>
              <p className="mb-4">Touchline Hub currently offers:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Coach Pass Subscription</li>
                <li>£14.99 per month</li>
              </ul>
              <p className="mb-4">Subscriptions are billed through Stripe.</p>
              <p className="mb-4">By purchasing a subscription, you authorise recurring monthly payments until cancelled.</p>
              <p>Prices may change in the future, but any changes will be communicated in advance.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">7. Cancellation</h2>
              <p className="mb-4">You may cancel your subscription at any time.</p>
              <p className="mb-4">Upon cancellation:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>No future subscription payments will be taken.</li>
                <li>Access to paid features may be restricted at the end of the current billing period.</li>
                <li>Certain read-only access may remain available.</li>
              </ul>
              <p>No long-term contracts apply.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">8. Refund Policy</h2>
              <p className="mb-4">As Touchline Hub provides immediate access to digital services, subscription payments are generally non-refundable.</p>
              <p>Refund requests may be considered on a case-by-case basis where required by law or where exceptional circumstances apply.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">9. Team and Player Data</h2>
              <p className="mb-4">You are responsible for ensuring that any information you enter into Touchline Hub is accurate and that you have the right to store and manage that information.</p>
              <p>Where player information relates to children or minors, you are responsible for obtaining any permissions required by your club, league, organisation, or applicable laws.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">10. Acceptable Use</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Use the platform for unlawful purposes</li>
                <li>Attempt to gain unauthorised access to systems or data</li>
                <li>Upload malicious software or code</li>
                <li>Interfere with the operation of the platform</li>
                <li>Share access credentials with unauthorised users</li>
              </ul>
              <p>We reserve the right to suspend or terminate accounts that breach these Terms.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">11. Availability</h2>
              <p className="mb-4">We aim to provide a reliable service but do not guarantee uninterrupted availability.</p>
              <p>Maintenance, updates, outages, and technical issues may occasionally affect access.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">12. Limitation of Liability</h2>
              <p className="mb-4">Touchline Hub is provided on an "as-is" basis.</p>
              <p className="mb-4">To the fullest extent permitted by law, we shall not be liable for:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Loss of data</li>
                <li>Loss of revenue</li>
                <li>Business interruption</li>
                <li>Indirect or consequential damages</li>
              </ul>
              <p>Our total liability shall not exceed the amount paid by the customer during the preceding twelve months.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">13. Intellectual Property</h2>
              <p className="mb-4">All software, branding, logos, designs, and content relating to Touchline Hub remain the property of Touchline Hub unless otherwise stated.</p>
              <p>You may not copy, modify, distribute, or reproduce any part of the platform without permission.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">14. Changes to These Terms</h2>
              <p className="mb-4">We may update these Terms from time to time.</p>
              <p className="mb-4">Updated versions will be published within the platform or on our website.</p>
              <p>Continued use of Touchline Hub after updates constitutes acceptance of the revised Terms.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">15. Contact</h2>
              <p className="mb-4">For questions regarding these Terms and Conditions, please contact:</p>
              <p className="mb-2">
                <button 
                  type="button"
                  onClick={() => setIsContactOpen(true)} 
                  className="text-pitch-green hover:underline bg-transparent border-0 p-0 text-left cursor-pointer"
                >
                  Contact us
                </button>
              </p>
            </section>
          </div>
        </div>
      </div>

      <ContactUsModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
