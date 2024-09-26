import Section from "../../Components/Section.jsx";

import InnerSection from "../../Components/InnerSection.jsx";

import UserInfo from "../../Components/UserInfo.jsx";

const Index = () => {

  return (
    <Section>
      <InnerSection heading='Pending Users'>
        <UserInfo
          fetchPendingUser={true}
        />
      </InnerSection>
    </Section>
  )
}
export default Index
