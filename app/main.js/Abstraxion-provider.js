import React from "react";
import { AbstraxionProvider } from "@burnt-labs/abstraxion-react-native";
import HomeScreen from "./src/HomeScreen";

export default function App() {
  return (
    <AbstraxionProvider>
      <HomeScreen />
    </AbstraxionProvider>
  );
}
