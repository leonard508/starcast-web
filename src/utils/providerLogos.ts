// Provider Logo Mapping Utility
// Maps provider names to their logo file paths

export const providerLogos: Record<string, string> = {
  // Existing logos
  'frogfoot': '/assets/providers/frogfoot.svg',
  'vumatel': '/assets/providers/vumatel.svg',
  'openserve': '/assets/providers/openserve.svg',
  
  // Additional providers - you can add more logos here
  'vuma': '/assets/providers/vuma.svg',
  'octotel': '/assets/providers/octotel.svg',
  'tt-connect': '/assets/providers/tt-connect.svg',
  'mitsol': '/assets/providers/mitsol.svg',
  'evotel': '/assets/providers/evotel.svg',
  'thinkspeed': '/assets/providers/thinkspeed.svg',
  'clearaccess': '/assets/providers/clearaccess.svg',
  'dnatel': '/assets/providers/dnatel.svg',
  'vodacom': '/assets/providers/vodacom.svg',
  'link-layer': '/assets/providers/link-layer.svg',
  'metrofibre-nexus': '/assets/providers/metrofibre-nexus.svg',
  'metrofibre-nova': '/assets/providers/metrofibre-nova.svg',
  'connectivity-services---steyn-city': '/assets/providers/steyn-city.svg',
  'zoom-fibre': '/assets/providers/zoom-fibre.svg',
  'netstream': '/assets/providers/netstream.svg',
  'lightstruck---zinkwazi-glenwood': '/assets/providers/lightstruck.svg',
  'port-edward---paarl---hermanus---greytown': '/assets/providers/pphg.svg',
}

// Function to get logo for a provider
export function getProviderLogo(providerName: string, providerSlug?: string): string {
  // First try by slug (more reliable)
  if (providerSlug && providerLogos[providerSlug]) {
    return providerLogos[providerSlug]
  }
  
  // Then try by name (case insensitive)
  const normalizedName = providerName.toLowerCase().replace(/\s+/g, '-')
  if (providerLogos[normalizedName]) {
    return providerLogos[normalizedName]
  }
  
  // Try exact name match
  if (providerLogos[providerName]) {
    return providerLogos[providerName]
  }
  
  // Return placeholder if no logo found
  return '/assets/providers/placeholder.svg'
}

// Function to check if a logo exists
export function hasProviderLogo(providerName: string, providerSlug?: string): boolean {
  return getProviderLogo(providerName, providerSlug) !== null
}

// List of providers that need logos
export const providersNeedingLogos = [
  'Vuma',
  'Octotel', 
  'TT Connect',
  'Mitsol',
  'Evotel',
  'Thinkspeed',
  'Clearaccess',
  'DNATel',
  'Vodacom',
  'Link Layer',
  'MetroFibre Nexus',
  'MetroFibre Nova',
  'Connectivity Services - Steyn City',
  'Zoom Fibre',
  'Netstream',
  'Lightstruck - Zinkwazi Glenwood',
  'Port Edward - Paarl - Hermanus - Greytown'
] 