import React from 'react';
import { Check, Zap, Shield, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for trying out B.H.I.M.A',
      features: [
        'Basic AI responses',
        'Limited conversation history',
        'Standard response speed',
        'Community support',
      ],
      buttonText: 'Get Started',
      buttonLink: '/bhima',
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'For power users and professionals',
      features: [
        'Advanced AI responses',
        'Unlimited conversation history',
        'Priority response speed',
        'Email support',
        'Custom AI models',
        'API access',
      ],
      buttonText: 'Start Free Trial',
      buttonLink: '/bhima',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'All Pro features',
        'Dedicated support',
        'Custom deployment',
        'SLA guarantee',
        'Advanced security',
        'Team management',
        'Custom integrations',
      ],
      buttonText: 'Contact Sales',
      buttonLink: '/contact',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, Transparent
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the plan that's right for you. All plans include our core features.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm ${
                tier.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{tier.price}</span>
                  {tier.period && (
                    <span className="text-gray-500 dark:text-gray-400 ml-1">{tier.period}</span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{tier.description}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={tier.buttonLink}
                className={`block w-full text-center px-4 py-3 rounded-md font-medium ${
                  tier.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-colors`}
              >
                {tier.buttonText}
                {tier.buttonText !== 'Contact Sales' && (
                  <ArrowRight className="inline-block ml-2 h-4 w-4" />
                )}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Can I switch plans later?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, all paid plans come with a 14-day free trial. No credit card required.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 