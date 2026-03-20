# ✈️ Travel Diary

A polished travel diary app built with **React Native (Expo SDK 54)** and **TypeScript**. Capture travel memories with photos, automatic location/address detection via reverse geocoding, and local push notifications — wrapped in an iOS-first UI with dark/light mode.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start Expo
npx expo start
```

Scan the QR code with **Expo Go** on your iPhone (SDK 54 compatible).

> Camera and Location require a **physical device**.

---

## 📱 Features

- **Home Screen** — FlatList of entries with photo, address, date. Remove button per card. "No Entries Yet" empty state.
- **Add Entry Screen** — Camera launcher → automatic reverse geocoding → save with local push notification. Clears on back.
- **Dark / Light Mode** — Animated toggle, persisted to AsyncStorage.
- **All permissions** requested at runtime: Camera, Location, Notifications, Media Library.

---

## 🗂️ Structure

```
TravelDiary/
├── App.tsx
├── app.json
├── assets/
├── src/
│   ├── types/index.ts
│   ├── constants/theme.ts
│   ├── context/ThemeContext.tsx
│   ├── context/DiaryContext.tsx
│   ├── hooks/usePermissions.ts
│   ├── utils/validation.ts
│   ├── utils/notifications.ts
│   ├── utils/dateFormat.ts
│   ├── components/ThemeToggle.tsx
│   ├── components/EntryCard.tsx
│   ├── components/EmptyState.tsx
│   ├── components/LoadingSpinner.tsx
│   ├── screens/HomeScreen.tsx
│   └── screens/AddEntryScreen.tsx
```

---

## ✅ Validations

- Image URI scheme validation
- GPS coordinate null / NaN / range checks
- Address non-empty check
- Entry ID check before deletion
- AsyncStorage try/catch on every operation
- Permission request error handling with Settings fallback
