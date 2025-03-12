import { useState, useEffect } from "react";

export default function Put({ tag, handleMain, updatePut }) {
  const [name, setName] = useState(tag.name);
  const [age, setAge] = useState(tag.age);
  const [email, setEmail] = useState(tag.email);

  async function handleUpdate(e) {
    e.preventDefault();
    const isFetch = await fetch(
      "https://crud-application-nine-kohl.vercel.app/api/mongo",
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-put-id": tag.id,
        },
        body: JSON.stringify({ name: name, age: age, email: email }),
      }
    );
    switch (isFetch.status) {
      case 200:
        {
          const isResp = await isFetch.json();
          alert(isResp.success);
          updatePut();
        }
        break;
      case 400:
        {
          const isResp = await isFetch.json();
          alert(isResp.error);
        }
        break;
      case 500:
        {
          const isResp = await isFetch.json();
          alert(isResp.error);
        }
        break;
      case 204:
        {
          console.log("The update is the same");
        }
        break;
      default:
        console.log("invalid user");
        break;
    }
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
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
