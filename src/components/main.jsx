import { useEffect, useState } from "react";
import Fetch from "./fetch";
import Post from "./post";

export default function Main() {
  const [users, setUsers] = useState([]);
  const [isUpdate, setIsUpdate] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("Fetching...");

  useEffect(() => {
    (async () => {
      setIsSending(true);
      const isFetch = await fetch(
        "https://crud-application-nine-kohl.vercel.app/api/mongo",
        {
          headers: {
            authorization: "QWJkdWxBaGFkV2VkbmVzZGF5TWFyY2gxMjIwMjU",
          },
        }
      );
      switch (isFetch.status) {
        case 200:
          {
            const isResp = await isFetch.json();
            setIsSending(false);
            setUsers(isResp);
          }
          break;
        case 500:
          {
            const isResp = await isFetch.json();
            setIsSending(false);
            console.log(isResp);
          }
          break;
        default:
          console.log("To store");
          setIsSending(false);
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
      {isSending && (
        <div className="sending-fix">
          <div className="sending-fix-content">
            <p>{message}</p>
          </div>
        </div>
      )}
    </>
  );
}
