# Base Landing Template

A reusable, duplication-friendly landing page starter built with Next.js App Router, TypeScript, and CSS Modules.

## Quick Start

```bash
npm install
npm run dev
```

## Where To Edit After Duplicating

- Branding, business info, colors, contact details, navigation, and SEO: `src/data/siteConfig.ts`
- Section copy, services, testimonials, CTA text, and footer text: `src/data/siteContent.ts`
- WhatsApp link behavior: `src/lib/whatsapp.ts`
- Page structure: `src/app/page.tsx`
- Global styles: `src/app/globals.css`
- Component-specific styles: `src/components/**/**/*.module.css`

## Replace Images

Swap the placeholder files in:

- `public/logo/`
- `public/images/hero/`
- `public/images/about/`
- `public/images/testimonials/`
- `public/images/og/`

Then update the matching file paths in `src/data/siteConfig.ts` if needed.

## Template Workflow

1. Duplicate the project.
2. Update `src/data/siteConfig.ts` with the new client branding, contact details, colors, and SEO.
3. Update `src/data/siteContent.ts` with the new copy, services, testimonials, and CTA messaging.
4. Replace placeholder assets in `public/`.
5. If needed, connect the contact form in `src/components/sections/ContactSection.tsx` to your backend or email service.

## Contact Modes

You can switch the contact section behavior from `src/data/siteConfig.ts`:

- `"whatsapp"`
- `"form"`
- `"both"`

## Notes

- The floating WhatsApp button uses the centralized WhatsApp number and message.
- Metadata and Open Graph defaults also come from `src/data/siteConfig.ts`.
- The contact form is frontend-only by default and ready to be connected later.
