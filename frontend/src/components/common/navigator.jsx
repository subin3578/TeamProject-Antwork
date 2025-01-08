import { Link } from "react-router-dom";

export default function Navigator() {
  return (
    <>
      <nav className="nav-menu ">
        <div className="nav-item">
          <Link to="/antwork/">
            <img
              src="/images/ico/home_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
              alt="home"
            />
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/antwork/calendar">
            <img
              src="/images/ico/event_available_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
              alt="calendar"
            />
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/antwork/chatting">
            <img src="/images/ico/nav_chat.svg" alt="message" />
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/antwork/page">
            <img
              src="/images/ico/edit_document_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
              alt="page"
            />
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/antwork/project/main">
            <img
              src="/images/ico/group_add_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
              alt="project"
            />
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/antwork/board">
            <img
              src="/images/ico/content_paste_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
              alt="board"
            />
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/antwork/drive">
            <img
              src="/images/ico/cloud_download_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
              alt="drive"
            />
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/antwork/setting/myinfo">
            <img
              src="/images/ico/settings_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
              alt="setting"
            />
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/antwork/admin">
            <img src="/images/ico/nav_admin_24_666666.svg" alt="admin" />
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/antwork/approval">
            <img src="/images/ico/nav_approval_24_666666.svg" alt="admin" />
          </Link>
        </div>
      </nav>
    </>
  );
}
