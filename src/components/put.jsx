import { useState, useEffect } from "react";

export default function Put({ tag, handleMain, updatePut }) {
  const [name, setName] = useState(tag.name);
  const [age, setAge] = useState(tag.age);
  const [email, setEmail] = useState(tag.email);

  async function handleUpdate(e) {
    e.preventDefault();
    const isFetch = await fetch("http://localhost:3000/users", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-user-id": tag.id,
      },
      body: JSON.stringify({ name: name, age: age, email: email }),
    });
    if (isFetch.status === 200) {
      const isResp = await isFetch.json();
      alert(isResp.message);
      updatePut();
    } else if (isFetch.status === 400) {
      const isResp = await isFetch.json();
      alert(isResp.message);
    }
    return;
  }

  return (
    <>
      <div onClick={handleMain} className="put-modal">
        <div className="put-content">
          <form onSubmit={handleUpdate} id="update-form">
            <div>
              <input
                type="text"
                placeholder="Enter username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </form>
          <div>
            <button id="update-btn" form="update-form">
              Update
            </button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
