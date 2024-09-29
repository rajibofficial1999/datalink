import Section from "../../Components/Section.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import OrderInfo from "../../Components/OrderInfo.jsx";

const Index = () => {

  return (
    <Section>
      <InnerSection heading='Pending Orders'>
        <OrderInfo fetchPendingOrder={true}/>
      </InnerSection>
    </Section>
  )
}
export default Index
