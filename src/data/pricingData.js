export const stats = [
  { value: "100+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Businesses" },
  { value: "4.9", suffix: "★", label: "Average Rating" },
  { value: "95%", label: "Client Retention" },
  { value: "24×7", label: "Support" },
  { value: "5+", label: "Years Combined Experience" },
  { value: "100%", label: "Custom Solutions" },
];

export const addons = [
  { title: "Extra Reel", price: 999, unit: "flat" },
  { title: "Premium Reel Shoot", price: 2999, unit: "flat" },
  { title: "Poster Design", price: 129, unit: "flat" },
  { title: "Carousel", price: 149, unit: "flat" },
  { title: "Story Design", price: 99, unit: "flat" },
  { title: "Thumbnail", price: 99, unit: "flat" },
  { title: "Landing Page", price: 1999, unit: "flat" },
  { title: "Extra Website Page", price: 999, unit: "flat" },
  { title: "SEO Blog", price: 99, unit: "flat" },
  { title: "WhatsApp Automation", price: 1999, unit: "flat" },
  { title: "AI Chatbot", price: 999, unit: "flat" },
  { title: "Email Automation", price: 1999, unit: "flat" },
  { title: "Google Analytics Setup", price: 2499, unit: "flat" },
  { title: "Search Console Setup", price: 1999, unit: "flat" },
  { title: "Google Business Setup", price: 3999, unit: "flat" },
  { title: "Website Maintenance", price: 2999, unit: "month" },
  { title: "Hosting Management", price: 999, unit: "month" },
  { title: "Domain Management", price: 499, unit: "month" },
  { title: "Speed Optimization", price: 4999, unit: "flat" },
  { title: "Technical SEO Audit", price: 4999, unit: "flat" },
];

