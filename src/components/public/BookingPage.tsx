import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { initializeStripe } from '@/integrations/stripe/client';
import { supabase } from '@/integrations/supabase/client';

const stripePromise = initializeStripe();

// Hero removed per new layout

// Amenities section removed per request

// Video removed per new layout

const CTA = ({ onSubscribe }: { onSubscribe: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  return (
    <section className="py-10 border-t px-4">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h3 className="text-2xl font-bold">Join our newsletter</h3>
        <p className="text-gray-600">Get updates on availability and offers.</p>
        <div className="flex gap-2 max-w-xl mx-auto">
          <Input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={() => onSubscribe(email)} disabled={!email}>Subscribe</Button>
        </div>
      </div>
    </section>
  );
};

const BookingForm: React.FC<{ activeGradeId: string; setActiveGradeId: (id: string) => void; branding: any | null; layoutSettings: any | null }>
  = ({ activeGradeId, setActiveGradeId, branding, layoutSettings }) => {
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [durationId, setDurationId] = useState('');
  const [roomGradeId, setRoomGradeId] = useState('');
  const [planId, setPlanId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [durations, setDurations] = useState<any[]>([]);
  const [roomGrades, setRoomGrades] = useState<any[]>([]);
  const [pricingMatrix, setPricingMatrix] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [mainPhotoIdx, setMainPhotoIdx] = useState<number>(0);
  const [thumbnailStartIdx, setThumbnailStartIdx] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const [durs, grades, pricing, ips] = await Promise.all([
          ApiService.getDurations('student'),
          ApiService.getRoomGrades(),
          ApiService.getPricingMatrix(),
          ApiService.getInstallmentPlans(),
        ]);
        setDurations(durs || []);
        // Sort room grades in descending order by name
        const sortedGrades = (grades || []).slice().sort((a: any, b: any) => {
          return String(b?.name || '').localeCompare(String(a?.name || ''));
        });
        setRoomGrades(sortedGrades);
        setPricingMatrix(pricing || []);
        setPlans((ips || []).filter((p: any) => p.is_active));

                 // Auto-select first tab on load if none selected
         if (!activeGradeId && sortedGrades.length > 0) {
           setActiveGradeId(sortedGrades[0].id);
           setMainPhotoIdx(0);
           setThumbnailStartIdx(0);
         }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const selectedDuration = useMemo(() => durations.find((d) => d.id === durationId), [durations, durationId]);
  const selectedGrade = useMemo(() => roomGrades.find((g) => g.id === (roomGradeId || activeGradeId)), [roomGrades, roomGradeId, activeGradeId]);
  const selectedPlan = useMemo(() => plans.find((p) => p.id === planId), [plans, planId]);

  const weeklyRate = useMemo(() => {
    if (!selectedGrade || !selectedDuration) return 0;
    const match = pricingMatrix.find((p: any) => p.room_grade_id === selectedGrade.id && p.duration_id === selectedDuration.id);
    return match?.weekly_rate_override || selectedGrade.weekly_rate || 0;
  }, [pricingMatrix, selectedGrade, selectedDuration]);

  const totalAmount = useMemo(() => {
    const weeks = selectedDuration?.weeks_count || 0;
    return weeklyRate * weeks;
  }, [weeklyRate, selectedDuration]);

  const depositAmount = useMemo(() => {
    return selectedPlan?.deposit_amount ?? selectedDuration?.deposit_amount ?? 0;
  }, [selectedPlan, selectedDuration]);

  useEffect(() => {
    // lock the form's Room Grade to the active tab
    if (activeGradeId) setRoomGradeId(activeGradeId);
  }, [activeGradeId]);

  // Navigation functions for thumbnail carousel
  const canScrollUp = thumbnailStartIdx > 0;
  const canScrollDown = selectedGrade?.photos && thumbnailStartIdx + 3 < selectedGrade.photos.length;

  const scrollUp = () => {
    if (canScrollUp) {
      setThumbnailStartIdx(prev => prev - 1);
    }
  };

  const scrollDown = () => {
    if (canScrollDown) {
      setThumbnailStartIdx(prev => prev + 1);
    }
  };

  // Get visible thumbnails (3 at a time)
  const visibleThumbnails = selectedGrade?.photos ? 
    selectedGrade.photos.slice(thumbnailStartIdx, thumbnailStartIdx + 3) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast({ title: 'Stripe not ready', variant: 'destructive' });
      return;
    }
    if (!firstName || !lastName || !email || !durationId || !roomGradeId || !planId) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    try {
      // Create real payment intent using configured Stripe secret (test/live based on config)
      // Create PaymentIntent via Edge Function (server-side Stripe secret)
      const { data: pi, error: piErr } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount: Math.round((depositAmount || 0) * 100), currency: 'gbp', customer_email: email },
      });
      if (piErr) throw piErr;
      const clientSecret = pi.client_secret;
      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Card element missing');
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card, billing_details: { email, name: `${firstName} ${lastName}` } },
      });
      if (error) throw new Error(error.message);
      if (paymentIntent.status !== 'succeeded') throw new Error('Payment not completed');

      // Call public booking function
      const { data, error: fnError } = await supabase.functions.invoke('public-booking', {
        body: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          duration_id: durationId,
          room_grade_id: roomGradeId || activeGradeId,
          installment_plan_id: planId,
          total_amount: totalAmount,
          deposit_amount: depositAmount,
          stripe_payment_intent_id: paymentIntent.id,
        },
      });
      if (fnError) throw fnError;
      toast({ title: 'Booking received', description: 'Your deposit has been paid and your booking is recorded.' });
             // Optionally redirect or clear form
       setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setDurationId(''); setRoomGradeId(''); setPlanId(''); setMainPhotoIdx(0); setThumbnailStartIdx(0);
      const cardEl = elements.getElement(CardElement); if (cardEl) cardEl.clear();
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: err?.message || 'Unable to complete booking', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section 
      className="py-10 px-4"
      style={{ backgroundColor: layoutSettings?.page_background || '#ffffff' }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Tabs at very top */}
        <div 
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ backgroundColor: layoutSettings?.tabs_background || '#f8fafc' }}
        >
          {roomGrades.map((g: any) => (
            <Button key={g.id} type="button" variant={g.id === (roomGradeId || activeGradeId) ? 'default' : 'outline'} onClick={() => setActiveGradeId(g.id)}>
              {g.name}
            </Button>
          ))}
        </div>

                 {/* Full-width gallery below tabs */}
         <div 
           className="grid grid-cols-1 md:grid-cols-4"
           style={{ 
             backgroundColor: layoutSettings?.gallery_background || '#ffffff',
             gap: layoutSettings?.thumbnail_gap || '8px'
           }}
         >
          <div 
            className="col-span-1 md:col-span-3 aspect-video bg-gray-100 rounded overflow-hidden"
            style={{ 
              height: layoutSettings?.gallery_height || '400px',
              borderRadius: layoutSettings?.main_image_border_radius || '12px'
            }}
          >
            {selectedGrade?.photos && selectedGrade.photos.length > 0 ? (
              <img src={selectedGrade.photos[mainPhotoIdx]} alt="Room" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No photos</div>
            )}
          </div>
          <div className="col-span-1">
            {/* Mobile: horizontal scroll thumbnails under main image */}
            <div className="flex md:hidden gap-2 overflow-x-auto"> 
              {(selectedGrade?.photos || []).map((p: string, idx: number) => (
                <button
                  type="button"
                  key={idx}
                  className={`w-44 shrink-0 aspect-video rounded overflow-hidden border ${idx === mainPhotoIdx ? 'border-blue-500' : 'border-transparent'}`}
                  style={{ borderRadius: layoutSettings?.thumbnail_border_radius || '8px' }}
                  onClick={() => setMainPhotoIdx(idx)}
                >
                  <img src={p} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

                         {/* Desktop: vertical carousel with navigation arrows */}
             <div className="hidden md:flex md:flex-col md:relative">
               {/* Thumbnails container */}
               <div className="flex flex-col" style={{ gap: layoutSettings?.thumbnail_gap || '8px' }}>
                 {visibleThumbnails.map((p: string, idx: number) => {
                   const actualIdx = thumbnailStartIdx + idx;
                   return (
                     <button
                       type="button"
                       key={actualIdx}
                       className="w-full rounded overflow-hidden border"
                       style={{ 
                         height: `calc((${layoutSettings?.gallery_height || '400px'} - ${layoutSettings?.thumbnail_gap || '8px'} * 2) / 3)`,
                         borderRadius: layoutSettings?.thumbnail_border_radius || '8px',
                         borderColor: actualIdx === mainPhotoIdx ? '#3b82f6' : 'transparent'
                       }}
                       onClick={() => setMainPhotoIdx(actualIdx)}
                     >
                       <img src={p} alt="thumb" className="w-full h-full object-cover" />
                     </button>
                   );
                 })}
               </div>

               {/* Up arrow - positioned absolutely */}
               <button
                 type="button"
                 onClick={scrollUp}
                 disabled={!canScrollUp}
                 className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                   canScrollUp 
                     ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-md' 
                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                 }`}
                 style={{ borderRadius: layoutSettings?.thumbnail_border_radius || '8px' }}
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                 </svg>
               </button>

               {/* Down arrow - positioned absolutely */}
               <button
                 type="button"
                 onClick={scrollDown}
                 disabled={!canScrollDown}
                 className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                   canScrollDown 
                     ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-md' 
                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                 }`}
                 style={{ borderRadius: layoutSettings?.thumbnail_border_radius || '8px' }}
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
             </div>
          </div>
        </div>

        {/* Content grid */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          style={{ backgroundColor: layoutSettings?.content_background || '#ffffff' }}
        >
          {/* Left column: details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary card: name, address, price/week */}
            {layoutSettings?.sections?.find((s: any) => s.id === 'summary')?.visible !== false && (
              <Card>
                <CardContent 
                  className="p-6 space-y-2"
                  style={{
                    backgroundColor: layoutSettings?.sections?.find((s: any) => s.id === 'summary')?.background_color || '#ffffff',
                    padding: layoutSettings?.sections?.find((s: any) => s.id === 'summary')?.padding || '24px',
                    margin: layoutSettings?.sections?.find((s: any) => s.id === 'summary')?.margin || '0'
                  }}
                >
                  <div className="text-2xl font-semibold">{selectedGrade?.name || 'Select a Room Grade'}</div>
                  <div className="text-sm text-gray-600">{branding?.company_address || 'Address not set'}</div>
                  <div className="text-lg font-bold">£{(selectedGrade?.weekly_rate || 0).toFixed(2)} / week</div>
                  <div className="text-xs text-gray-500">Studios available: {selectedGrade?.studio_count ?? '-'}</div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {layoutSettings?.sections?.find((s: any) => s.id === 'amenities')?.visible !== false && (
              <div
                style={{
                  backgroundColor: layoutSettings?.sections?.find((s: any) => s.id === 'amenities')?.background_color || '#ffffff',
                  padding: layoutSettings?.sections?.find((s: any) => s.id === 'amenities')?.padding || '24px',
                  margin: layoutSettings?.sections?.find((s: any) => s.id === 'amenities')?.margin || '0'
                }}
              >
                <h3 className="text-xl font-semibold mb-3">Room Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {(selectedGrade?.amenities || []).map((a: string, i: number) => (
                    <div key={i} className="px-3 py-2 rounded border text-sm">{a}</div>
                  ))}
                  {(!selectedGrade?.amenities || selectedGrade.amenities.length === 0) && (
                    <div className="text-sm text-gray-500">No amenities listed</div>
                  )}
                </div>
              </div>
            )}

            {/* Overview / Description */}
            {layoutSettings?.sections?.find((s: any) => s.id === 'overview')?.visible !== false && (
              <div
                style={{
                  backgroundColor: layoutSettings?.sections?.find((s: any) => s.id === 'overview')?.background_color || '#ffffff',
                  padding: layoutSettings?.sections?.find((s: any) => s.id === 'overview')?.padding || '24px',
                  margin: layoutSettings?.sections?.find((s: any) => s.id === 'overview')?.margin || '0'
                }}
              >
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedGrade?.description || 'Description not provided.'}</p>
              </div>
            )}

            {/* Accommodation Features */}
            {layoutSettings?.sections?.find((s: any) => s.id === 'features')?.visible !== false && (
              <div
                style={{
                  backgroundColor: layoutSettings?.sections?.find((s: any) => s.id === 'features')?.background_color || '#ffffff',
                  padding: layoutSettings?.sections?.find((s: any) => s.id === 'features')?.padding || '24px',
                  margin: layoutSettings?.sections?.find((s: any) => s.id === 'features')?.margin || '0'
                }}
              >
                <h3 className="text-xl font-semibold mb-3">Accommodation Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {(selectedGrade?.features || []).map((f: string, i: number) => (
                    <div key={i} className="px-3 py-2 rounded border text-sm">{f}</div>
                  ))}
                  {(!selectedGrade?.features || selectedGrade.features.length === 0) && (
                    <div className="text-sm text-gray-500">No features listed</div>
                  )}
                </div>
              </div>
            )}

            {/* Map */}
            {layoutSettings?.sections?.find((s: any) => s.id === 'location')?.visible !== false && (
              <div
                style={{
                  backgroundColor: layoutSettings?.sections?.find((s: any) => s.id === 'location')?.background_color || '#ffffff',
                  padding: layoutSettings?.sections?.find((s: any) => s.id === 'location')?.padding || '24px',
                  margin: layoutSettings?.sections?.find((s: any) => s.id === 'location')?.margin || '0'
                }}
              >
                <h3 className="text-xl font-semibold mb-3">Location</h3>
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  {branding?.latitude && branding?.longitude ? (
                    <span>Map: {branding.latitude}, {branding.longitude}</span>
                  ) : (
                    <span>{branding?.company_address || 'Address not set'}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column: booking form */}
          <div 
            className="lg:col-span-1"
            style={{ backgroundColor: layoutSettings?.form_background || '#ffffff' }}
          >
            <form 
              onSubmit={handleSubmit} 
              className="space-y-3"
              style={{ gap: layoutSettings?.form_spacing || '12px' }}
            >
              {/* First/Last same row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Input 
                    placeholder="First name" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                    style={{ borderRadius: layoutSettings?.input_border_radius || '6px' }}
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Last name" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                    style={{ borderRadius: layoutSettings?.input_border_radius || '6px' }}
                  />
                </div>
              </div>

              {/* Remaining fields one per row */}
              <div className="-mt-1">
                <Input 
                  placeholder="Email address" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{ borderRadius: layoutSettings?.input_border_radius || '6px' }}
                />
              </div>
              <div className="-mt-1">
                <Input 
                  placeholder="Phone number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  style={{ borderRadius: layoutSettings?.input_border_radius || '6px' }}
                />
              </div>
              <div className="-mt-1">
                <Select value={durationId} onValueChange={setDurationId}>
                  <SelectTrigger style={{ borderRadius: layoutSettings?.input_border_radius || '6px' }}>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="-mt-1">
                <Select value={roomGradeId || activeGradeId} onValueChange={() => {}}>
                  <SelectTrigger disabled style={{ borderRadius: layoutSettings?.input_border_radius || '6px' }}>
                    <SelectValue placeholder="Select room grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomGrades.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="-mt-1">
                <Select value={planId} onValueChange={setPlanId}>
                  <SelectTrigger style={{ borderRadius: layoutSettings?.input_border_radius || '6px' }}>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Weekly Rate</div>
                  <div className="text-lg font-semibold">£{weeklyRate.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="text-lg font-semibold">£{totalAmount.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Deposit</div>
                  <div className="text-lg font-semibold">£{(depositAmount || 0).toFixed(2)}</div>
                </div>
              </div>

              <div className="p-3 border rounded">
                <CardElement options={{ hidePostalCode: true }} />
              </div>

              <Button 
                type="submit" 
                disabled={isProcessing || !stripe || !durationId || !(roomGradeId || activeGradeId) || !planId} 
                className="w-full"
                style={{
                  backgroundColor: layoutSettings?.button_background || '#3b82f6',
                  color: layoutSettings?.button_text_color || '#ffffff'
                }}
              >
                {isProcessing ? 'Processing...' : 'Pay Deposit & Submit'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const BookingPage: React.FC = () => {
  const { toast } = useToast();
  const [branding, setBranding] = useState<any | null>(null);
  const [activeGradeId, setActiveGradeId] = useState<string>('');
  const [layoutSettings, setLayoutSettings] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const [b, layout] = await Promise.all([
          ApiService.getBranding(),
          ApiService.getModuleStyle('web-access', 'booking-page-layout')
        ]);
        setBranding(b);
        setLayoutSettings(layout?.settings || null);
      } catch (e) {
        console.error('Error loading page data:', e);
      }
    })();
  }, []);
  const handleSubscribe = async (email: string) => {
    try {
      await ApiService.addSubscriber({ email, source: 'public' });
      toast({ title: 'Subscribed', description: 'Thank you for subscribing.' });
    } catch (e: any) {
      toast({ title: 'Subscription failed', description: e?.message || 'Try again later', variant: 'destructive' });
    }
  };
  return (
    <div>
      <Elements stripe={stripePromise}>
        <BookingForm activeGradeId={activeGradeId} setActiveGradeId={setActiveGradeId} branding={branding} layoutSettings={layoutSettings} />
      </Elements>
      <CTA onSubscribe={handleSubscribe} />
    </div>
  );
};

export default BookingPage;


