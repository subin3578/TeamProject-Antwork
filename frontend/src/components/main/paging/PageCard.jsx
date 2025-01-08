import { Link } from "react-router-dom";

export const PageCard = ({
  page,
  menuActive,
  setMenuActive,
  menuOptions,
  isDeleted = false,
}) => {
  return (
    <div className="page-card" key={page._id}>
      <div className="card-content">
        <div className="user-details">
          {!isDeleted ? (
            <Link
              to={`/antwork/page/write?id=${page._id}`}
              className="!text-[15px] !mb-3 !font-normal"
            >
              <h3 className="!text-[15px] !mb-3 !font-normal">
                {page.icon}&nbsp;&nbsp;{page.title}
              </h3>
            </Link>
          ) : (
            <h3 className="!text-[15px] !mb-3 !font-normal">
              {page.icon}&nbsp;&nbsp;{page.title}
            </h3>
          )}
          <div className="user-info !ml-3">
            <img
              src={page.ownerImage || "/api/placeholder/32/32"}
              alt="profile"
              className="avatar"
            />
            <p className="!text-[13px]">{page.ownerName || "Unknown"}</p>
          </div>
        </div>
        <div className="relative menu-container">
          <button
            className="options-btn"
            onClick={() =>
              setMenuActive(menuActive === page._id ? null : page._id)
            }
          >
            ⋮
          </button>
          {menuActive === page._id && menuOptions}
        </div>
      </div>
    </div>
  );
};
