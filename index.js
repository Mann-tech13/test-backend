const express = require("express");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
// const multer = require('multer');
const admin = require("firebase-admin");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function uploadAndGet() {
  const upload = await bucket.upload("./sample.jpg", {
    public: true
  });
  console.log(upload);
  console.log("********************************");


const storage = getStorage();
getDownloadURL(ref(storage, '/'))
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'

    // This can be downloaded directly:
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();

    // Or inserted into an <img> element
    console.log(url);
  })

    // Or inserted into an <img> element
   
  // options for the getSignedUrl() function
 
}

var serviceAccount = require("./ServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var bucket = admin.storage().bucket("gs://image-storage-test-67240.appspot.com");
uploadAndGet();
