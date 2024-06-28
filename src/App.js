import React, { useState } from "react";
import bcrypt from "bcryptjs";

const App = () => {
  const [image, setImage] = useState("");
  const [password, setPassword] = useState('')
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
  const submitPassword = () => {
      const hashPwd = bcrypt.hashSync(password);
      console.log(hashPwd);

      bcrypt.compare(password, hashPwd, function (err, result){
        if(err) throw "Error: " + err
        else console.log(result);
      })
  };
  return (
    <div>
      <div>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={submitImage}>upload</button>
      </div>
      <div>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={submitPassword}>submit</button>
      </div>
    </div>
  );
};

export default App;
