import Stripe from "stripe";

// Initialize Stripe instance with fallback handling
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
      appInfo: {
        name: "HireLoop Job Portal",
        version: "1.0.0",
      },
    })
  : null;

// Standard plan metadata and pricing definitions (amounts in cents for Stripe)
export const PLAN_DETAILS = {
  // Seeker Plans
  pro: {
    name: "Professional Tier",
    role: "seeker",
    limits: {
      applicationsPerMonth: 30,
      savedJobsLimit: 9999,
      isPro: true,
      hasPriorityBadge: true,
    },
    pricing: {
      monthly: {
        amount: 1900, // $19.00 USD
        currency: "usd",
        interval: "month",
        label: "$19.00/month",
      },
      yearly: {
        amount: 16800, // $14/month = $168.00/year USD
        currency: "usd",
        interval: "year",
        label: "$168.00/year ($14/mo)",
      },
    },
  },
  premium: {
    name: "Premium Unlimited",
    role: "seeker",
    limits: {
      applicationsPerMonth: 999999, // Unlimited
      savedJobsLimit: 9999,
      isPro: true,
      hasPriorityBadge: true,
      directMessaging: true,
    },
    pricing: {
      monthly: {
        amount: 3900, // $39.00 USD
        currency: "usd",
        interval: "month",
        label: "$39.00/month",
      },
      yearly: {
        amount: 34800, // $29/month = $348.00/year USD
        currency: "usd",
        interval: "year",
        label: "$348.00/year ($29/mo)",
      },
    },
  },

  // Recruiter Plans
  "recruiter-growth": {
    name: "Recruiter Growth Tier",
    role: "recruiter",
    limits: {
      activeJobLimit: 10,
      atsEnabled: true,
      featuredListing: false,
    },
    pricing: {
      monthly: {
        amount: 4900, // $49.00 USD
        currency: "usd",
        interval: "month",
        label: "$49.00/month",
      },
      yearly: {
        amount: 44400, // $37/month = $444.00/year USD
        currency: "usd",
        interval: "year",
        label: "$444.00/year ($37/mo)",
      },
    },
  },
  "recruiter-enterprise": {
    name: "Recruiter Enterprise Tier",
    role: "recruiter",
    limits: {
      activeJobLimit: 50,
      atsEnabled: true,
      featuredListing: true,
      teamCollaboration: true,
    },
    pricing: {
      monthly: {
        amount: 14900, // $149.00 USD
        currency: "usd",
        interval: "month",
        label: "$149.00/month",
      },
      yearly: {
        amount: 134400, // $112/month = $1344.00/year USD
        currency: "usd",
        interval: "year",
        label: "$1,344.00/year ($112/mo)",
      },
    },
  },
};
