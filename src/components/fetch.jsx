import { useState } from "react";
import Put from "./put.jsx";
import Delete from "./delete.jsx";

export default function Fetch({ users, isPut, isDelete }) {
  const [showPut, setShowPut] = useState(false);
  const [selUser, setSelUser] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      id="edit-btn"
                      onClick={() => {
                        setShowPut(true);
                        setSelUser(user);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      id="del-btn"
                      onClick={() => {
                        setShowDelete(true);
                        setSelUser(user);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>No user to show</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {showPut && (
          <Put
            tag={selUser}
            updatePut={() => {
              isPut();
              setShowPut(false);
            }}
            handleMain={(e) => {
              e.stopPropagation();
              if (
                e.target.classList.contains("put-modal") ||
                e.target.classList.contains("cancel-btn")
              ) {
                setShowPut(false);
              }
            }}
          />
        )}
      </div>
      <div>
        {showDelete && (
          <Delete
            updateDelete={isDelete}
            handleMain={(e) => {
              e.stopPropagation();
              if (
                e.target.classList.contains("del-modal") ||
                e.target.classList.contains("del-btn-modal")
              ) {
                setShowDelete(false);
              }
            }}
            tag={selUser}
          />
        )}
      </div>
    </>
  );
}
