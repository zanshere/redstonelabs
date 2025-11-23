import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="bg-muted/50 border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                 src={theme === 'dark' ? "/images/logo/redstonelabs-dark.png" : "/images/logo/redstonelabs-light.png"}  
                alt="Ryuzen Dev Logo" 
                width={145} 
                height={145} 
                className="rounded-md"
              />
            </div>
            <p className="text-muted-foreground text-sm">
              Membangun pengalaman web luar biasa yang mendorong pertumbuhan bisnis dan kepuasan pengguna.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-primary transition-colors">
                  Tentang kami
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-primary transition-colors">
                  Tim Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Karir
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                 Pengembangan Web
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Aplikasi Mobile
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                 Desain UI/UX 
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Konsultasi
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Syarat Layanan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kebijakan Cookie
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Redstone Labs. Semua hak dilindungi. Dibangun dengan passion dan kode.</p>
        </div>
      </div>
    </footer>
  );
}