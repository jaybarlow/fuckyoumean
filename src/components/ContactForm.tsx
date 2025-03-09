"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { contactFormSchema } from '@/lib/validations/contact';
import { ContactFormValues } from '@/types/forms';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log('Form data:', data);
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
      
      {isSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400"
        >
          Thank you for your message! We'll get back to you soon.
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            className={`w-full px-4 py-2 bg-gray-800/50 border ${errors.name ? 'border-red-500/50' : 'border-gray-700/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white`}
            placeholder="Your name"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-2 bg-gray-800/50 border ${errors.email ? 'border-red-500/50' : 'border-gray-700/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white`}
            placeholder="your.email@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className={`w-full px-4 py-2 bg-gray-800/50 border ${errors.message ? 'border-red-500/50' : 'border-gray-700/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white`}
            placeholder="Your message..."
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
          )}
        </div>
        
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </motion.button>
      </form>
    </div>
  );
} 