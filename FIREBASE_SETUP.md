# Firebase + Notifee setup (Android)

App code is already wired for:

- **Foreground**: FCM message → Notifee banner + in-app Notifications list
- **Background / quit**: FCM background handler → save to list (+ Notifee for data-only payloads)
- **Local test**: Notifications screen → **Test** button (works without Firebase)

## 1) Create Firebase Android app

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Add Android app with package name: `com.food_delivery_app`
3. Download `google-services.json`
4. Place it at:

```text
android/app/google-services.json
```

(See `android/app/google-services.json.example` for shape.)

Gradle applies the Google Services plugin **only if this file exists**, so the project can still build without Firebase until you add it.

## 2) Rebuild native app

```bash
npm run android
```

## 3) Get device FCM token

On app start, Metro / Logcat will print:

```text
[push] FCM token <token>
```

Save this token on your backend for that user/device.

## 4) Send a test push (Firebase Console)

Firebase Console → Messaging → Create campaign → send to the device token.

Recommended payload for reliable foreground + background handling:

```json
{
  "message": {
    "token": "DEVICE_FCM_TOKEN",
    "notification": {
      "title": "Order update",
      "body": "Your order is on the way"
    },
    "data": {
      "orderId": "ord-123",
      "title": "Order update",
      "body": "Your order is on the way"
    }
  }
}
```

For background-only custom handling, prefer **data-only** messages and let Notifee display them.

## 5) Backend reminder

True remote notifications need a server (Cloud Function / Node with Firebase Admin SDK) that sends FCM when order status changes.
