import AntWorkLayout from "../../../layouts/AntWorkLayout";

import DriveAside from "../../../components/common/aside/driveAside";
import DriveModal from "../../../components/common/modal/driveModal";
import DriveShareSection from "../../../components/main/drive/driveShareSection";

export default function DriveSharePage() {
  return (
    <>
      <AntWorkLayout>
        <DriveAside />
        <DriveShareSection />
        <DriveModal />
      </AntWorkLayout>
    </>
  );
}
