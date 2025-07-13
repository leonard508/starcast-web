import React, { useState, useEffect } from 'react';
import { Wifi, Zap, Shield, Star, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { packageService } from '../services/api';

// Icons
const WifiIcon = () => <Wifi className="w-4 h-4" />;
const ZapIcon = () => <Zap className="w-4 h-4" />;
const ShieldIcon = () => <Shield className="w-4 h-4" />;
const StarIcon = () => <Star className="w-3 h-3" />;
const CheckIcon = () => <Check className="w-4 h-4" />;
const SparklesIcon = () => <Sparkles className="w-4 h-4" />;
const ChevronLeftIcon = () => <ChevronLeft className="w-4 h-4" />;
const ChevronRightIcon = () => <ChevronRight className="w-4 h-4" />;

const ModernFibrePage = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [currentProviderIndex, setCurrentProviderIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFibreData();
  }, []);

  const fetchFibreData = async () => {
    try {
      setLoading(true);
      const response = await packageService.getFibrePackages();
      
      if (response.data && Array.isArray(response.data)) {
        const groupedProviders = groupPackagesByProvider(response.data);
        setProviders(groupedProviders);
        if (groupedProviders.length > 0) {
          setSelectedProvider(groupedProviders[0]);
          setSelectedPackages(groupedProviders[0].packages);
        }
      }
    } catch (err) {
      console.error('Error fetching fibre data:', err);
      setError('Failed to load fibre packages');
      // Use fallback data
      const fallbackProviders = createFallbackProviders();
      setProviders(fallbackProviders);
      if (fallbackProviders.length > 0) {
        setSelectedProvider(fallbackProviders[0]);
        setSelectedPackages(fallbackProviders[0].packages);
      }
    } finally {
      setLoading(false);
    }
  };

  const groupPackagesByProvider = (packages) => {
    const grouped = {};
    packages.forEach(pkg => {
      const provider = pkg.provider || 'Unknown';
      if (!grouped[provider]) {
        grouped[provider] = {
          id: provider.toLowerCase().replace(/\s+/g, ''),
          name: provider,
          packages: []
        };
      }
      grouped[provider].packages.push({
        ...pkg,
        type: getPackageType(pkg.price || 0),
        popular: pkg.price && pkg.price > 800 && pkg.price < 1200
      });
    });
    return Object.values(grouped);
  };

  const createFallbackProviders = () => [
    {
      id: 'openserve',
      name: 'Openserve',
      packages: [
        {
          id: 'os-25',
          name: '25Mbps Uncapped',
          download: '25',
          upload: '25',
          price: 599,
          type: 'standard',
          features: ['Uncapped', 'No Shaping', '24/7 Support']
        },
        {
          id: 'os-50',
          name: '50Mbps Uncapped',
          download: '50',
          upload: '50',
          price: 899,
          promoPrice: 799,
          hasPromo: true,
          promoText: 'Save R100/month',
          type: 'premium',
          features: ['Uncapped', 'No Shaping', '24/7 Support', 'Gaming Optimized']
        },
        {
          id: 'os-100',
          name: '100Mbps Uncapped',
          download: '100',
          upload: '100',
          price: 1299,
          type: 'ultra',
          popular: true,
          features: ['Uncapped', 'No Shaping', '24/7 Support', 'Gaming Optimized', 'Static IP Option']
        }
      ]
    },
    {
      id: 'vuma',
      name: 'Vuma',
      packages: [
        {
          id: 'v-50',
          name: '50Mbps Premium',
          download: '50',
          upload: '25',
          price: 849,
          type: 'premium',
          popular: true,
          features: ['Uncapped', 'Premium Support', 'Wi-Fi 6 Router']
        }
      ]
    }
  ];

  const getPackageType = (price) => {
    if (price < 500) return 'basic';
    if (price < 800) return 'standard';
    if (price < 1200) return 'premium';
    return 'ultra';
  };

  const handleProviderChange = (provider, index) => {
    setSelectedProvider(provider);
    setSelectedPackages(provider.packages);
    setCurrentProviderIndex(index);
  };

  const handlePrevProvider = () => {
    const newIndex = currentProviderIndex > 0 ? currentProviderIndex - 1 : providers.length - 1;
    handleProviderChange(providers[newIndex], newIndex);
  };

  const handleNextProvider = () => {
    const newIndex = currentProviderIndex < providers.length - 1 ? currentProviderIndex + 1 : 0;
    handleProviderChange(providers[newIndex], newIndex);
  };

  const handlePackageSelect = (pkg) => {
    console.log('Selected package:', pkg);
    // Navigate to signup or handle selection
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-sand-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading fibre packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-sand-50 to-stone-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-sand-500/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sand-500/5 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 text-sm font-medium text-primary-700 mb-6">
              <SparklesIcon />
              Uncapped Fibre Internet
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-sand-600 bg-clip-text text-transparent mb-6">
              Lightning Fast
              <span className="block text-4xl md:text-6xl mt-2">Fibre Internet</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-600 mb-8 leading-relaxed">
              Installed within 7 days. For home and business.
              <span className="block mt-2 text-lg">Pro rata rates apply. No contracts required.</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-sage-600">
                <ShieldIcon />
                No Setup Fees
              </div>
              <div className="flex items-center gap-2 text-primary-600">
                <ZapIcon />
                Ultra Low Latency
              </div>
              <div className="flex items-center gap-2 text-sand-600">
                <WifiIcon />
                Free Installation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Selection */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Choose Your Fibre Network
            </h2>
            <p className="text-lg text-stone-600">
              Select from South Africa's leading fibre network providers
            </p>
          </div>

          {/* Provider Selector - Desktop */}
          <div className="hidden md:flex justify-center gap-6 mb-12">
            {providers.map((provider, index) => (
              <Card
                key={provider.id}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  selectedProvider?.id === provider.id
                    ? 'ring-2 ring-primary-500 shadow-lg bg-gradient-to-br from-white to-primary-50'
                    : 'hover:bg-stone-50 shadow-md'
                }`}
                onClick={() => handleProviderChange(provider, index)}
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-10 mx-auto mb-4 bg-stone-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-semibold text-stone-700">{provider.name}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-800">
                      {provider.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Provider Selector - Mobile */}
          <div className="md:hidden relative max-w-sm mx-auto mb-12">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md"
              onClick={handlePrevProvider}
            >
              <ChevronLeftIcon />
            </Button>

            <div className="overflow-hidden mx-12">
              <div className="flex transition-transform duration-500 ease-in-out">
                <Card className="flex-none w-full bg-gradient-to-br from-white to-primary-50 border-primary-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-20 h-12 mx-auto mb-4 bg-stone-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-stone-700">{selectedProvider?.name}</span>
                      </div>
                      <h3 className="text-xl font-bold text-stone-800">
                        {selectedProvider?.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md"
              onClick={handleNextProvider}
            >
              <ChevronRightIcon />
            </Button>
          </div>

          {/* Provider Indicators - Mobile */}
          <div className="md:hidden flex justify-center gap-2 mb-8">
            {providers.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentProviderIndex
                    ? 'bg-primary-500 w-8'
                    : 'bg-stone-300 hover:bg-stone-400'
                }`}
                onClick={() => handleProviderChange(providers[index], index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Package Grid */}
      <section className="py-16 bg-gradient-to-br from-stone-100/30 to-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              {selectedProvider?.name} Packages
            </h2>
            <p className="text-lg text-stone-600">
              Choose the perfect speed for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {selectedPackages.map((pkg, index) => (
              <Card
                key={pkg.id}
                className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group ${
                  pkg.popular ? 'ring-2 ring-primary-500 shadow-lg' : 'shadow-md hover:shadow-lg'
                }`}
                onClick={() => handlePackageSelect(pkg)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary-500 text-white shadow-md">
                      <StarIcon className="mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {pkg.hasPromo && (
                  <div className="absolute -top-2 -right-2 bg-sand-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md animate-pulse">
                    PROMO
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-stone-800 mb-2">{pkg.name}</h3>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-stone-800">
                          {pkg.download}
                        </div>
                        <div className="text-xs text-stone-500">Mbps Down</div>
                      </div>
                      <div className="text-stone-400 text-lg">/</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-stone-800">
                          {pkg.upload}
                        </div>
                        <div className="text-xs text-stone-500">Mbps Up</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      {pkg.hasPromo ? (
                        <div>
                          <div className="text-sm text-stone-500 line-through">
                            R{pkg.price}
                          </div>
                          <div className="text-3xl font-bold text-primary-600">
                            R{pkg.promoPrice}
                          </div>
                        </div>
                      ) : (
                        <div className="text-3xl font-bold text-stone-800">
                          R{pkg.price}
                        </div>
                      )}
                      <div className="text-sm text-stone-500">/month</div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {pkg.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-2 text-sm text-stone-600">
                          <CheckIcon className="text-sage-500 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      variant={pkg.popular ? 'default' : 'outline'}
                    >
                      Choose Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPackages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-stone-200 rounded-full flex items-center justify-center">
                <WifiIcon className="w-8 h-8 text-stone-500" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-2">
                No packages available
              </h3>
              <p className="text-stone-600">
                Please check back later or contact us for custom solutions.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ModernFibrePage;