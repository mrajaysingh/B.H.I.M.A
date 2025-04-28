import React from 'react';
import { Brain, Shield, Zap, Users, Code, MessageSquare } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">B.H.I.M.A</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            B.H.I.M.A is an advanced AI chat assistant designed to revolutionize the way you interact with artificial intelligence.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Mission</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              At B.H.I.M.A, we're committed to creating an AI assistant that's not just intelligent, but also intuitive, secure, and accessible to everyone. Our mission is to make advanced AI technology available in a way that's both powerful and easy to use.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We believe in the power of conversation and the potential of AI to enhance human capabilities. B.H.I.M.A is designed to be your reliable partner in both professional and personal contexts.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced AI</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Powered by state-of-the-art language models for intelligent and context-aware conversations.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-gray-600 dark:text-gray-300">
                End-to-end encryption and advanced security measures to protect your data.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Optimized for speed and performance, delivering instant responses.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User-Focused</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Designed with user experience in mind, making AI accessible to everyone.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Developer Friendly</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built with modern technologies and easy to integrate into your workflow.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Natural Conversations</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Engage in fluid, natural conversations that feel human-like.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Team</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              B.H.I.M.A is developed by a passionate team of AI researchers, engineers, and designers who are dedicated to pushing the boundaries of what's possible with conversational AI.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our team combines expertise in machine learning, natural language processing, and user experience design to create an AI assistant that's both powerful and user-friendly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 