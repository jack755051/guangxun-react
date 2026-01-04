import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { HeaderCmsDTO } from "@/model/dto/cms.dto";

type HeaderState = {
  dto: HeaderCmsDTO | null;
  loading: boolean;
  error?: string;
};

const initialState: HeaderState = {
  dto: null,
  loading: false,
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderData(state, action: PayloadAction<HeaderCmsDTO>) {
      state.dto = action.payload;
      state.loading = false;
      state.error = undefined;
    },
    setHeaderLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setHeaderError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearHeaderError(state) {
      state.error = undefined;
    },
  },
});

export const { setHeaderData, setHeaderLoading, setHeaderError, clearHeaderError } =
  headerSlice.actions;
export default headerSlice.reducer;
