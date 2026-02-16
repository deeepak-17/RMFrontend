const MissionStatement = () => {
  return (
    <section
      className="bg-[#064E3B] text-white py-[80px] md:py-[120px] px-6 flex flex-col items-center text-center w-full"
      aria-labelledby="mission-title"
    >
      <div className="max-w-[1280px] w-full">
        {/* Large Centered Teal-Colored Heading */}
        <h2
          id="mission-title"
          className="text-[#14B8A6] font-display text-[32px] md:text-[48px] font-bold leading-[1.2] tracking-[-0.01em] mb-6 max-w-[1000px] mx-auto"
        >
          ResQMeals is on a mission to end food waste while feeding communities that need it most.
        </h2>

        {/* Descriptive Paragraph */}
        <p
          className="text-white font-sans text-[18px] md:text-[20px] font-normal leading-[1.6] max-w-[800px] mx-auto opacity-90"
        >
          We connect restaurants, corporate canteens, and event organizers with local NGOs and shelters.
          Every meal rescued is a step toward a hunger-free, sustainable future.
        </p>
      </div>
    </section>
  );
};

export default MissionStatement;