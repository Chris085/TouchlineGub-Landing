import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white p-6 relative overflow-hidden">
      <Helmet>
        <title>Privacy Policy | Touchline Hub</title>
        <meta name="description" content="Read the Touchline Hub Privacy Policy. Learn what information we collect, how we securely store and process it using Google Firebase/Stripe, and how we respect your privacy rights." />
        <link rel="canonical" href="https://touchlinehub.com/privacy" />
        <meta property="og:title" content="Privacy Policy | Touchline Hub" />
        <meta property="og:description" content="Read the Touchline Hub Privacy Policy. Learn what information we collect, how we securely store and process it using Google Firebase/Stripe, and how we respect your privacy rights." />
        <meta property="og:url" content="https://touchlinehub.com/privacy" />
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
          <h1 className="text-3xl md:text-4xl font-black uppercase font-display mb-2 text-white">Touchline Hub Privacy Policy</h1>
          <p className="text-pitch-green font-medium mb-12">Last Updated: June 2026</p>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">Introduction</h2>
              <p className="mb-4">Touchline Hub ("we", "our", "us") respects your privacy and is committed to protecting your personal information.</p>
              <p className="mb-4">This Privacy Policy explains what information we collect, how we use it, and the choices available to you.</p>
              <p>By using Touchline Hub, you agree to the collection and use of information in accordance with this policy.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">Information We Collect</h2>
              
              <h3 className="text-lg font-bold text-white mt-6 mb-3">Account Information</h3>
              <p className="mb-4">When you create an account, we may collect:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Account credentials</li>
                <li>Team information</li>
              </ul>
              <p className="mb-6">If you register using Google Sign-In, we may receive information provided by Google, including your name, email address, and profile picture.</p>

              <h3 className="text-lg font-bold text-white mt-6 mb-3">Team and Player Information</h3>
              <p className="mb-4">Touchline Hub allows coaches and team administrators to store and manage information relating to their team, including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Team names</li>
                <li>Player names</li>
                <li>Attendance records</li>
                <li>Match information</li>
                <li>Coaching notes</li>
                <li>Squad management data</li>
              </ul>
              <p className="mb-6">You are responsible for ensuring that any information entered into the platform is lawful and accurate.</p>

              <h3 className="text-lg font-bold text-white mt-6 mb-3">Usage Information</h3>
              <p className="mb-4">We may automatically collect information about how the platform is used, including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Device information</li>
                <li>Browser information</li>
                <li>Log data</li>
                <li>Application usage information</li>
                <li>Error and diagnostic information</li>
              </ul>
              <p className="mb-6">This helps us improve the service and resolve technical issues.</p>

              <h3 className="text-lg font-bold text-white mt-6 mb-3">Payments</h3>
              <p className="mb-4">Touchline Hub does not store payment card information.</p>
              <p className="mb-4">Subscription payments are processed securely through Stripe.</p>
              <p>When making payments, your information is subject to Stripe's Privacy Policy and Terms of Service.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">How We Use Your Information</h2>
              <p className="mb-4">We use collected information to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Create and manage accounts</li>
                <li>Deliver the Touchline Hub service</li>
                <li>Provide customer support</li>
                <li>Improve platform performance and functionality</li>
                <li>Process subscriptions</li>
                <li>Communicate important account information</li>
                <li>Maintain platform security</li>
              </ul>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">Data Storage</h2>
              <p className="mb-4">Touchline Hub uses trusted third-party providers including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Google Firebase</li>
                <li>Google Cloud Platform</li>
                <li>Stripe</li>
              </ul>
              <p className="mb-4">Data may be stored and processed in locations outside your country of residence.</p>
              <p>We take reasonable steps to ensure that your information is handled securely.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">Data Retention</h2>
              <p className="mb-4">We retain information only for as long as necessary to provide the service and comply with legal obligations.</p>
              <p>If your account is closed, certain information may be retained where required for legal, accounting, security, or operational purposes.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">Your Rights</h2>
              <p className="mb-4">Depending on your location, you may have rights regarding your personal data, including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access to your information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
              </ul>
              <p>Requests may be submitted using the contact information below.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">Children's Data</h2>
              <p className="mb-4">Touchline Hub may be used by coaches managing teams that include players under the age of 18.</p>
              <p className="mb-4">Coaches and team administrators are responsible for ensuring they have any permissions or consents required to manage player information.</p>
              <p>Touchline Hub is not intended for direct use by children without appropriate adult supervision.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">Security</h2>
              <p className="mb-4">We take reasonable technical and organisational measures to protect personal information.</p>
              <p>However, no internet-based service can guarantee absolute security.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">Third-Party Services</h2>
              <p className="mb-4">Touchline Hub integrates with third-party services including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Google Authentication</li>
                <li>Firebase</li>
                <li>Google Cloud Platform</li>
                <li>Stripe</li>
              </ul>
              <p>These providers maintain their own privacy policies and terms.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">Changes to This Privacy Policy</h2>
              <p className="mb-4">We may update this Privacy Policy from time to time.</p>
              <p className="mb-4">Updated versions will be published on our website and within the platform where appropriate.</p>
              <p>Continued use of Touchline Hub after updates constitutes acceptance of the revised policy.</p>
            </section>

            <hr className="border-slate-800" />

            <section>
              <h2 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">Contact</h2>
              <p className="mb-4">For privacy-related questions or requests, please contact:</p>
              <p className="mb-2"><a href="mailto:support@touchlinehub.com" className="text-pitch-green hover:underline">support@touchlinehub.com</a></p>
              <p>or</p>
              <p className="mt-2"><a href="https://touchlinehub.com" className="text-pitch-green hover:underline">https://touchlinehub.com</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
