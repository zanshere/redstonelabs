# DevCraft Studio - Premium Web Development Agency Website

A modern, fully-responsive web development agency website built with Next.js 14, featuring smooth animations with GSAP, buttery-smooth scrolling with Lenis, and a beautiful dark/light mode.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **Smooth Animations**: GSAP with ScrollTrigger for scroll-based animations
- **Buttery Smooth Scrolling**: Lenis smooth scroll implementation
- **Dark/Light Mode**: Full theme support with system preference detection
- **Responsive Design**: Mobile-first approach supporting all devices
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Performance Optimized**: Fast page loads and smooth 60fps animations
- **Accessible**: WCAG compliant with proper ARIA labels

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

## 🛠️ Installation

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest devcraft-studio
cd devcraft-studio
```

When prompted, select:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: No
- App Router: Yes
- Import alias: Yes (@/*)

### Step 2: Install Dependencies

```bash
npm install @radix-ui/react-slot @studio-freight/lenis gsap lucide-react next-themes class-variance-authority clsx tailwind-merge tailwindcss-animate
```

### Step 3: Project Structure

Create the following directory structure:

```
devcraft-studio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── badge.tsx
│   ├── theme-provider.tsx
│   └── smooth-scroll-provider.tsx
├── lib/
│   └── utils.ts
├── public/
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── package.json
```

### Step 4: Copy Files

Copy all the provided code files into their respective locations:

1. **app/layout.tsx** - Root layout with theme and smooth scroll providers
2. **app/page.tsx** - Main website with all sections
3. **app/globals.css** - Global styles and CSS variables
4. **components/theme-provider.tsx** - Theme provider component
5. **components/smooth-scroll-provider.tsx** - Lenis smooth scroll setup
6. **components/ui/*.tsx** - All UI components (button, card, input, textarea, badge)
7. **lib/utils.ts** - Utility functions
8. **tailwind.config.ts** - Tailwind configuration
9. **tsconfig.json** - TypeScript configuration
10. **postcss.config.js** - PostCSS configuration
11. **package.json** - Update with provided dependencies

### Step 5: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your website in action!

## 🎨 Customization

### Colors

Modify the color scheme in `app/globals.css`:

```css
:root {
  --primary: 199 89% 48%; /* Sky blue */
  /* Add your custom colors */
}
```

### Content

Update the data in `app/page.tsx`:
- **Team Members**: Modify the `teamMembers` array
- **Projects**: Update the `projects` array
- **Pricing Plans**: Edit the `pricingPlans` array

### Animations

Customize GSAP animations in the `useEffect` hook:

```typescript
gsap.from(".hero-title", {
  y: 100,
  opacity: 0,
  duration: 1, // Adjust duration
  ease: "power3.out", // Change easing
});
```

## 📱 Sections

The website includes the following sections:

1. **Hero Section**: Eye-catching landing with animated headline
2. **About Section**: Company overview and core values
3. **Team Section**: Team member profiles with social links
4. **Portfolio Section**: Project showcase with filtering
5. **Pricing Section**: Service packages and pricing tiers
6. **Contact Section**: Contact form and company information

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file for any API keys:

```env
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

### SEO

Update metadata in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Company Name",
  description: "Your description",
  // Add more meta tags
};
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

## 📝 Best Practices Implemented

- ✅ TypeScript for type safety
- ✅ Component-based architecture
- ✅ Responsive design patterns
- ✅ Performance optimization
- ✅ SEO best practices
- ✅ Accessibility standards
- ✅ Modern React patterns
- ✅ Clean code structure

## 🐛 Troubleshooting

### Hydration Errors

If you see hydration warnings, ensure theme provider has `suppressHydrationWarning` on the `<html>` tag.

### GSAP Not Working

Make sure GSAP plugins are registered:

```typescript
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
```

### Smooth Scroll Issues

Lenis requires a continuous animation loop. Ensure the RAF loop is running correctly in `smooth-scroll-provider.tsx`.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [Lenis Documentation](https://github.com/studio-freight/lenis)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- GSAP for powerful animations
- Studio Freight for Lenis smooth scroll
- shadcn for beautiful UI components
- Lucide for the icon set

---

**Built with ❤️ using Next.js, GSAP, and Lenis**