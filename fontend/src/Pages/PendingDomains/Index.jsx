import Section from "../../Components/Section.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import DomainInfo from "../../Components/DomainInfo.jsx";

const Index = () => {

  return (
    <Section>
      <InnerSection heading='Pending Domains'>
        <DomainInfo fetchPendingDomain={true}/>
      </InnerSection>
    </Section>
  )
}
export default Index
