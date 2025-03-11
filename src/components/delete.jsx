export default function Delete({ tag, handleMain, updateDelete }) {
  async function handleDelete() {
    const isFetch = await fetch("http://localhost:3000/users", {
      method: "DELETE",
      headers: {
        "x-user-id": tag.id,
        authorization: `${btoa("AbdulAhad2abc1071099")}`,
      },
    });
    if (isFetch.status === 200) {
      const isResp = await isFetch.json();
      alert(isResp.message);
      updateDelete();
    } else if (isFetch.status === 400) {
      const isResp = await isFetch.json();
      alert(isResp.message);
    } else if (isFetch.status === 500) {
      const isResp = await isFetch.json();
      alert(isResp.message);
    }
    return;
  }
  return (
    <>
      <div onClick={handleMain} className="del-modal">
        <div className="del-content">
          <p>
            Are you sure you want to <span>delete</span> the {tag.name}?
          </p>
          <div>
            <button onClick={handleDelete} className="del-btn-modal">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
