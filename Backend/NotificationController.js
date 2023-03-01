import React from "react";
import { View } from "react-native";
import PushNotification, { Importance } from "react-native-push-notification";

export default function NotificationController() {
  PushNotification.createChannel(
    {
      channelId: "firebase-channel", // (required)
      channelName: "FCM Notifications", // (required)
      channelDescription: "FCM Notifications ", // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
}
// import React from "react";
// import { View } from "react-native";
// import PushNotification, { Importance } from "react-native-push-notification";
// export default function NotificationController() {
//   PushNotification.createChannel(
//     {
//       channelId: "firebase-channel", // (required)
//       channelName: "FCM Notifications", // (required)
//       channelDescription: "FCM Notifications ", // (optional) default: undefined.
//       playSound: false, // (optional) default: true
//       soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
//       importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
//       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
//       foreground: true,
//     },
//     (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
//   );
// }