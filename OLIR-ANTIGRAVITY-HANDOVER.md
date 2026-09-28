# Olir Development Handover

This document summarizes the development work completed so far, the current architecture of the `olir-website`, and important guidelines for future AI agents working on this project. 

## 1. Hosting & Infrastructure Architecture
We successfully migrated the project from Netlify to a completely free, automated setup.
* **Hosting:** The site is now hosted globally on **GitHub Pages**. 
* **CI/CD Automation:** Deployments are fully automated via GitHub Actions. Any push to the `main` branch triggers `.github/workflows/deploy.yml`, which runs the Node.js build script and deploys the `dist` folder to production.
* **Custom Domain:** `olir.com.au` is configured and resolving correctly to GitHub's IPs. The domain is secured with a free SSL/HTTPS certificate provisioned by GitHub.
* **Forms:** Because GitHub Pages is strictly static, we removed Netlify Forms and integrated **Formspree**. The Waitlist and Contact forms securely forward submissions directly to your email for free. 
* **Security:** Content Security Policy (CSP) headers were updated in `scripts/security-policy.mjs` to allow form submissions to Formspree.

## 2. Dynamic Aesthetic & Design Overhaul
We elevated the site from a static page to a premium, luxurious digital experience.
* **Hero Carousel:** The homepage hero now features an auto-playing Javascript carousel that cycles through high-end editorial images every 6 seconds.
* **Ken Burns & Ambient Animations:** We implemented CSS keyframe animations to apply a slow, elegant zoom (Ken Burns effect) to the hero images, and a continuous "floating" effect to product photography across the site. This mimics premium video without the risk of AI-generated artifacts.
* **Micro-interactions:** Buttons now feature a tactile bounce and shadow on hover (`transform: scale(1.025)`). Text links have smooth arrow sliding animations.
* **Branded Imagery:** We generated new, photorealistic 35mm film editorial assets for the site, featuring the updated frosted glass bottle and the strict **`olir.`** branding (with the dark botanical green dot).

## 3. Project Rules & Agent Configuration
To ensure a smooth workflow moving forward, we established strict system-level and project-level rules for all future AI agents (codified in `AGENTS.md`). 
* **Autonomy:** Agents are instructed to automatically proceed with your requests without asking for unnecessary confirmation.
* **Financial Safety Lock:** Agents are strictly forbidden from making payments, entering credit card information, or upgrading service plans.
* **Git/GitHub Source of Truth:** Agents must treat GitHub as the single source of truth. They are instructed to always `git pull` before starting work, and to finish and push a specific task or PR in one session rather than leaving local files un-pushed.
* **Browser Preference:** Google Chrome is set as the default browser for all automated web interactions.

## Next Steps for Future Development
When you resume work using Codex or another agent, you can immediately pick up where we left off:
1. **Product Details:** The current site mentions the formula is "in development". The next major content update will be inserting the final bottle size, price, and complete ingredient list once you have finalized the physical product.
2. **SEO & Analytics:** Connect the site to Google Search Console to track indexing, and optionally add a lightweight analytics script if you wish to track waitlist conversion rates.
3. **Commerce:** Once the product is ready to sell, the Formspree waitlist can be seamlessly swapped out for a Stripe Checkout link or a Shopify Buy Button without needing to rebuild the entire site on a heavy CMS.

*The codebase is clean, the infrastructure is completely free, and the foundation is ready for launch!*
