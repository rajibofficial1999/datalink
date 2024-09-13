const Section = ({children}) => {
  return <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
    {children}
  </section>
}
export default Section
