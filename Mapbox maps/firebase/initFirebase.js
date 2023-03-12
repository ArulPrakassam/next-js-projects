import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1puRZojxVJhNqipc4-p-VdCNb-p4hhVE",
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL:
    "https://accident-blackspots-project-default-rtdb.firebaseio.com",
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase();

//authentication
const auth = getAuth(app);

signInAnonymously(auth)
  .then(() => {
    console.log("successfully signed in as anonymous user");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

export { app, database };

//for writing data
// function writeData(dateTime, lat, long) {
//   const reference = ref(database, "coordinates/" + `${dateTime}`);

//   set(reference, {
//     dateTime,
//     lat,
//     long,
//   })
//     .then(() => {
//       console.log("data saved");
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }
// writeData("2023-3-12 7:27:12", 11.930845, 79.768845);

//for getting data
// const coordinates = ref(database, "coordinates/");
// const data = [];
// onValue(coordinates, (snapshot) => {
//   snapshot.forEach((childSnapshot) => {
//     const childKey = childSnapshot.key;
//     const childData = childSnapshot.val();
//     data.push(childData);
//     // console.log(childKey, childData);
//   });

//   // console.log(data);
// });
