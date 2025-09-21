# Rangi's Heartbeat ❤️
### Multi-Sensory Market Sonification - XION PoC Hackathon Submission

**A visionary proof-of-concept that makes financial markets accessible through sound, touch, and sight, built on XION's gasless infrastructure.**

> **Note on Submission State:** This repository represents a passionate, intense 60-hour development sprint. The core vision is fully articulated, though some integrations remain aspirational due to the constraints of the hackathon timeline. We believe the concept demonstrates the profound potential of XION's technology for creating truly accessible Web3 experiences.

## 🌟 The Vision: Why This Exists

Financial trading is an overwhelmingly visual experience, excluding blind users and overloading traders with charts. Rangi's Heartbeat proposes a new paradigm: **understanding the market through harmony and vibration.**

*   **For the Visually Impaired:** This is a world's first step toward a fully ADA-compliant trading interface.
*   **For Everyone:** It offers an intuitive, gut-feel understanding of market dynamics, turning complex data into an immersive sensory experience.

## 🎯 How It Works (The Concept)

Imagine the market as a symphony:
*   **BTC Price is the Singer:** Voice rises in pitch during rallies, drops in crashes.
*   **Trading Volume is the Drummer:** Soft beats in calm markets, intense rhythms during volatility.
*   **You are the Conductor:** Feel the music through your device.

This PoC aims to use **XION's gasless transactions** and **Dave Mobile Kit** to make this symphony seamless and invisible to the user.

## 🧰 Technology Stack (Aspirational & Implemented)

| Layer | Technology | Purpose | Status |
| :--- | :--- | :--- | :--- |
| **Blockchain** | XION Testnet | Gasless transactions & wallet abstraction | *Planned Integration* |
| **Mobile Auth** | XION Dave Kit | Biometric, seedless login | *Planned Integration* |
| **Frontend** | React Native | Mobile app framework | *Planned* |
| **Audio Engine** | Web Audio API | Generating harmonic frequencies from market data | *Core Concept* |
| **Haptics** | Expo Haptics, Gamepad API | Translating market moves to vibration | *Core Concept* |
| **Data** | CoinGecko/Coinbase API | Real-time market data | *Planned* |

## 🔬 The Core Innovation: 7-Bell H.R.I. (Harmonic Resonance Index)

Our proprietary model maps market data to harmonic frequencies based on natural mathematical constants:

*   **Base Frequency:** 432 Hz (The "Heartbeat")
*   **Llama Frequency:** 111.11 Hz (The "Return-to-Sender" panic signal on >5% drops)
*   **Additional Bells:** 86Hz, 753Hz, 1074Hz, 1395Hz, 1618Hz (Fibonacci-derived)

This system creates a unique audio signature for different market conditions, from stable growth to extreme volatility.

## 🚀 Running the Project (Current State)

This repository currently contains the foundational concepts, architectural plans, and initial code structures for Rangi's Heartbeat. Full integration with the XION Dave Mobile Kit is the key next step for a functional demo.

We welcome developers to fork this repo and collaborate on bringing this vision to life.

## 💡 The Future: Reality Protocol LLC

This project is the first initiative from **Reality Protocol LLC** (30 N Gould St. Ste. R, Sheridan, WY 82801). Our mission is to democratize financial intuition through multi-sensory technology.

**Patent Pending:** US2025/STYRD

## 👨‍💻 About the Builder

**Justin William McCrea** is a master electrician turned visionary developer. After facing significant losses during the COVID crypto winter, he dedicated 9 months to learning and building a system that could make market intuition accessible to all, culminating in this 60-hour hackathon sprint.

## 📞 Contact

*   **Email:** justin@realityprotocol.io
*   **X (Twitter):** [@Goldandrainbows](https://x.com/Goldandrainbows/)
*   **Company:** Reality Protocol LLC, Sheridan, WY / Denver, CO
                   PROPRIETARY TECHNOLOGY OF REALITY PROTOCOL LLC
             PATENT PENDING: MARKET-DRIVEN WAVELENGTH VISUALIZATION SYSTEM
                © 2025 Reality Protocol LLC. All Rights Reserved.
             SoundsofRangi - Harmonic Financial Sonification Platform
                   PROPRIETARY TECHNOLOGY - ALL RIGHTS RESERVED

**Copyright © 2025 SoundsOfRangi Reality Protocol LLC. All Rights Reserved.**

This technology is protected under:
- Trade Secret Protection
- Pending Patent Applications
- Proprietary Algorithm Protection
- Market_Mayhem_Orchestration

### 🔒 SECURITY NOTICE
This repository contains proprietary technology belonging exclusively to Reality Protocol LLC. Unauthorized access, use, duplication, or distribution is strictly prohibited and will be prosecuted to the fullest extent of the law.

git add README.md CONTRIBUTING.md
git commit -m "📚 Update documentation for enhanced features

Your app template should now be running on [localhost:3000](http://localhost:3000).
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig

