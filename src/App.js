import React, { useState } from "react";

const App = () => {
  const [image, setImage] = useState("");
  const submitImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "mannhack");
    data.append("cloud_name", "dwdstuepw");

    fetch("https://api.cloudinary.com/v1_1/dwdstuepw/image/upload", {
      method: "POST",
      body: data,
    })
      .then(async(response) => {
        const json = await response.json();
        console.log(json);
      })
  };
  return (
    <div>
      <div>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={submitImage}>upload</button>
      </div>
    </div>
  );
};

export default App;
