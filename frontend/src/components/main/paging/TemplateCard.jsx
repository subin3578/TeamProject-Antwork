import { useNavigate } from "react-router-dom";

export const TemplateCard = ({
  page,
  menuActive,
  setMenuActive,
  menuOptions,
  isDeleted = false,
  hideAuthor = false,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/antwork/page/template/view/${page._id}`);
  };

  return (
    <div
      className="page-card cursor-pointer"
      key={page._id}
      onClick={handleCardClick}
    >
      <div className="card-content">
        <div className="user-details">
          {!isDeleted ? (
            <h3 className="!text-[15px] !mb-3 !font-normal">
              {page.icon}&nbsp;&nbsp;{page.title}
            </h3>
          ) : (
            <h3 className="!text-[15px] !mb-3 !font-normal">
              {page.icon}&nbsp;&nbsp;{page.title}
            </h3>
          )}
          {
            <div className="user-info !ml-3">
              <p className="!text-[13px]">{page.ownerName || "Unknown"}</p>
            </div>
          }
        </div>
        <div className="relative menu-container">
          <button
            className="options-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuActive(menuActive === page._id ? null : page._id);
            }}
          >
            ⋮
          </button>
          {menuActive === page._id && menuOptions}
        </div>
      </div>
    </div>
  );
};
