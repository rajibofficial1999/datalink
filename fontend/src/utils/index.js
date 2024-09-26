import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import request from "./request.js";
import { MULTIPLE_DELETE_DATA, OTP_VERIFY, SEND_OTP_CODE } from "./api-endpoint.js";
import { successToast } from "./toasts/index.js";
export const cn = (...classes) => twMerge(clsx(...classes));

const checkboxDeleteHandler = () => {
  const checkInputs = document.querySelectorAll('#tableCheckBox:checked');

  let dataIds = [];
  checkInputs.forEach((input, i) => {
    dataIds[i] = input.value
  })

  return dataIds
}


export const handleMultipleDelete = async (dbTableName) => {
  let ids = checkboxDeleteHandler();

  if(ids.length <= 0) {
    return false
  }

  try {
    const { data } = await request.post(`${MULTIPLE_DELETE_DATA}/${dbTableName}`, {
      data_ids: ids,
    });
    successToast(data.success);
  } catch (error) {
    console.error(error);
  }
};

export const verifyOTPCode = async (otpCode, verifyToken, loginAfterVerified = false) => {
  const { data } = await request.post(OTP_VERIFY, {
    otp_code : otpCode,
    token : verifyToken,
    loginAfterVerified : loginAfterVerified,
  });

  return data
}


export const sendOTPCode = async (user_id, email = null) => {
  const { data } = await request.post(SEND_OTP_CODE, {
    user_id,
    email
  });

  return data
}
