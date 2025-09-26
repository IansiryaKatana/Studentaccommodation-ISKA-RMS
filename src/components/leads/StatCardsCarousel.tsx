import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users, Phone, Calendar, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Lead } from '@/services/api';
import { formatCurrency } from '@/lib/utils';

interface StatCardsCarouselProps {
  leads: Lead[];
  loading: boolean;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isAutoScrolling: boolean;
  setIsAutoScrolling: React.Dispatch<React.SetStateAction<boolean>>;
}

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const StatCardsCarousel: React.FC<StatCardsCarouselProps> = ({ 
  leads, 
  loading, 
  currentIndex,
  setCurrentIndex,
  isAutoScrolling,
  setIsAutoScrolling
}) => {
  const isAutoPlaying = isAutoScrolling;
  const setIsAutoPlaying = setIsAutoScrolling;

  // Calculate stats
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => lead.status === 'new').length;
  const contactedLeads = leads.filter(lead => lead.status === 'contacted').length;
  const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
  const totalRevenue = leads.reduce((sum, lead) => sum + (lead.estimated_revenue || lead.budget || 0), 0);

  const statCards: StatCard[] = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: <Users className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'New Leads',
      value: newLeads,
      icon: <Phone className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Contacted',
      value: contactedLeads,
      icon: <Calendar className="h-6 w-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Converted',
      value: convertedLeads,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || statCards.length <= 4) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= statCards.length - 4 ? 0 : prevIndex + 1
      );
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, statCards.length, setCurrentIndex]);

  const nextSlide = () => {
    if (statCards.length <= 4) return;
    setCurrentIndex(Math.min(currentIndex + 1, statCards.length - 4));
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (statCards.length <= 4) return;
    setCurrentIndex(Math.max(currentIndex - 1, 0));
    setIsAutoPlaying(false);
  };

  const visibleCards = statCards.slice(currentIndex, currentIndex + 4);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (statCards.length === 0) {
    return null;
  }

  return (
    <div className="py-4">
      {/* Cards container - Always show 4 cards */}
      <div className="grid grid-cols-4 gap-4">
        {visibleCards.map((card, index) => (
          <Card 
            key={`${card.title}-${currentIndex + index}`} 
            className="relative overflow-hidden transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <div className={card.color}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </CardContent>
            
            {/* Subtle gradient overlay for modern look */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-gray-50/20 pointer-events-none" />
          </Card>
        ))}
      </div>
      
      {/* Carousel indicators - only show when more than 4 sources */}
      {statCards.length > 4 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.ceil(statCards.length / 4) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / 4) === index 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}
              onClick={() => {
                setCurrentIndex(index * 4);
                setIsAutoPlaying(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { StatCardsCarousel };
