import { PENDING_USERS } from "../../utils/api-endpoint.js";
import Section from "../../Components/Section.jsx";

import InnerSection from "../../Components/InnerSection.jsx";

import UserInfo from "../../Components/UserInfo.jsx";

const Index = () => {

  return (
    <Section>
      <InnerSection heading='Pending Users'>
        <UserInfo
          url={PENDING_USERS}
        />
      </InnerSection>
    </Section>
  )
}
export default Index
