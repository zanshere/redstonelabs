"use client";

import React, { useState } from "react";
import { ArrowRight, Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactFormData } from "@/types";

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We`ll get back to you soon.");
    setFormData({ name: "", email: "", phoneNumber: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-background fade-in-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">Terhubung Dengan Kami</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Bersama, Wujudkan Ide-Ide Hebat
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Punya proyek dalam pikiran? Kami ingin mendengarnya. Hubungi kami dan mari mulai berdiskusi.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="hover-card">
            <CardHeader>
              <CardTitle className="text-foreground">Kirim Pesan Kepada Kami</CardTitle>
              <CardDescription>
                Isi formulir di bawah, dan kami akan menghubungi Anda dalam 24 jam.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                    Nama Anda
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                    Alamat Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@contoh.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 text-foreground">
                    Nomor Telepon
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+62 812-3456-7890"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                    Pesan
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Beritahu Kami Tentang Proyekmu . ."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Kirim Pesan <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="hover-card">
              <CardHeader>
                <CardTitle className="text-foreground">Kontak Informasi</CardTitle>
                <CardDescription>Terhubung dengan kami melalui saluran komunikasi berikut.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Email</h4>
                    <p className="text-muted-foreground">hello@redstonelabs.com</p>
                    <p className="text-muted-foreground">support@redstonelabs.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Telepon</h4>
                    <p className="text-muted-foreground">+62 812-3456-7890</p>
                    <p className="text-muted-foreground">Sen-Jum 09.00 - 18.00pm WIB</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Kantor</h4>
                    <p className="text-muted-foreground">Jl. Teknologi No. 123</p>
                    <p className="text-muted-foreground">Jakarta Selatan, 12560</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Ikuti Kami</CardTitle>
                <CardDescription>Tetap Terhubung Di Sosial Media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <Github className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <Twitter className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card">
              <CardHeader>
                <CardTitle className="text-foreground">Waktu Operasional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Senin - Jumat</span>
                  <span className="font-semibold text-foreground">09.00 AM - 18.00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sabtu</span>
                  <span className="font-semibold text-foreground">10.00 - 14.00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minggu</span>
                  <span className="font-semibold text-foreground">Tutup</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}