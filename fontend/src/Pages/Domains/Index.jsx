import Section from "../../Components/Section.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import DomainInfo from "../../Components/DomainInfo.jsx";

const Index = () => {

  return (
    <Section>
      <InnerSection heading='Domains'>
        <DomainInfo fetchPendingDomain={false}/>
      </InnerSection>
    </Section>
  )
}
export default Index
