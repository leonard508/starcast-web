'use client'

import React, { useState } from 'react'
import { DataCategory, ProcessingPurpose, LegalBasis, ConsentManager } from '@/lib/compliance/popi-compliance'

interface ConsentFormData {
  dataCategory: DataCategory
  processingPurpose: ProcessingPurpose
  legalBasis: LegalBasis
  required: boolean
  title: string
  description: string
  consentGiven: boolean
}

interface PrivacyConsentProps {
  onConsentComplete: (consents: ConsentFormData[]) => void
  userType: 'customer' | 'business'
}

const CUSTOMER_CONSENTS: ConsentFormData[] = [
  {
    dataCategory: DataCategory.PERSONAL_IDENTIFIER,
    processingPurpose: ProcessingPurpose.SERVICE_PROVISION,
    legalBasis: LegalBasis.CONTRACT,
    required: true,
    title: 'Personal Information for Service Provision',
    description: 'We need your name and ID number to set up your internet service account and verify your identity as required by South African law.',
    consentGiven: false
  },
  {
    dataCategory: DataCategory.CONTACT_INFO,
    processingPurpose: ProcessingPurpose.SERVICE_PROVISION,
    legalBasis: LegalBasis.CONTRACT,
    required: true,
    title: 'Contact Information for Service Delivery',
    description: 'Your phone number, email, and address are required to deliver internet services, send important notifications, and provide customer support.',
    consentGiven: false
  },
  {
    dataCategory: DataCategory.CONTACT_INFO,
    processingPurpose: ProcessingPurpose.CUSTOMER_SUPPORT,
    legalBasis: LegalBasis.CONSENT,
    required: true,
    title: 'Communication for Customer Support',
    description: 'We will use your contact details to provide technical support, service updates, and respond to your queries via phone, email, or WhatsApp.',
    consentGiven: false
  },
  {
    dataCategory: DataCategory.FINANCIAL_DATA,
    processingPurpose: ProcessingPurpose.BILLING_PAYMENT,
    legalBasis: LegalBasis.CONTRACT,
    required: true,
    title: 'Financial Information for Billing',
    description: 'We process payment information through secure payment gateways (like Ozow) to collect monthly service fees and process refunds.',
    consentGiven: false
  },
  {
    dataCategory: DataCategory.COMMUNICATION_DATA,
    processingPurpose: ProcessingPurpose.LEGAL_COMPLIANCE,
    legalBasis: LegalBasis.LEGAL_OBLIGATION,
    required: true,
    title: 'Communication Records (RICA Compliance)',
    description: 'South African law (RICA Act) requires us to keep records of communications for regulatory compliance and security purposes.',
    consentGiven: false
  },
  {
    dataCategory: DataCategory.CONTACT_INFO,
    processingPurpose: ProcessingPurpose.MARKETING,
    legalBasis: LegalBasis.CONSENT,
    required: false,
    title: 'Marketing Communications (Optional)',
    description: 'Receive promotional offers, new service announcements, and special deals via email or WhatsApp. You can opt out at any time.',
    consentGiven: false
  }
]

