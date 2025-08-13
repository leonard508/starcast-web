'use client'
import React, { useEffect, useRef, useState } from 'react'

interface GoogleAddressAutocompleteProps {
  value: string
  onChange: (value: string, place?: any) => void
  placeholder?: string
  name?: string
  required?: boolean
  className?: string
  onPostalCodeExtract?: (postalCode: string) => void
}

declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
    gm_authFailure?: () => void
  }
}

const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Start typing your address...",
  name,
  required = false,
  className = "",
  onPostalCodeExtract
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string>('')

  // Google Maps API key - this should be set in your environment variables
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key not configured')
      return
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeAutocomplete()
      return
    }

    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true

    window.initGoogleMaps = () => {
      setIsLoaded(true)
      initializeAutocomplete()
    }

    // Error handling for Google Maps API
    window.gm_authFailure = () => {
      setError('Google Maps authentication failed. Check API key.')
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
      }
      // Note: We don't remove the script as it might be used by other components
    }
  }, [GOOGLE_MAPS_API_KEY])

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) {
      console.error('Google Maps Places API not loaded')
      return
    }

    try {
      // Create autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current as any, {
        componentRestrictions: { country: 'za' }, // Restrict to South Africa
        fields: ['formatted_address', 'geometry', 'address_components'],
        types: ['address']
      })

      // Set bounds to South Africa
      const southAfricaBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(-34.8, 16.3), // Southwest corner
        new window.google.maps.LatLng(-22.1, 32.9)  // Northeast corner
      )
      autocompleteRef.current.setBounds(southAfricaBounds)

      // Add place selection listener
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace()
        
        if (place && place.formatted_address) {
          onChange(place.formatted_address, place)
          
          // Extract postal code if callback provided
          if (onPostalCodeExtract && place.address_components) {
            const postalCodeComponent = place.address_components.find(
              (component: any) => component.types.includes('postal_code')
            )
            if (postalCodeComponent) {
              onPostalCodeExtract(postalCodeComponent.long_name)
            }
          }

          // Dispatch custom event for other components
          const customEvent = new CustomEvent('starcast_address_selected', {
            detail: { place, formatted_address: place.formatted_address }
          })
          document.dispatchEvent(customEvent)
        }
      })

      setError('')
      console.log('Google Places Autocomplete initialized successfully')
    } catch (err) {
      console.error('Error initializing Google Places Autocomplete:', err)
      setError('Failed to initialize address autocomplete')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  // Fallback styling based on status
  const getInputClassName = () => {
    let baseClassName = className || "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    
    if (error) {
      baseClassName += " border-red-300 focus:ring-red-500"
    } else if (isLoaded) {
      baseClassName += " border-green-300"
    }
    
    return baseClassName
  }

  const getPlaceholder = () => {
    if (error) {
      return "Enter address manually (autocomplete unavailable)"
    }
    if (!isLoaded && GOOGLE_MAPS_API_KEY) {
      return "Loading address autocomplete..."
    }
    return placeholder
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={getPlaceholder()}
        required={required}
        className={getInputClassName()}
        autoComplete="street-address"
      />
      
      {error && (
        <div className="text-xs text-red-600 mt-1 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      {isLoaded && !error && (
        <div className="text-xs text-green-600 mt-1 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Address autocomplete ready
        </div>
      )}
    </div>
  )
}

export default GoogleAddressAutocomplete
