# GymApp

**GymApp** to aplikacja mobilna stworzona w React Native, która pomaga użytkownikowi zarządzać swoimi treningami oraz śledzić postępy sylwetki.

## 📱 Opis projektu

Aplikacja umożliwia:

- Logowanie i rejestrowanie użytkownika
- Wprowadzanie podstawowych danych (wiek, wzrost, waga, cel)
- Dodawanie zdjęć sylwetki do śledzenia progresu
- Lokalizowanie miejsca treningu (zapis lokalizacji, pogląd mapy)
- Wysyłanie powiadomienia push po zapisanym treningu
- Udostępnianie treningu innym

## ✅ Funkcjonalności

- Logowanie i rejestracja użytkownika
- Dodawanie, robienie, przeglądanie oraz usuwanie zdjęć
- Wysyłanie powiadomień push
- Obsługa lokalizacji treningu
- Udostępnianie treningu
- Formularz ustawień użytkownika (wiek, waga, wzrost, cel)

## 🧰 Technologie i biblioteki

Projekt został zbudowany z użyciem następujących technologii:

- React Native
- Expo
- React Navigation (Stack, Bottom Tabs)
- Expo ImagePicker, Camera (zdjęcia sylwetki)
- Expo Location (lokalizacja treningu)
- Expo Notifications (powiadomienia)
- React Native Paper (komponenty UI)
- AsyncStorage (przechowywanie danych)
- React Native Maps

## ⚙️ Instalacja i uruchomienie lokalne

1. Sklonuj repozytorium:

```bash
git clone https://github.com/pio10439/GymApp
cd GymApp
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Uruchom projekt:

```bash
npx expo start
```

Możesz użyć opcji `i` (iOS simulator), `a` (Android) lub zeskanować kod QR aplikacją Expo Go.
