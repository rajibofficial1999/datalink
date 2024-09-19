import Section from "../../Components/Section.jsx";
import Processing from "../../Components/Processing.jsx";
import InnerSection from "../../Components/InnerSection.jsx";
import { useState } from "react";

const Index = () => {

  const [isProcessing, setIsProcessing] = useState(false)

const pageRefresh = () => {

}

  return (
   <>
     <Section>
       <InnerSection heading='Notifications' pageRefresh={pageRefresh}>
         <Processing processing={isProcessing}>

         </Processing>
       </InnerSection>
     </Section>
   </>
  )
}
export default Index
