import AntWorkLayout from "../../../layouts/AntWorkLayout";

import DriveAside from "../../../components/common/aside/driveAside";
import DriveModal from "../../../components/common/modal/driveModal";
import DriveRecylceSection from "../../../components/main/drive/driveRecycleSection";

export default function DriveRecylcePage() {
  return (
    <>
      <AntWorkLayout>
        <DriveAside />
        <DriveRecylceSection />
        <DriveModal />
      </AntWorkLayout>
    </>
  );
}
