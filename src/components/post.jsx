import { useState } from "react";

export default function Post({ updateState }) {
  const [user, setUser] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (user.length === 0 && age.length === 0 && email.length === 0) return;
    const isFetch = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `${btoa("AbdulAhad2abc1071099")}`,
      },
      body: JSON.stringify({ name: user, age: age, email: email }),
    });
    if (isFetch.status === 201) {
      const isResp = await isFetch.json();
      alert(isResp.message);
      updateState();
    } else if (isFetch.status === 400) {
      const isFailure = await isFetch.json();
      alert(isFailure.message);
    }
    setUser("");
    setAge("");
    setEmail("");
    return;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="post-form" autoComplete="off">
        <div className="mb20">
          <label>Add new user</label>
        </div>
        <div>
          <input
            type="text"
            id="user-field"
            placeholder="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            id="age-field"
            placeholder="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            id="email-field"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </>
  );
}
