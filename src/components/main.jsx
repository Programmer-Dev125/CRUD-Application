import { useEffect, useState } from "react";
import Fetch from "./fetch";
import Post from "./post";

export default function Main() {
  const [users, setUsers] = useState([]);
  const [isUpdate, setIsUpdate] = useState(0);

  useEffect(() => {
    (async () => {
      const isFetch = await fetch("http://localhost:3000/users", {
        headers: {
          Authorization: `${btoa("AbdulAhad2abc1071099")}`,
        },
      });
      if (isFetch.status === 401) {
        const isResp = await isFetch.text();
        console.log(isResp);
      } else if (isFetch.status === 200) {
        const isResp = await isFetch.json();
        setUsers(isResp);
      }
    })();
  }, [isUpdate]);

  return (
    <>
      <div className="row w90 space-between align-start mt100 isResponse-row">
        <Post updateState={() => setIsUpdate((n) => n + 1)} />
        <Fetch
          users={users}
          isPut={() => setIsUpdate((n) => n + 1)}
          isDelete={() => setIsUpdate((n) => n + 1)}
        />
      </div>
    </>
  );
}
