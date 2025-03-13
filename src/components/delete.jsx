export default function Delete({ tag, handleMain, updateDelete }) {
  async function handleDelete() {
    const isFetch = await fetch(
      "https://crud-application-nine-kohl.vercel.app/api/mongo",
      {
        method: "DELETE",
        headers: {
          "x-del-id": tag.id,
          // authorization: "QWJkdWxBaGFkV2VkbmVzZGF5TWFyY2gxMjIwMjU",
        },
      }
    );
    switch (isFetch.status) {
      case 200:
        {
          const isResp = await isFetch.json();
          alert(isResp.success);
          updateDelete();
        }
        break;
      case 500:
        {
          const isResp = await isFetch.json();
          console.log(isResp);
        }
        break;
      case 400:
        {
          const isResp = await isFetch.json();
          console.log(isResp);
        }
        break;
      default:
        console.log("invalid user");
        break;
    }
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
