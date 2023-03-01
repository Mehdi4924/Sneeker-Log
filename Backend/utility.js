import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import firebase from 'firebase'
import firebase from '@react-native-firebase/app';
import RNFetchBlob from 'react-native-fetch-blob';
import storage from '@react-native-firebase/storage';
const db = firestore();
// import { _storeData } from "../../backend/AsyncFuncs";

// let currentUserId = '';

export async function connectFirebase() {
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyDtA8oWLBNVTyWPdSOcMa1mgo5Abgcj-i0',
    authDomain: 'pokerapp-84d4e.firebaseapp.com',
    databaseURL: 'https://pokerapp-84d4e.firebaseio.com',
    projectId: 'pokerapp-84d4e',
    storageBucket: 'pokerapp-84d4e.appspot.com',
    messagingSenderId: '516149506406',
    appId: '1:516149506406:web:8f4176fb666c493d48d8a7',
    measurementId: 'G-CVTJ8DTPWM',
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
}

export async function getAllOfCollection(collection) {
  let data = [];
  let querySnapshot = await firestore().collection(collection).get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      //console.log(doc.data());
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export const getDataOnChange = (collection, setData) => {
  firestore()
    .collection(collection)
    .onSnapshot(function (querySnapshot) {
      var data = [];
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          const item = doc.data();
          item._id = doc.id;
          // console.log('Check item', item)
          data.push(item);
        } else {
          console.log('No document found!');
        }
      });
      // console.log('Jusck Check', data)
      setData(data);
    });
  return;
};

export function getData(collection, doc, objectKey) {
  // check if data exists on the given path
  if (objectKey === undefined) {
    return firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          return false;
        }
      });
  } else {
    return firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists && doc.data()[objectKey] != undefined) {
          return doc.data()[objectKey];
        } else {
          return false;
        }
      });
  }
}

export async function saveDataWithoutDocId(collection, jsonObject) {
  return firestore()
    .collection(collection)
    .add(jsonObject)
    .then(function (docRef) {
      return docRef.id;
    })
    .catch(function (error) {
      alert(error);
    });
}

export async function saveData(collection, doc, jsonObject) {
  firestore()
    .collection(collection)
    .doc(doc)
    .set(jsonObject, { merge: true })
    .then(function () {
      console.log('Document successfully written!');
    })
    .catch(function (error) {
      console.error('Error writing document: ', error);
    });
}

export async function saveData2(collection, doc, jsonObject) {
  await db.collection(collection).doc(doc).set(jsonObject, { merge: true }).catch(function (error) {
    console.error("Error writing document: ", error);
  });
  //console.log("Document successfully written!"); 
}
export async function saveInitialData(collection, userId) {
  firestore()
    .collection(collection)
    .doc(userId)
    .set({ userdocc: 'Me' })
    .then(function () {
      alert('Data saved succesfuly');
    })
    .catch(function (error) {
      alert(error);
    });
}

// //Save coordinates of collector to firestore
// export async function saveCoordinates(collection, doc, jsonObject) {
//   firestore()
//     .collection(collection)
//     .doc(doc)
//     .set({ jsonObject })
//     .then(function () {
//       console.log("Coordinates saved successfuly");
//     })
//     .catch({
//       function(error) {
//         console.log("Failed to save coordinates: ", error);
//       },
//     });
// }

export async function addToArray(collection, doc, array, value) {
  firestore()
    .collection(collection)
    .doc(doc)
    .update({
      [array]: firebase.firestore.FieldValue.arrayUnion(value),
    });
}

export async function updateData(collection, doc, array, value) {
  firestore()
    .collection(collection)
    .doc(doc)
    .update({
      [array]: value,
    });
}

export async function updateField(collection, doc, obj) {
  return firebase.firestore().collection(collection).doc(doc).update(obj);
}

// export async function updatePointsData(collection, doc, value) {
//   firestore().collection(collection).doc(doc).update(value);
// }

export async function uploadImage(folder, imageName, imageBase64) {
  var storageRef = storage().ref();
  var pathRef = storageRef.child(folder + '/' + imageName);
  var metadata = {
    contentType: 'image/jpeg',
  };

  let uploadTask = pathRef.putString(imageBase64, 'base64', metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED,
    function (snapshot) {
      var progress = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(2);
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
      }
    },
    function (error) {
      console.log(error);
    },
    function () {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        var listings = firebase.firestore().collection('listings');
        let querySnapshot = listings.where('image', '==', 'imageName').get();
        querySnapshot.forEach(function (doc) {
          if (doc.exists) {
            console.log(doc.data());

            console.log(listings);
            console.log(doc);
            doc.update({ image: downloadURL });
          } else {
            console.log('No document found!');
          }
        });
      });
    },
  );
}

export async function uploadImage_returnURL(
  imgUri,
  mime = 'image/jpeg',
  imagePath,
  name,
  callBack,
) {
  console.log('in upload image......................');
  //blob
  const Blob = RNFetchBlob.polyfill.Blob;
  const fs = RNFetchBlob.fs;

  //keep reference to original value
  const originalXMLHttpRequest = window.XMLHttpRequest;
  window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
  window.Blob = Blob;

  const uploadUri =
    Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
  const imageRef = storage().ref(imagePath);

  let readingFile = await fs.readFile(uploadUri, 'base64');
  let blob = await Blob.build(readingFile, { type: `${mime};BASE64` });

  let uploadTask = imageRef.put(blob, { contentType: mime, name: name });

  let progress = 0;
  //Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED,
    function (snapshot) {
      console.log('Bytes transferred ' + snapshot.bytesTransferred);
      console.log('Total bytes ' + snapshot.totalBytes);
      // var progress = ( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
      if (progress < 30) {
        progress += 10;
      } else if (progress >= 30) {
        progress += 5;
      } else if (progress >= 85) {
        progress += 1;
      } else if (progress >= 95) {
        progress += 0.1;
      }

      _storeData(
        GlobalConst.STORAGE_KEYS.imageUploadProgress,
        progress.toString(),
      );
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
      }
    },
    function (error) {
      console.log(error);
      _storeData(GlobalConst.STORAGE_KEYS.imageUploadProgress, '-1').then(
        () => {
          return 0;
        },
      );
    },

    async function () {
      window.XMLHttpRequest = originalXMLHttpRequest;

      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        callBack(downloadURL);
      });
    },
  );
}

// export async function downloadImage(folder, imageName) {
//   var storageRef = firebase.storage().ref();
//   var pathRef = storageRef.child(folder + "/" + imageName);

//   let url = await pathRef.getDownloadURL();
//   return url;
// }

export async function blockUser(collection, blocked, updatedData) {
  return firebase.firestore().collection(collection).doc(blocked).update(updatedData);
}
export async function ReportActivity(collection, data) {
  return firebase.firestore().collection(collection).doc().set(data);
}