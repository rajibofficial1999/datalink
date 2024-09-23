import { CopyToClipboard } from "react-copy-to-clipboard";
import { successToast } from "../utils/toasts/index.js";

const ClipboardData = ({ value, children }) => {
  return (
    <>
      <CopyToClipboard text={value} onCopy={() => successToast('Copied to clipboard')}>
        {children}
      </CopyToClipboard>
    </>
  )
}

export default ClipboardData