export const servicesData = [
  {
    id: "social-media",
    title: "Social Media Management",
    subtitle: "Grow your brand with strategic content, engaging creatives and performance-focused social media management.",
    packages: [
      {
        id: "smm-basic",
        name: "Basic Plan",
        price: 5499,
        unit: "/ Month",
        bestFor: "Startups & Local Businesses",
        features: [
          "4- Poster with content",
          "4- Reels with content (shoot + edit)",
          "4- Carousel with content",
          "4- Story with content",
          "Choose Any ONE: Bonus point:", // Using "Choose Any ONE:" trick to make it a bold header in PricingCard
          "Caption+Trending hashtags",
          "Posting & Scheduling"
        ],
        cta: "Get Started",
        isPopular: false
      },
      {
        id: "smm-standard",
        name: "Standard Plan",
        price: 8499,
        unit: "/ Month",
        bestFor: "Growing Brands",
        features: [
          "6- Poster with content",
          "6- Carousel with content",
          "6- Reel with content (shoot+edit)",
          "6- Story with content",
          "Choose Any ONE: Bonus Point:",
          "Caption+trending & hashtags",
          "Posting & scheduling",
          "Monthly report & Strategy call",
          "Posting all fest poster"
        ],
        cta: "Get Started",
        isPopular: true
      },
      {
        id: "smm-premium",
        name: "Premium Plan",
        price: 16999,
        unit: "/ Month",
        bestFor: "Market Leaders",
        features: [
          "8- Poster with content",
          "10- Reel with content (shoot+edit)",
          "8- Carousel with content",
          "10- Story with content",
          "Choose Any ONE: Bonus point:",
          "Caption+trending & hashtags",
          "Posting & scheduling",
          "Calendar & trend analysis",
          "Priority support",
          "Monthly report & Strategy call"
        ],
        cta: "Get Started",
        isPopular: false
      }
    ],
    comparison: {
      features: ["Posters with content", "Reels (shoot+edit)", "Carousels with content", "Stories with content", "Posting & scheduling", "Monthly report & Strategy call", "Posting fest posters", "Calendar & trend analysis"],
      plans: [
        { name: "Basic Plan", values: ["4", "4", "4", "4", "✓", "-", "-", "-"] },
        { name: "Standard Plan", values: ["6", "6", "6", "6", "✓", "✓", "✓", "-"] },
        { name: "Premium Plan", values: ["8", "10", "8", "10", "✓", "✓", "-", "✓"] }
      ]
    },
    faq: [
      { q: "Who creates the content for social media?", a: "We work with both client-provided content and content created specifically for your business. During onboarding, we discuss the best content workflow based on your industry, location, and goals." },
      { q: "Can I review posts before they go live?", a: "Yes, you will have access to a content calendar where you can review and approve all posts before they are scheduled." },
      { q: "Do you respond to comments and DMs?", a: "Community management (responding to comments and DMs) is included in our Domination Plan." }
    ]
  },
  {
    id: "website-development",
    title: "Website Development",
    subtitle: "Modern, lightning-fast websites built to generate leads and sales.",
    packages: [
      {
        id: "web-landing",
        name: "Landing Page",
        price: 6999,
        unit: "Starting",
        bestFor: "Campaigns & Events",
        features: ["Responsive Design", "Premium UI", "Lead Form", "WhatsApp", "SEO Ready", "SSL", "Fast Loading", "Delivery: 5 Days"],
        cta: "Get Landing Page",
        isPopular: false
      },
      {
        id: "web-business",
        name: "Business Website",
        price: 14999,
        unit: "Starting",
        bestFor: "Local Businesses",
        features: ["8-12 Pages", "Blog", "Portfolio", "Contact Forms", "Google Analytics", "Search Console", "SEO Ready", "WhatsApp Integration", "Animations", "Mobile Optimized", "Delivery: 10-15 Days"],
        cta: "Get Business Website",
        isPopular: true
      },
      {
        id: "web-premium",
        name: "Premium Website",
        price: 24999,
        unit: "Starting",
        bestFor: "Scaling Service Brands",
        features: ["Everything in Business", "CMS", "Admin Panel", "Booking System", "Payment Gateway", "Premium Animations", "Blog System", "Portfolio", "Dashboard", "Training"],
        cta: "Build Premium Web",
        isPopular: false
      },
      {
        id: "web-enterprise",
        name: "Enterprise",
        price: 49999,
        unit: "Starting",
        bestFor: "Large Scale Operations",
        features: ["Unlimited Pages", "Custom Dashboard", "Authentication", "Database", "Cloud Deployment", "CRM Integration", "API Integration", "Documentation", "Training"],
        cta: "Talk to Sales",
        isPopular: false
      }
    ],
    comparison: {
      features: ["Responsive Design", "Pages", "Contact Forms", "Animations", "Blog/CMS", "Payment Gateway", "Custom Dashboard", "API Integration"],
      plans: [
        { name: "Landing Page", values: ["✓", "1", "✓", "Basic", "-", "-", "-", "-"] },
        { name: "Business", values: ["✓", "8-12", "✓", "Standard", "-", "-", "-", "-"] },
        { name: "Premium", values: ["✓", "Custom", "✓", "Premium", "✓", "✓", "-", "-"] },
        { name: "Enterprise", values: ["✓", "Unlimited", "✓", "Premium", "✓", "✓", "✓", "✓"] }
      ]
    },
    faq: [
      { q: "How long does development take?", a: "Landing pages take ~5 days, while Business and Premium websites take 10-15 days depending on complexity and prompt feedback." },
      { q: "Can I update my own website?", a: "Yes, our Premium and Enterprise packages include a CMS (Content Management System) and training so you can easily edit text and images." },
      { q: "Do you provide hosting?", a: "We can help you set up hosting on platforms like Vercel, AWS, or conventional shared hosting. We also offer a monthly hosting management add-on." },
      { q: "Do you provide maintenance?", a: "Yes, we offer ongoing Website Maintenance packages as an add-on to keep your site secure and up-to-date." }
    ]
  },
  {
    id: "e-commerce",
    title: "E-Commerce",
    subtitle: "High-converting online stores built for scale and seamless shopping experiences.",
    packages: [
      {
        id: "ecom-starter",
        name: "Starter Store",
        price: 39999,
        unit: "Starting",
        bestFor: "New Online Stores",
        features: ["Products Setup", "Categories", "Cart functionality", "Checkout Flow", "Payment Gateway", "Admin Panel", "Responsive Design"],
        cta: "Start Selling",
        isPopular: false
      },
      {
        id: "ecom-advanced",
        name: "Advanced Store",
        price: 69999,
        unit: "Starting",
        bestFor: "Established Retailers",
        features: ["Inventory Management", "GST Integration", "Coupons & Discounts", "CRM Setup", "Advanced Analytics", "Wishlist", "Customer Reviews", "Email Automation"],
        cta: "Scale Your Store",
        isPopular: true
      }
    ],
    comparison: {
      features: ["Cart & Checkout", "Payment Gateway", "Admin Panel", "GST Integration", "Coupons", "Reviews & Wishlist", "Email Automation"],
      plans: [
        { name: "Starter", values: ["✓", "✓", "✓", "-", "-", "-", "-"] },
        { name: "Advanced", values: ["✓", "✓", "✓", "✓", "✓", "✓", "✓"] }
      ]
    },
    faq: [
      { q: "Which platform do you use for E-commerce?", a: "We build custom solutions using Next.js/React, or use scalable platforms like Shopify and WooCommerce based on your specific requirements." },
      { q: "Do you add all my products?", a: "We setup the store architecture and add initial placeholder or key products. We provide training so you can easily bulk upload the rest." }
    ]
  },
  {
    id: "seo",
    title: "SEO",
    subtitle: "Dominate search results and drive high-intent organic traffic to your business.",
    packages: [
      {
        id: "seo-local",
        name: "Local SEO",
        price: 5999,
        unit: "/ Month",
        bestFor: "Local Clinics & Stores",
        features: ["Google Business Profile", "Keyword Research", "On Page SEO", "Technical Audit", "Local Citations", "Monthly Report"],
        cta: "Dominate Local",
        isPopular: false
      },
      {
        id: "seo-business",
        name: "Business SEO",
        price: 14999,
        unit: "/ Month",
        bestFor: "Service Businesses",
        features: ["Everything in Local SEO", "Blog Writing", "Schema Markup", "Internal Linking", "Search Console Setup", "Competitor Analysis"],
        cta: "Rank Higher",
        isPopular: true
      },
      {
        id: "seo-authority",
        name: "Authority SEO",
        price: 24999,
        unit: "/ Month",
        bestFor: "National Brands",
        features: ["Everything in Business", "High-Quality Backlinks", "Content Strategy", "Programmatic SEO", "EEAT Optimization", "Monthly SEO Consultation"],
        cta: "Become the Authority",
        isPopular: false
      }
    ],
    comparison: {
      features: ["On Page SEO", "Technical Audit", "Local Citations", "Blog Writing", "Schema Markup", "Backlinks", "Programmatic SEO", "EEAT Optimization"],
      plans: [
        { name: "Local SEO", values: ["✓", "✓", "✓", "-", "-", "-", "-", "-"] },
        { name: "Business SEO", values: ["✓", "✓", "✓", "✓", "✓", "-", "-", "-"] },
        { name: "Authority SEO", values: ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"] }
      ]
    },
    faq: [
      { q: "How long before rankings improve?", a: "SEO is a long-term strategy. You typically start seeing noticeable improvements in traffic and rankings within 3 to 6 months." },
      { q: "Do you guarantee rankings?", a: "No reputable agency can guarantee #1 rankings due to changing algorithms, but we use proven, data-driven strategies to significantly improve your visibility." }
    ]
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    subtitle: "Streamline operations, save time, and convert leads automatically with AI systems.",
    packages: [
      {
        id: "ai-starter",
        name: "Starter Automation",
        price: 9999,
        unit: "Starting",
        bestFor: "Solopreneurs",
        features: ["Choose Any ONE:", "WhatsApp Automation", "Instagram Automation", "Lead Automation", "Email Automation", "Booking Automation"],
        cta: "Start Automating",
        isPopular: false
      },
      {
        id: "ai-business",
        name: "Business Automation",
        price: 19999,
        unit: "Starting",
        bestFor: "Growing Teams",
        features: ["Choose Any THREE:", "CRM Integration", "WhatsApp Bot", "Instagram Bot", "Google Sheets Sync", "Lead Qualification", "AI Chatbot", "Emails & Forms"],
        cta: "Scale with AI",
        isPopular: true
      },
      {
        id: "ai-complete",
        name: "Complete AI System",
        price: 39999,
        unit: "Starting",
        bestFor: "Enterprise Workflows",
        features: ["Full CRM Setup", "AI Voice Agent", "Custom AI Chatbot", "WhatsApp Automation", "Email Automation", "Sales Dashboard", "Lead Scoring", "Custom Reports"],
        cta: "Transform Business",
        isPopular: false
      }
    ],
    comparison: {
      features: ["Number of Workflows", "WhatsApp/IG Bots", "CRM Integration", "Lead Qualification", "AI Voice Agent", "Sales Dashboard"],
      plans: [
        { name: "Starter", values: ["1 Included", "✓", "-", "-", "-", "-"] },
        { name: "Business", values: ["3 Included", "✓", "✓", "✓", "-", "-"] },
        { name: "Complete", values: ["Unlimited Core", "✓", "✓", "✓", "✓", "✓"] }
      ]
    },
    faq: [
      { q: "Do I need technical knowledge?", a: "No, we handle the entire setup, configuration, and testing. We also provide documentation on how to manage your new systems." },
      { q: "Can this integrate with my existing software?", a: "Yes, our automation solutions can integrate with most modern software using APIs, webhooks, or tools like Make/Zapier." }
    ]
  },
  {
    id: "gbp",
    title: "Google Business Profile",
    subtitle: "Dominate local maps and attract customers right when they search for you.",
    packages: [
      {
        id: "gbp-setup",
        name: "GBP Setup",
        price: 3999,
        unit: "One-Time",
        bestFor: "New Locations",
        features: ["Business Setup", "Category Optimization", "SEO Description", "Image Uploads", "Verification Support"],
        cta: "Setup My Profile",
        isPopular: false
      },
      {
        id: "gbp-management",
        name: "GBP Management",
        price: 5999,
        unit: "/ Month",
        bestFor: "Active Businesses",
        features: ["Weekly Optimization Posts", "Review Management", "Local SEO Optimization", "Performance Analytics", "Q&A Management"],
        cta: "Manage My Profile",
        isPopular: true
      }
    ],
    comparison: null,
    faq: [
      { q: "Do you help with verification?", a: "Yes, we guide you through Google's verification process to ensure your profile goes live smoothly." }
    ]
  },
  {
    id: "branding",
    title: "Branding",
    subtitle: "Craft a premium, memorable brand identity that stands out in the market.",
    packages: [
      {
        id: "brand-starter",
        name: "Starter",
        price: 9999,
        unit: "One-Time",
        bestFor: "New Startups",
        features: ["Logo Design", "Color Palette Selection", "Typography System", "Basic Brand Guide"],
        cta: "Start Branding",
        isPopular: false
      },
      {
        id: "brand-pro",
        name: "Professional",
        price: 15999,
        unit: "One-Time",
        bestFor: "Rebrands",
        features: ["Everything in Starter", "Business Card Design", "Letterhead Design", "Email Signature", "Social Media Kit"],
        cta: "Professional Brand",
        isPopular: true
      },
      {
        id: "brand-premium",
        name: "Premium",
        price: 29999,
        unit: "One-Time",
        bestFor: "Established Companies",
        features: ["Everything in Professional", "Product Packaging Design", "Brand Strategy", "Investor Presentation", "Complete Identity System"],
        cta: "Premium Identity",
        isPopular: false
      }
    ],
    comparison: null,
    faq: [
      { q: "How many logo revisions do I get?", a: "We typically provide 2-3 initial concepts and allow 2 rounds of revisions on the chosen concept to ensure it's perfect." }
    ]
  },
  {
    id: "paid-ads",
    title: "Paid Ads",
    subtitle: "Generate instant leads and sales with highly targeted performance marketing.",
    packages: [
      {
        id: "ads-meta",
        name: "Meta Ads charges ",
        price: 4999,
        unit: "/ Month",
        bestFor: "B2C & E-Commerce",
        features: ["Facebook & Instagram Ads", "Campaign Setup", "Audience Targeting", "Ad Copywriting", "Performance Monitoring", "Monthly Report"],
        cta: "Run Meta Ads",
        isPopular: false
      },
      {
        id: "ads-google-meta",
        name: "Google + Meta charges ",
        price: 6999,
        unit: "/ Month",
        bestFor: "Multi-Channel Growth",
        features: ["Google Search & Display", "Meta Ecosystem", "Cross-Platform Retargeting", "A/B Testing", "Conversion Tracking", "Bi-Weekly Reports"],
        cta: "Multi-Channel Ads",
        isPopular: true
      },
      {
        id: "ads-full",
        name: "Full Performance",
        price: 11999,
        unit: "/ Month",
        bestFor: "High-Budget Scaling",
        features: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Conversion Rate Optimization", "Advanced Analytics", "Dedicated Account Manager"],
        cta: "Scale Aggressively",
        isPopular: false
      }
    ],
    comparison: null,
    faq: [
      { q: "Is ad spend included in the fee?", a: "No, the pricing listed is our management fee. The actual ad spend is billed directly by Google, Meta, or LinkedIn to your payment method." }
    ]
  },
  {
    id: "monthly-growth",
    title: "Monthly Growth Plans",
    subtitle: "Your entire digital marketing department, fully managed by our experts.",
    packages: [
      {
        id: "growth-basic",
        name: "Growth Basic",
        price: 16999,
        unit: "/ Month",
        bestFor: "Small Businesses",
        features: ["Website Maintenance", "Basic SEO Management", "Social Media Management (Launch)"],
        cta: "Start Growing",
        isPopular: false
      },
      {
        id: "growth-pro",
        name: "Growth Pro",
        price: 21999,
        unit: "/ Month",
        bestFor: "Scaling Agencies",
        features: ["Website Maintenance", "Business SEO", "AI Automation Maintenance", "Social Media (Growth)"],
        cta: "Scale Operations",
        isPopular: true
      },
      {
        id: "growth-partner",
        name: "Growth Partner",
        price: 49999,
        unit: "/ Month",
        bestFor: "Full Delegation",
        features: ["Dedicated Team", "Assigned Developer", "Assigned Designer", "SEO Expert", "Automation Expert", "Monthly Strategy", "Priority 24/7 Support"],
        cta: "Partner With Us",
        isPopular: false
      }
    ],
    comparison: null,
    faq: [
      { q: "Is there a lock-in period?", a: "Our growth plans are month-to-month, meaning you can pause or cancel anytime with a 30-day notice." }
    ]
  }
];
