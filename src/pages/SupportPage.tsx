import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, HelpCircle, Send, Info, Edit, Loader2, CheckCircle2 } from 'lucide-react';
import { submitSupportQuery, uploadAttachments } from '../lib/queriesService';

export function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileUrl: '',
    queryType: '',
    message: '',
    attachments: null as unknown as FileList
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'file' ? (e.target as HTMLInputElement).files : e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let attachmentData: any[] = [];
      if (formData.attachments && formData.attachments.length > 0) {
        attachmentData = await uploadAttachments(formData.attachments);
      }
      
      const { emailSuccess, errorMessage } = await submitSupportQuery({
        name: formData.name as string,
        email: formData.email as string,
        profileUrl: formData.profileUrl as string,
        queryType: formData.queryType as string,
        message: formData.message as string,
        attachments: attachmentData
      });
      
      if (emailSuccess === false) {
        alert(errorMessage || 'Your query was saved, but the email notification failed. Please ensure SMTP_PASS is a valid App Password (not your normal Google password) and SMTP_USER is correct.');
      } else {
        setShowToast(true);
      }
      
      setFormData({
        name: '',
        email: '',
        profileUrl: '',
        queryType: '',
        message: '',
        attachments: null as unknown as FileList
      });
    } catch (error) {
      console.error('Failed to submit query:', error);
      alert('Failed to submit query. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[200] bg-emerald-900 border border-emerald-500 text-emerald-100 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 max-w-md w-[90%]">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <p className="text-sm font-medium">Your query has been submitted. It will be reviewed, and you will get the answer within 48 hours.</p>
        </div>
      )}

      <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 p-8 md:p-12 text-center text-white">
          <div className="inline-block p-4 bg-white/10 rounded-full border border-white/20 mb-6 backdrop-blur-sm">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help &amp; Support Center</h1>
          <p className="text-xl md:text-2xl mb-2 max-w-3xl mx-auto text-white/90">Get assistance with your Arcade Buddy</p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Report issues, ask questions, or get help from our community</p>
        </div>

        <div className="p-6 md:p-8 space-y-12">
          {/* How can we help */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">How Can We Help You?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-3 mb-4 text-red-400 font-semibold">
                  <AlertCircle className="w-6 h-6" />
                  <h4 className="text-lg">Technical Issues</h4>
                </div>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  Report calculation errors, missing badges, or technical problems with the points system.
                </p>
                <ul className="text-sm space-y-2 text-slate-400 list-disc list-inside ml-2">
                  <li>Points calculation errors</li>
                  <li>Missing badges</li>
                  <li>System malfunctions</li>
                  <li>Data sync issues</li>
                </ul>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-3 mb-4 text-blue-400 font-semibold">
                  <HelpCircle className="w-6 h-6" />
                  <h4 className="text-lg">General Support</h4>
                </div>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  For general inquiries about the Arcade program, join our community platforms for quick assistance.
                </p>
                <ul className="text-sm space-y-2 text-slate-400 list-disc list-inside ml-2">
                  <li>Program questions</li>
                  <li>How-to guides</li>
                  <li>General inquiries</li>
                  <li>Community discussions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-6 flex gap-4 text-blue-200">
            <Info className="w-6 h-6 shrink-0 text-blue-400 mt-1" />
            <div>
              <strong className="font-semibold text-blue-300 flex items-center gap-2 text-lg mb-2">Before Submitting a Query</strong>
              <p className="text-sm leading-relaxed opacity-90">
                Please check our FAQ section below for common questions. For technical issues like missing badges or calculation errors, use the form below with detailed information for faster resolution.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-blue-500/10 rounded-xl text-blue-400 mb-4">
                <Edit className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Submit Your Query</h3>
              <p className="text-sm text-slate-400">Please provide detailed information about the issue you're experiencing</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input 
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input 
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Public Profile URL</label>
                <input 
                  type="url"
                  name="profileUrl"
                  required
                  value={formData.profileUrl}
                  onChange={handleChange}
                  placeholder="https://www.cloudskillsboost.google/public_profiles/PROFILE_ID" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type of Query</label>
                <select 
                  name="queryType"
                  required
                  value={formData.queryType}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="" disabled>Select query type...</option>
                  <option value="Website Glitch">Website Glitch</option>
                  <option value="Content Information">Content Information</option>
                  <option value="Incorrect amount of Arcade Points">Incorrect amount of Arcade Points</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Lab Issue">Lab Issue</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Proof Attachments</label>
                <input 
                  type="file"
                  name="attachments"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Detailed Message</label>
                <textarea 
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your issue in detail. Include badge names, completion dates, or any error messages you encountered..." 
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
                />
                <p className="text-xs text-slate-500 mt-2">The more details you provide, the better we can assist you.</p>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 text-lg"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? 'Submitting...' : 'Submit Query'}
                </button>
              </div>
            </form>
          </div>

          {/* Response Time Section */}
          <div className="bg-[#123123] border border-[#166534] rounded-xl p-8 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl">⏱️</span>
              <h4 className="text-xl font-semibold text-emerald-50">Response Time</h4>
            </div>
            <p className="text-base text-emerald-100/90 leading-relaxed max-w-3xl mx-auto">
              We strive to respond to all queries within 24-48 hours. For urgent matters, please reach out through our <a href="#" className="text-emerald-400 hover:text-emerald-300 underline font-medium underline-offset-2">Telegram community</a> or <a href="https://chat.whatsapp.com/JRvoPJxMibzLPnqWcASG0I" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline font-medium underline-offset-2">WhatsApp group</a> for faster assistance.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
