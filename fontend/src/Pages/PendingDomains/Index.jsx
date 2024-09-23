import { PENDING_DOMAINS } from "../../utils/api-endpoint.js";
import Section from "../../Components/Section.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import DomainInfo from "../../Components/DomainInfo.jsx";

const Index = () => {

  return (
    <Section>
      <InnerSection heading='Pending Domains'>
        <DomainInfo url={PENDING_DOMAINS}/>
      </InnerSection>
    </Section>
  )
}
export default Index