export default function PrivacyConsent({ onConsentComplete, userType }: PrivacyConsentProps) {
  const [consents, setConsents] = useState<ConsentFormData[]>(CUSTOMER_CONSENTS)
  const [showFullPolicy, setShowFullPolicy] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)

  const handleConsentChange = (index: number, granted: boolean) => {
    const updatedConsents = [...consents]
    updatedConsents[index].consentGiven = granted
    setConsents(updatedConsents)
  }

  const allRequiredConsentsGiven = consents
    .filter(c => c.required)
    .every(c => c.consentGiven)

  const handleSubmit = () => {
    if (!allRequiredConsentsGiven || !agreedToTerms || !agreedToPrivacy) {
      alert('Please provide all required consents and agree to the terms to continue.')
      return
    }

    onConsentComplete(consents)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Privacy Notice & Consent
        </h2>
        <p className="text-gray-600">
          In compliance with the Protection of Personal Information Act (POPI Act) and 
          Regulation of Interception of Communications Act (RICA), we need your consent 
          for processing your personal information.
        </p>
      </div>

      {/* Data Protection Summary */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">🛡️ Your Data Protection Rights</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Your data is encrypted and securely stored</li>
          <li>✓ You can access, correct, or delete your data at any time</li>
          <li>✓ We only use your data for the purposes you agree to</li>
          <li>✓ You can withdraw consent for non-essential processing</li>
          <li>✓ We comply with South African data protection laws</li>
        </ul>
      </div>

      {/* Consent Items */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Data Processing Consents</h3>
        
        {consents.map((consent, index) => (
          <div 
            key={`${consent.dataCategory}-${consent.processingPurpose}`}
            className={`p-4 border rounded-lg ${
              consent.required ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id={`consent-${index}`}
                checked={consent.consentGiven}
                onChange={(e) => handleConsentChange(index, e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label 
                  htmlFor={`consent-${index}`}
                  className="block text-sm font-medium text-gray-900 cursor-pointer"
                >
                  {consent.title}
                  {consent.required && (
                    <span className="text-orange-600 ml-1">*</span>
                  )}
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  {consent.description}
                </p>
                <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                  <span>Legal Basis: {consent.legalBasis.replace('_', ' ')}</span>
                  <span>Purpose: {consent.processingPurpose.replace('_', ' ')}</span>
                  {!consent.required && (
                    <span className="text-blue-600">Optional</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Terms and Privacy Policy Agreement */}
      <div className="space-y-4 mb-6 p-4 border border-gray-300 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Legal Agreements</h3>
        
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms-agreement"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="terms-agreement" className="flex-1 text-sm text-gray-700 cursor-pointer">
            I agree to the{' '}
            <a href="/terms-of-service" target="_blank" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and understand the service conditions <span className="text-red-600">*</span>
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="privacy-agreement"
            checked={agreedToPrivacy}
            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="privacy-agreement" className="flex-1 text-sm text-gray-700 cursor-pointer">
            I acknowledge that I have read and understand the{' '}
            <button
              type="button"
              onClick={() => setShowFullPolicy(!showFullPolicy)}
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </button>{' '}
            <span className="text-red-600">*</span>
          </label>
        </div>
      </div>

      {/* Full Privacy Policy */}
      {showFullPolicy && (
        <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 max-h-64 overflow-y-auto">
          <h4 className="font-semibold mb-2">Starcast ISP Privacy Policy Summary</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Data Controller:</strong> Starcast Technologies (Pty) Ltd</p>
            <p><strong>Contact:</strong> privacy@starcast.co.za</p>
            
            <h5 className="font-medium mt-3">What data we collect:</h5>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Personal identifiers (name, ID number)</li>
              <li>Contact information (phone, email, address)</li>
              <li>Financial data for billing (processed securely via Ozow)</li>
              <li>Communication records (as required by RICA)</li>
              <li>Service usage data</li>
            </ul>

            <h5 className="font-medium mt-3">How we protect your data:</h5>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>AES-256 encryption for sensitive data</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits</li>
              <li>Limited access on need-to-know basis</li>
              <li>Compliance with POPI Act requirements</li>
            </ul>

            <h5 className="font-medium mt-3">Your rights:</h5>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request data deletion (subject to legal obligations)</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Lodge complaints with the Information Regulator</li>
            </ul>

            <h5 className="font-medium mt-3">Data retention:</h5>
            <p>We retain your data for as long as you remain our customer, plus 7 years for financial records as required by law, and 3 years for communication records as required by RICA.</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="text-red-600">*</span> Required consents and agreements
        </div>
        <button
          onClick={handleSubmit}
          disabled={!allRequiredConsentsGiven || !agreedToTerms || !agreedToPrivacy}
          className={`px-6 py-3 rounded-lg font-medium ${
            allRequiredConsentsGiven && agreedToTerms && agreedToPrivacy
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue with Registration
        </button>
      </div>

      {/* Contact Information */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <p>
          <strong>Data Protection Questions?</strong> Contact our Data Protection Officer at{' '}
          <a href="mailto:privacy@starcast.co.za" className="text-blue-600 hover:underline">
            privacy@starcast.co.za
          </a>{' '}
          or call 087 250 2788
        </p>
        <p className="mt-1">
          <strong>Information Regulator:</strong> You have the right to lodge a complaint with the South African Information Regulator at{' '}
          <a href="https://www.justice.gov.za/inforeg/" target="_blank" className="text-blue-600 hover:underline">
            www.justice.gov.za/inforeg
          </a>
        </p>
      </div>
    </div>
  )
}