import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FooterCmsDTO } from "@/model/dto/cms.dto";

type FooterState = {
  dto: FooterCmsDTO | null;
  loading: boolean;
  error?: string;
};

const initialState: FooterState = {
  dto: null,
  loading: false,
};

const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {
    setFooterData(state, action: PayloadAction<FooterCmsDTO>) {
      state.dto = action.payload;
      state.loading = false;
      state.error = undefined;
    },
  },
});

export const { setFooterData } = footerSlice.actions;
export default footerSlice.reducer;
