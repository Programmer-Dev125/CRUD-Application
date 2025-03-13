import { useState } from "react";

export default function Post({ updateState }) {
  const [user, setUser] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !age || !email) return;
    if (isError) {
      document.querySelector(".ticker").classList.add("active");
      setTimeout(() => {
        document.querySelector(".ticker").classList.remove("active");
      }, 3000);
      return;
    }
    document.querySelectorAll(".valid").forEach((value) => {
      value.classList.remove("valid");
    });
    const isFetch = await fetch(
      "https://crud-application-nine-kohl.vercel.app/api/mongo",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "QWJkdWxBaGFkV2VkbmVzZGF5TWFyY2gxMjIwMjU",
        },
        body: JSON.stringify({ name: user, age: age, email: email }),
      }
    );
    switch (isFetch.status) {
      case 201:
        {
          const isResp = await isFetch.json();
          alert(isResp.success);
          updateState();
        }
        break;
      case 400:
        {
          const isResp = await isFetch.json();
          alert(isResp.error);
        }
        break;
      case 409:
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
      default:
        alert("Invalid Request");
        break;
    }

    setUser("");
    setAge("");
    setEmail("");
  }

  function handleChange(e) {
    const { id, value } = e.target;

    switch (id) {
      case "user-field":
        setUser(value);
        if (/^[0-9A-Za-z ]*$/.test(value)) {
          e.target.classList.remove("error");
          e.target.classList.add("valid");
          setIsError(false);
        } else {
          e.target.classList.add("error");
          e.classList.remove("valid");
          setIsError(true);
        }
        break;
      case "age-field":
        setAge(value);
        if (/^[0-9]*$/.test(value)) {
          e.target.classList.remove("error");
          e.target.classList.add("valid");
          setIsError(false);
        } else {
          e.target.classList.add("error");
          e.target.classList.remove("valid");
          setIsError(true);
        }
        break;
      case "email-field":
        setEmail(value);
        if (/^[A-Za-z0-9]*@gmail\.com$/.test(value)) {
          e.target.classList.remove("error");
          e.target.classList.add("valid");
          setIsError(false);
        } else {
          e.target.classList.add("error");
          e.target.classList.remove("valid");
          setIsError(true);
        }
        break;
      default:
        break;
    }
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
            placeholder="username"
            value={user}
            onChange={handleChange}
            required
          />
          <small>~Username should only contain alphabets and numbers~</small>
        </div>
        <div>
          <input
            type="text"
            id="age-field"
            placeholder="age"
            value={age}
            onChange={handleChange}
            required
          />
          <small>~Enter a valid age~</small>
        </div>
        <div>
          <input
            type="text"
            id="email-field"
            placeholder="email"
            value={email}
            onChange={handleChange}
            required
          />
          <small>~Enter an email like: address@gmail.com~</small>
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
      <div className="ticker">
        <div>
          <p>Incorrect Fields</p>
        </div>
      </div>
    </>
  );
}
