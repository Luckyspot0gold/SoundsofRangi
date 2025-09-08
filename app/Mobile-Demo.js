import React, { useEffect, useState } from "react"; import { View, Text, Button } from "react-native"; import { AbstraxionProvider, useMetaAccount } from "@burnt-labs/abstraxion-react-native"; import * as Haptics from "expo-haptics";

// 🎶 Simple Tone Generator Placeholder // (Later replace with proper RN audio lib for harmonic 432Hz + dual-band system) function playTone(frequency = 432) { console.log(Playing tone at ${frequency} Hz); // TODO: Integrate with RN-Sound or Tone.js bridge }

function MarketDemo() { const { connect, account } = useMetaAccount(); const [price, setPrice] = useState(null);

// Fetch BTC price from CoinGecko useEffect(() => { async function fetchPrice() { try { const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"); const data = await res.json(); setPrice(data.bitcoin.usd);

// Map price change → tone + haptic
    playTone(432);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (err) {
    console.error("Price fetch failed", err);
  }
}
fetchPrice();
const interval = setInterval(fetchPrice, 15000);
return () => clearInterval(interval);

}, []);

return ( <View style={{ flex: 1, justifyContent: "center", alignItems: "center", background

