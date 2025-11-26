"use client";

import React from "react";
import { Check, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getParsedPricingPlans } from "@/data/pricingPlans";

export default function PricingSection() {
  const pricingPlans = getParsedPricingPlans();

  // Format price to Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle scroll to contact section for E-Commerce package
  const scrollToContactSection = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  // Add popular flag and descriptions
  const enhancedPlans = pricingPlans.map((plan, index) => ({
    ...plan,
    popular: index === 1, // Mark the second plan as popular
    isEcommerce: plan.packageName === "E-Commerce", // Mark E-Commerce package
    description: 
      plan.packageName.includes("Sederhana") ? "Cocok untuk usaha kecil" :
      plan.packageName.includes("Bisnis") ? "Ideal untuk bisnis yang sedang berkembang" :
      plan.packageName.includes("Premium") ? "Solusi lengkap untuk perusahaan" :
      "Platform toko online lengkap"
  }));

  return (
    <section id="pricing" className="py-20 bg-muted/30 fade-in-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-semibold px-3 py-1">
           Penawaran
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Pilih Paket Anda
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Harga transparan yang dirancang sesuai kebutuhan dan anggaran Anda. 
            Mulai kecil dan kembangkan seiring pertumbuhan bisnis Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {enhancedPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? "border-primary border-2 shadow-lg scale-105 bg-gradient-to-b from-primary/5 to-transparent" 
                  : plan.isEcommerce
                  ? "border-amber-400 border-2 bg-gradient-to-b from-amber-400/5 to-transparent"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-[-1] left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold shadow-lg">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Paling Populer
                  </Badge>
                </div>
              )}
              
              {plan.isEcommerce && (
                <div className="absolute -top-[-1] left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-amber-400 text-amber-900 px-4 py-1.5 text-xs font-bold shadow-lg">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Khusus
                  </Badge>
                </div>
              )}
              
              <CardHeader className={`text-center pb-6 ${
                plan.popular || plan.isEcommerce ? 'pt-10' : 'pt-8'
              }`}>
                <CardTitle className="text-xl font-bold text-foreground mb-3">
                  {plan.packageName}
                </CardTitle>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {plan.isEcommerce ? (
                      <span className="text-amber-400">Hubungi Admin</span>
                    ) : (
                      formatPrice(plan.price)
                    )}
                  </div>
                  <CardDescription className="text-sm font-medium text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="pb-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="flex items-start gap-3 transition-transform duration-200">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                {plan.isEcommerce ? (
                  <Button 
                    className="w-full font-semibold py-6 bg-amber-400 hover:bg-amber-500 text-amber-900 shadow-md"
                    size="lg"
                    onClick={scrollToContactSection}
                  >
                    Hubungi Admin
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Button 
                    className={`w-full font-semibold py-6 ${
                      plan.popular 
                        ? "bg-primary hover:bg-primary/90 shadow-md" 
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    }`}
                    size="lg"
                  >
                    Bergabung Sekarang
                    <ArrowRight className={`ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
                      plan.popular ? '' : 'text-primary'
                    }`} />
                  </Button>
                )}
              </CardFooter>

              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-4 text-lg">
              Semua paket mencakup konsultasi gratis serta perencanaan proyek profesional.
            </p>
            <p className="text-muted-foreground mb-4 text-sm">
              * Untuk paket E-Commerce, silakan hubungi admin kami untuk konsultasi dan penawaran khusus.
            </p>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/80 text-lg font-semibold"
              onClick={scrollToContactSection}
            >
              Solusi khusus menanti Anda. Hubungi kami. 
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}