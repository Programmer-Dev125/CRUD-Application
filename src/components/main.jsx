import { useEffect, useState } from "react";
import Fetch from "./fetch";
import Post from "./post";

export default function Main() {
  const [users, setUsers] = useState([]);
  const [isUpdate, setIsUpdate] = useState(0);

  useEffect(() => {
    (async () => {
      const isFetch = await fetch(
        "https://crud-application-nine-kohl.vercel.app/api/mongo",
        {}
      );
      switch (isFetch.status) {
        case 200:
          {
            const isResp = await isFetch.json();
            setUsers(isResp);
          }
          break;
        case 500:
          {
            const isResp = await isFetch.json();
            console.log(isResp);
          }
          break;
        default:
          console.log("To store");
          break;
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
