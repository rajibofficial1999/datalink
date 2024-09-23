import { cn } from "../utils/index.js";

const Section = ({className, children}) => {
  return <section className={cn('mb-20', className)}>
    {children}
  </section>
}
export default Section
