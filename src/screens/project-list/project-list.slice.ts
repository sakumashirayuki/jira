import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

interface State {
  projectModalOpen: boolean;
}

const initialState: State = {
  projectModalOpen: false,
};

export const projectListSlice = createSlice({
  name: "projectListSlice", // 标识slice的名称
  initialState,
  reducers: {
    openProjectModal(state) {
      // state和action为reducers规定的形参，只是这两个函数用不到action的参数
      state.projectModalOpen = true;
    },
    closeProjectModal(state) {
      // redux-toolkit内部会将其转换为返回新对象的写法，内部内置了immer
      state.projectModalOpen = false;
    },
  },
});
// 这里的actions为上面定义的方法
export const projectListActions = projectListSlice.actions;
// 暴露state。来自根的状态树
export const selectProjectModalOpen = (state: RootState) =>
  state.projectList.projectModalOpen;
