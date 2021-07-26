import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  projectListActions,
  selectProjectModalOpen,
} from "./project-list.slice";

export const ProjectModal = () => {
  const dispatch = useDispatch();
  const projectModalOpen = useSelector(selectProjectModalOpen);
  return (
    <Drawer
      visible={projectModalOpen}
      width="100%"
      onClose={() => dispatch(projectListActions.closeProjectModal())}
    >
      <h1>Project Modal</h1>
    </Drawer>
  );
};
