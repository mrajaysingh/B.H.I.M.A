import React from 'react';
import { Shield, Lock, FileText, AlertCircle } from 'lucide-react';

const Policy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Policies
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Learn about our terms of service, privacy policy, and how we protect your data.
          </p>
        </div>

        {/* Terms of Service */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm mb-8">
          <div className="flex items-center mb-6">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Terms of Service</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing and using B.H.I.M.A, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h3>2. Use License</h3>
            <p>
              Permission is granted to temporarily use B.H.I.M.A for personal, non-commercial transitory viewing only.
            </p>

            <h3>3. User Responsibilities</h3>
            <p>
              Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
            </p>

            <h3>4. Prohibited Uses</h3>
            <p>
              Users may not use B.H.I.M.A for any illegal or unauthorized purpose, including but not limited to:
            </p>
            <ul>
              <li>Violating any laws</li>
              <li>Infringing on intellectual property rights</li>
              <li>Harassing or harming others</li>
              <li>Interfering with the service</li>
            </ul>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm mb-8">
          <div className="flex items-center mb-6">
            <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <h3>1. Information We Collect</h3>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul>
              <li>Account information</li>
              <li>Contact information</li>
              <li>Usage data</li>
              <li>Communication preferences</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Improve user experience</li>
              <li>Communicate with you</li>
              <li>Ensure security</li>
            </ul>

            <h3>3. Data Protection</h3>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Security</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <h3>1. Security Measures</h3>
            <p>
              We employ industry-standard security measures to protect your data, including:
            </p>
            <ul>
              <li>End-to-end encryption</li>
              <li>Regular security audits</li>
              <li>Secure data storage</li>
              <li>Access controls</li>
            </ul>

            <h3>2. Data Retention</h3>
            <p>
              We retain your data only for as long as necessary to provide our services and comply with legal obligations.
            </p>

            <h3>3. Your Rights</h3>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access your personal data</li>
              <li>Request corrections</li>
              <li>Request deletion</li>
              <li>Object to processing</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <p className="mt-2">
            Please note that these policies are subject to change. We recommend checking back periodically for updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy; 